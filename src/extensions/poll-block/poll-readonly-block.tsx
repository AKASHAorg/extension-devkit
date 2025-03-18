import React from 'react';
import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';

export const PollReadonlyBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  return <div>Content goes here</div>;
};
