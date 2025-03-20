// apis to use the deployed ceramic models

import { ComposeClient } from '@composedb/client';
import { definition } from './__generated__/definition';
import getSDK from '@akashaorg/core-sdk';

let composeClient: ComposeClient;

const getComposeClient = () => {
  if (!composeClient) {
    composeClient = new ComposeClient({
      ceramic: 'http://localhost:7007',
      definition,
    });
  }
  return composeClient;
};

const autorizeResources = async () => {
  const sdk = getSDK();
};

autorizeResources();

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
