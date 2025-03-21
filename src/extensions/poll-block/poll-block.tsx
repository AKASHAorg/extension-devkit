import {
  type BlockInstanceMethods,
  type CreateContentBlock,
  type ContentBlockRootProps,
} from '@akashaorg/typings/lib/ui';
import * as React from 'react';
import PollForm, { PollHandlerRefType } from '../../components/poll-form';
import { Button } from '../../components/ui/button';
import { FieldValues, SubmitHandler } from 'react-hook-form';

export const PollBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const retryCount = React.useRef<number>();
  const pollRef = React.useRef<PollHandlerRefType>(null);
  const createBlock = React.useCallback(async ({ nsfw }: CreateContentBlock) => {
    // make a call to the createPoll function
    const result = await pollRef.current?.submitPoll();
    console.log('result', result);

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

  return (
    <>
      <PollForm ref={pollRef} hideSubmitButton />
    </>
  );
};
