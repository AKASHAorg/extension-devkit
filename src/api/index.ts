// apis to use the deployed ceramic models

import { ComposeClient } from '@composedb/client';
import { definition } from './__generated__/definition';
import getSDK from '@akashaorg/core-sdk';

let composeClient: ComposeClient;

export const getComposeClient = () => {
  if (!composeClient) {
    composeClient = new ComposeClient({
      ceramic: 'http://localhost:7007',
      definition,
    });
  }
  return composeClient;
};

export const hasSession = async (): Promise<boolean> => {
  const sdk = getSDK();

  if (!composeClient) {
    return false;
  }

  const hasSession = await sdk.services.ceramic.hasSession();

  if (hasSession) {
    const sessDID = sdk.services.ceramic.getComposeClient().did;
    if (sessDID) {
      composeClient.setDID(sessDID);
      return true;
    }
    return false;
  }
  return false;
};

export const getPolls = async () => {
  const compose = getComposeClient();
  const res = await compose.executeQuery(`
    query AllPolls {
      pollIndex(first: 10) {
        edges {
          node {
            id
            title
            author {
              id
            }
            created
            options {
              id
              name
            }
          }
        }
      }
    }
  `);
  console.log(res);
  return res;
};

export const createPoll = async (title: string, options: { id: string; name: string }[]) => {
  const compose = getComposeClient();
  const res = await compose.executeQuery(`
    mutation CreatePoll {
      createPoll(input: {
        content: {
          title: "${title}",
          created: "${new Date().toISOString()}",
          options: [${options.map(opt => `{id: "${opt.id}", name: "${opt.name}"}`).join(',')}]
        }
      }) {
        document {
          title
          created
          options {
            id
            name
          }
        }
      }
    }
  `);
  console.log(res);
  return res;
};