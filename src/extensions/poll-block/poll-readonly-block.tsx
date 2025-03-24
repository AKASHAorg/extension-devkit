import React, { useEffect, useState } from 'react';
import { BlockInstanceMethods, ContentBlockRootProps } from '@akashaorg/typings/lib/ui';
import { useAkashaStore } from '@akashaorg/ui-core-hooks';
import { getPollById } from '../../api';
import { getOptionPercentage } from '../../components/poll-page';
import { PollCard } from '../../components/poll-card';

type PollResponse = Awaited<ReturnType<typeof getPollById>>;

export const PollReadonlyBlock = (
  props: ContentBlockRootProps & { blockRef?: React.RefObject<BlockInstanceMethods> },
) => {
  const { content } = props;

  const valueString = content.value;
  const value = JSON.parse(valueString);
  const pollId = value.pollId;

  const [response, setResponse] = useState<PollResponse | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!pollId) return;
      const poll = await getPollById(pollId);
      setResponse(poll);
    };
    fetchPoll();
  }, [pollId]);

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  if (!response) {
    return <div>Loading poll...</div>;
  }

  if (response.error) {
    return <div>Error loading poll: {response.error}</div>;
  }

  const { poll, votes, votesByOption, totalVotes } = response.data!;

  if (!poll) {
    return <div>Poll not found</div>;
  }

  return <PollCard
    pollId={poll.id}
    title={poll.title}
    selectedOptions={votes.filter(
      vote => vote.voter.id === authenticatedDID && vote.pollID === poll.id,
    )}
    description={poll.description}
    options={poll.options.map(opt => ({
      id: opt.id,
      name: opt.name,
      percentage: getOptionPercentage(
        opt.id,
        votesByOption,
        'totalVotes' in poll ? totalVotes : 0,
      ),
    }))}
    loggedDID={authenticatedDID}
    authorDID={poll.author.id}
    publishedAt={`${new Date(poll.createdAt).toDateString()} - ${new Date(
      poll.createdAt,
    ).toLocaleTimeString()}`}
    totalVotes={totalVotes || 0}
    votesByOption={votesByOption}
  />;
};
