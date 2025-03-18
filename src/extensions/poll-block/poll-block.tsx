import {
  type BlockInstanceMethods,
  type CreateContentBlock,
  type ContentBlockRootProps,
} from '@akashaorg/typings/lib/ui';
import * as React from 'react';

export const PollBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const retryCount = React.useRef<number>();

  const createBlock = React.useCallback(async ({ nsfw }: CreateContentBlock) => {
    return {
      response: {
        blockID: '',
        error: '' /* error object */,
      },
      blockInfo: props.blockInfo,
      retryCount: retryCount.current,
    };
  }, []);

  const retryCreate = React.useCallback(
    (arg: CreateContentBlock) => {
      //retry logic goes here
      return createBlock(arg);
    },
    [createBlock],
  );

  React.useImperativeHandle(
    props.blockRef,
    () => ({
      createBlock,
      retryBlockCreation: retryCreate,
    }),
    [createBlock, retryCreate],
  );

  return <div>Poll creation form goes here</div>;
};
