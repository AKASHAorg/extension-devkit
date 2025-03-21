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
    return false;
  }
  const hasSession = await sdk.services.ceramic.hasSession();

  if (hasSession) {
    const sessDID = sdk.services.ceramic.getComposeClient().did;
    if (sessDID && sessDID !== composeClient.did) {
      composeClient.setDID(sessDID);
    }
  }
  return hasSession;
};

export const createPoll = async (
  title: string,
  description: string,
  options: { id: string; name: string }[],
) => {
  const compose = getComposeClient();
  try {
    const res = await compose.executeQuery(
      `
      mutation CreatePoll($input: CreatePollInput!) {
        createPoll(input: $input) {
          document {
            id
            title
            createdAt
            options {
              id
              name
            }
          }
        }
      }
    `,
      {
        input: {
          content: {
            title,
            description,
            createdAt: new Date().toISOString(),
            options,
          },
        },
      },
    );
    return res;
  } catch (err) {
    console.error('Error creating poll', err);
    return { error: err.message };
  }
};

export const createVote = async (pollId: string, optionID: string, isValid = true) => {
  const compose = getComposeClient();
  try {
    const res = await compose.executeQuery(
      `
      mutation CreateVote($input: CreateVoteInput!) {
        createVote(input: $input) {
          document {
            pollID
            optionID
            isValid
            createdAt
          }
        }
      }
    `,
      {
        input: {
          content: {
            pollID: pollId,
            optionID,
            isValid,
            createdAt: new Date().toISOString(),
          },
        },
      },
    );
    return res;
  } catch (err) {
    console.error('Error creating vote', err);
    return { error: err.message };
  }
};

export const getPolls = async () => {
  const compose = getComposeClient();
  try {
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
              createdAt
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
  } catch (err) {
    console.error('Error fetching polls', err);
    return { error: err.message };
  }
};

export const getPollsByAuthorId = async (authorId: string) => {
  const compose = getComposeClient();
  try {
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
                  createdAt
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
  } catch (err) {
    console.error('Error fetching polls by author', err);
    return { error: err.message };
  }
};

export const getVotesByVoterId = async (voterId: string) => {
  const compose = getComposeClient();
  try {
    const res = await compose.executeQuery(
      `
      query VotesByVoter($voterId: ID!) {
        node(id: $voterId) {
          ...on CeramicAccount {
            voteList(last: 100) {
              edges {
                node {
                  id
                  createdAt
                  pollID
                  optionID
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
  } catch (err) {
    console.error('Error fetching votes by voter id', err);
    return { error: err.message };
  }
};

export const getVotesByPollId = async (pollId: string) => {
  const compose = getComposeClient();
  try {
    const res = await compose.executeQuery(`
      query VotesByPollId {
        voteIndex(
          first: 100
          filters: { where: { pollID: { equalTo: "${pollId}" } } }
        ) {
          edges {
            node {
              pollID
              optionID
              isValid
              createdAt
              voter {
                id
              }
            }
          }
        }
      }
    `);
    return res;
  } catch (err) {
    console.error('Error fetching votes by poll id', err);
    return { error: err.message };
  }
};
