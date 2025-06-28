import React, {
  FunctionComponent,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Text, TextLayoutEventData, TextProps, NativeSyntheticEvent } from 'react-native';

export type TruncationTextProps<T> = T & {
  numberOfLines: number;
  TextComponent?: FunctionComponent;
  onTruncationChange?: (isTruncation: boolean) => void;
  truncationChangeImmediately?: boolean;
  requiredProps?: (keyof TruncationTextProps<T>)[];
} & Pick<TextProps, 'style' | 'onTextLayout' | 'children'>;

const TruncationText = <T = Record<string, any>,>(props: TruncationTextProps<T>) => {
  const {
    TextComponent = Text,
    onTruncationChange,
    truncationChangeImmediately,
    numberOfLines,
    onTextLayout,
    requiredProps,
    ...rest
  } = props;
  const statusRef = useRef<boolean | undefined>(undefined);
  const [configs, setConfigs] = useState<{ width: number; lines: number }>();
  const [lines, setLines] = useState<number>();

  const _onTextLayout = useCallback(
    (e: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (numberOfLines && e.nativeEvent.lines.length < numberOfLines) {
        setLines(e.nativeEvent.lines.length);
      }
      setConfigs({
        width: Math.max(0, ...e.nativeEvent.lines.map((el) => el.width)),
        lines: e.nativeEvent.lines.length,
      });
      onTextLayout?.(e);
    },
    [numberOfLines, onTextLayout],
  );
  const onOriginalTextLayout = useCallback((e: NativeSyntheticEvent<TextLayoutEventData>) => {
    setLines(e.nativeEvent.lines.length);
  }, []);

  useEffect(() => {
    if (!configs?.lines || !lines) return;
    const curStatus = lines > configs.lines;
    if (curStatus !== statusRef.current || truncationChangeImmediately) {
      statusRef.current = curStatus;
      onTruncationChange?.(curStatus);
    }
  }, [configs?.lines, lines, onTruncationChange, truncationChangeImmediately]);

  useEffect(() => {
    if (typeof props.children !== 'string') return;
    setLines(undefined);
  }, [props.children]);

  return (
    <>
      <TextComponent
        {...rest}
        numberOfLines={numberOfLines}
        onTextLayout={numberOfLines ? _onTextLayout : onTextLayout}
      />
      {configs && lines === undefined ? (
        <TextComponent
          {...(requiredProps?.reduce(
            (prev, cur) => ({ ...prev, [cur]: props[cur] }),
            {} as TruncationTextProps<any>,
          ) ?? {})}
          style={[
            props.style,
            {
              position: 'absolute',
              top: -99999,
              left: -99999,
              width: configs.width,
              zIndex: -1,
            },
          ]}
          onTextLayout={onOriginalTextLayout}
        >
          {props.children}
        </TextComponent>
      ) : null}
    </>
  );
};

export default memo(TruncationText) as <T = TextProps>(
  props: TruncationTextProps<T>,
) => ReactElement;
