# react-native-truncation-text [![Monthly download](https://img.shields.io/npm/dm/react-native-truncation-text.svg)](https://img.shields.io/npm/dm/react-native-truncation-text.svg) [![Total downloads](https://img.shields.io/npm/dt/react-native-truncation-text.svg)](https://img.shields.io/npm/dt/react-native-truncation-text.svg)
A Text extension React Native component that includes onTruncationChange to enable reading more.
## Install
```bash
npm install react-native-truncation-text --save
```

### Example

```javascript
import React, { memo, useCallback, useState } from 'react';
import { View, Pressable, Text } from 'react-native';
import { TruncationText } from 'react-native-truncation-text';

const BATCH_NUMBER_OF_LINES = 10;

const MoreText = (props: { content: string }) => {
  const { content } = props;

  const [loadTimes, setLoadTimes] = useState(1);
  const [showMore, setShowMore] = useState<boolean>(false);
  const onLoadMore = useCallback(() => {
    setShowMore(false);
    setLoadTimes(prev => prev + 1);
  }, [setLoadTimes]);

  return (
    <View>
      <TruncationText
        numberOfLines={BATCH_NUMBER_OF_LINES * loadTimes}
        onTruncationChange={setShowMore}
        truncationChangeImmediately
      >
        {content}
      </TruncationText>
      {showMore ? (
        <Pressable onPress={onLoadMore}>
          <Text>show more</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

export default memo(MoreText);
```

## Props
| name                        | required | type                                  | default   | description                                          | Example                                            |
|-----------------------------|----------|---------------------------------------|-----------|------------------------------------------------------|----------------------------------------------------|
| numberOfLines               | true     | number                                | undefined | Max lines onf Text                                   | 2                                                  |
| onTruncationChange          | false    | ```(isTruncation: boolean) => void``` | undefined | Callback of truncation change                        | ```(isTruncation) => console.warn(isTruncation)``` |
| truncationChangeImmediately | false    | boolean                               | false     | Whether trigger onTruncationChange every text change | false                                              |
| TextComponent               | false    | FunctionComponent                     | Text      | The Text function component                          | Text                                               |
