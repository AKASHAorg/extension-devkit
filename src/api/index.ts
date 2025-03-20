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
  const composeClient = getComposeClient();

  if (!composeClient) {
    console.log('No compose client');
    return false;
  }

  const hasSession = await sdk.services.ceramic.hasSession();
  console.log('hasSession', hasSession);

  if (hasSession) {
    const sessDID = sdk.services.ceramic.getComposeClient().did;
    if (sessDID && sessDID !== composeClient.did) {
      composeClient.setDID(sessDID);
    }
  }
  return hasSession;
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
  return res;
};

export const createVote = async (pollId: string, optionId: string, isValid = true) => {
  const compose = getComposeClient();
  const res = await compose.executeQuery(
    `
    mutation CreateVote($input: CreateVoteInput!) {
      createVote(input: $input) {
        document {
          pollID
          optionId
          isValid
          created
        }
      }
    }
  `,
    {
      input: {
        content: {
          pollID: pollId,
          optionId,
          isValid,
          created: new Date().toISOString(),
        },
      },
    },
  );
  return res;
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
  return res;
};

export const getPollsByAuthorId = async (authorId: string) => {
  const compose = getComposeClient();
  const res = await compose.executeQuery(
    `
    query PollsByAuthor($authorId: ID!) {
      node(id: $authorId) {
        ... on CeramicAccount {
          pollList(last: 100) {
            edges {
              node {
                id
                title
                created
                options {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  `,
    { authorId },
  );
  return res;
};

export const getVotesByVoterId = async (voterId: string) => {
  const compose = getComposeClient();
  const res = await compose.executeQuery(
    `
    query VotesByVoter($voterId: ID!) {
      node(id: $voterId) {
        ...on CeramicAccount {
          voteList(last: 100) {
            edges {
              node {
                id
                created
                pollID
                optionId
                voter {
                  id
                }
              }
            }
          }
        }
      }
    }
  `,
    { voterId },
  );
  return res;
};

export const getVotesByPollId = async (pollId: string) => {
  const compose = getComposeClient();
  const res = await compose.executeQuery(`
    query VotesByPollId {
      voteIndex(
        first: 100
        filters: { where: { pollID: { equalTo: "${pollId}" } } }
      ) {
        edges {
          node {
            pollID
            optionId
            isValid
            created
            voter {
              id
            }
          }
        }
      }
    }
  `);
  return res;
};
