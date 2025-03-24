import * as React from 'react';
import { withProviders } from '@akashaorg/ui-core-hooks';
import {
  BlockInstanceMethods,
  ContentBlockModes,
  ContentBlockRootProps,
} from '@akashaorg/typings/lib/ui';
import { PollBlock } from './poll-block';
import { PollReadonlyBlock } from './poll-readonly-block';

const PollBlockExtension = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  return (
    <>
      {props.blockInfo.mode === 'edit-mode' && <PollBlock {...props} />}
      {props.blockInfo.mode === 'read-only-mode' && <PollReadonlyBlock {...props} />}
    </>
  );
};
export default withProviders<ContentBlockRootProps>(PollBlockExtension);
