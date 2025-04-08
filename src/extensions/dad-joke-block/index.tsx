import * as React from 'react';
import { withProviders } from '@akashaorg/ui-core-hooks';
import {
  BlockInstanceMethods,
  ContentBlockModes,
  ContentBlockRootProps,
} from '@akashaorg/typings/lib/ui';
import { DadJokeBlock } from './dad-joke';
import { DadJokeReadonlyBlock } from './dad-joke-readonly';

const DadJokeBlockExtension = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  return (
    <>
      {props.blockInfo.mode === ContentBlockModes.EDIT && <DadJokeBlock {...props} />}
      {props.blockInfo.mode === ContentBlockModes.READONLY && <DadJokeReadonlyBlock {...props} />}
    </>
  );
};
export default withProviders<ContentBlockRootProps>(DadJokeBlockExtension);
