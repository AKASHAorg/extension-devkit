import {
  type BlockInstanceMethods,
  type CreateContentBlock,
  type ContentBlockRootProps,
  IRootExtensionProps,
} from '@akashaorg/typings/lib/ui';
import * as React from 'react';
import PollForm, { PollHandlerRefType } from '../../components/poll-form';
import { Button } from '../../components/ui/button';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import {
  AkashaContentBlockBlockDef,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { encodeSlateToBase64, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { BlockLabeledValue } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import {
  useCreateContentBlockMutation,
  useGetAppsByPublisherDidQuery,
} from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import getSDK from '@akashaorg/core-sdk';
import { selectLatestAppVersionId } from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-by-publisher-did-query';
import { createPoll } from '../../api';

export const PollBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const [createContentBlock, contentBlockQuery] = useCreateContentBlockMutation();
  const pollRef = React.useRef<PollHandlerRefType>(null);
  const sdk = React.useRef(getSDK());
  const { name, logger } = useRootComponentProps<IRootExtensionProps>();
  const indexingDid = sdk.current.services.common.misc.getIndexingDID();
  const retryCount = React.useRef<number>();
  const appReq = useGetAppsByPublisherDidQuery({
    variables: {
      id: indexingDid,
      first: 1,
      filters: { where: { name: { equalTo: props.blockInfo.appName } } },
      sorting: { createdAt: SortOrder.Desc },
    },
    context: { source: sdk.current.services.gql.contextSources.default },
  });
  const appVersionID = selectLatestAppVersionId(appReq.data!);

  const createBlock = React.useCallback(
    async ({ nsfw }: CreateContentBlock) => {
      const pollFormValues = await pollRef.current?.getFormValues();
      console.log('pollFormValues', pollFormValues);

      if (!pollFormValues) {
        return {
          response: {
            blockID: '',
            error: 'Invalid poll form values',
            editorMentions: [],
          },
          blockInfo: props.blockInfo,
          retryCount: retryCount.current,
        };
      }

      const optionsWithIDs = pollFormValues.options.map((option, index) => ({
        id: index.toString(), // TODO - generate a unique id for the option
        name: option.value,
      }));

      const res = await createPoll(
        pollFormValues.title,
        pollFormValues.description,
        optionsWithIDs,
      );

      console.log({ res });

      const pollId = res.data?.createPoll.document.id;

      const contentBlockValue: BlockLabeledValue = {
        label: props.blockInfo.appName,
        propertyType: props.blockInfo.propertyType,
        value: JSON.stringify({ pollId }),
      };
      try {
        const resp = await createContentBlock({
          variables: {
            i: {
              content: {
                appVersionID: appVersionID,
                createdAt: new Date().toISOString(),
                content: [contentBlockValue],
                active: true,
                kind: AkashaContentBlockBlockDef.Text,
                nsfw,
              },
            },
          },
          context: { source: sdk.current.services.gql.contextSources.composeDB },
        });
        return {
          response: {
            blockID: resp.data?.createAkashaContentBlock?.document.id as string,
            error: '',
          },
          blockInfo: props.blockInfo,
          retryCount: retryCount.current,
        };
      } catch (err) {
        logger.error('error creating content block', err);
        return {
          response: {
            blockID: '',
            error: err.message,
          },
          blockInfo: props.blockInfo,
          retryCount: retryCount.current,
        };
      }
    },
    [createContentBlock, props.blockInfo, logger, appVersionID],
  );

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
