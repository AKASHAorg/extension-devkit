import React from 'react';
import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';
import { Typography } from '@/components/ui/typography';

export const DadJokeReadonlyBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const stringifiedValue = JSON.parse(props.content.value);

  return <Typography>{stringifiedValue.joke}</Typography>;
};
