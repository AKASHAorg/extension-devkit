import * as React from 'react';
import { withProviders } from '@akashaorg/ui-core-hooks';

import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';
import { PollBlock } from './poll-block';
import { PollReadonlyBlock } from './poll-readonly-block';

const ContentBlockModes = {
  EDIT: 'edit-mode',
  READONLY: 'read-only-mode',
};

const PollBlockExtension = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  return (
    <>
      {props.blockInfo.mode === ContentBlockModes.EDIT && <PollBlock {...props} />}
      {props.blockInfo.mode === ContentBlockModes.READONLY && <PollReadonlyBlock {...props} />}
    </>
  );
};
export default withProviders<ContentBlockRootProps>(PollBlockExtension);
