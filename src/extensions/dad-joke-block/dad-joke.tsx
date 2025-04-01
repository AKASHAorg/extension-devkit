import React, { useCallback } from 'react';
import getSDK from '@akashaorg/core-sdk';
import {
  BlockInstanceMethods,
  ContentBlockRootProps,
  CreateContentBlock,
} from '@akashaorg/typings/lib/ui';
import { Button } from '@/components/ui/button';
import { Stack } from '@/components/ui/stack';
import { Typography } from '@/components/ui/typography';
import {
  useCreateContentBlockMutation,
  useGetAppsQuery,
} from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { selectLatestRelease } from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-query';
import {
  AkashaContentBlockBlockDef,
  BlockLabeledValue,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

export const DadJokeBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const [joke, setJoke] = React.useState<string | null>(null);
  const [requesting, setRequesting] = React.useState<boolean>(false);

  const [createContentBlock, contentBlockQuery] = useCreateContentBlockMutation();
  const sdk = React.useRef(getSDK());

  const retryCount = React.useRef<number>(0);

  const fetchDadJoke = async () => {
    setRequesting(true);
    try {
      const response = await fetch('https://icanhazdadjoke.com/', {
        headers: {
          Accept: 'application/json',
        },
      });
      const data = await response.json();
      setJoke(data.joke);
    } catch (error) {
      console.error('Error fetching joke:', error.message);
    } finally {
      setRequesting(false);
    }
  };

  const appReq = useGetAppsQuery({
    variables: {
      first: 1,
      filters: { where: { name: { equalTo: props.blockInfo.appName } } },
    },
  });

  const appRelease = selectLatestRelease(appReq.data!);

  const createBlock = React.useCallback(
    async ({ nsfw }: CreateContentBlock) => {
      if (!appRelease?.node?.id) {
        return {
          response: {
            blockID: '',
            error: 'Extension not found!',
          },
          blockInfo: props.blockInfo,
          retryCount: retryCount.current,
        };
      }

      const contentBlockValue: BlockLabeledValue = {
        label: props.blockInfo.appName,
        propertyType: props.blockInfo.propertyType,
        value: JSON.stringify({ joke }),
      };

      try {
        const resp = await createContentBlock({
          variables: {
            i: {
              content: {
                appVersionID: appRelease?.node?.id,
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
        console.error('error creating content block', err.message);
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
    [createContentBlock, props.blockInfo, appRelease?.node?.id, joke],
  );

  const retryCreate = useCallback(
    async (arg: CreateContentBlock) => {
      if (contentBlockQuery.called) {
        contentBlockQuery.reset();
      }
      retryCount.current += 1;
      return createBlock(arg);
    },
    [contentBlockQuery, createBlock],
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
    <Stack direction="column" spacing={2}>
      {requesting && <Typography> fetching joke ...</Typography>}
      {joke && !requesting && <Typography>{joke}</Typography>}
      <div>
        <Button
          size="sm"
          type="button"
          className="self-end text(black dark:white)"
          disabled={requesting}
          onClick={fetchDadJoke}
        >
          {joke ? 'New joke' : 'Get joke'}
        </Button>
      </div>
    </Stack>
  );
};
