import { ContentCard, ContentCardAction, ContentCardBody } from '@/components/ui/content-card';
import { Typography } from '@/components/ui/typography';
import { Stack } from '@/components/ui/stack';
import { Progress } from '@/components/ui/progress';
import { Badge } from '../ui/badge';
import { Check } from 'lucide-react';
import { useGetProfileByDidQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import { selectProfileData } from '@akashaorg/ui-core-hooks/lib/selectors/get-profile-by-did-query';
import { useEffect, useMemo, useState } from 'react';
import { Vote } from '@/api/types';
import { createVote } from '@/api';

const PollCard = ({
  pollId,
  title,
  description,
  options,
  authorDID,
  publishedAt,
  selectedOptions,
  loggedDID,
  totalVotes,
  votesByOption,
}: Omit<
  React.ComponentProps<typeof ContentCard> & {
    authorDID: string;
    pollId: string;
    title: string;
    description: string;
    options: { id: string; name: string; percentage: number }[];
    selectedOptions?: Vote[];
    loggedDID: string;
    totalVotes: number;
    votesByOption: { option: { id: string }; votesCount: number }[];
  },
  'author'
>) => {
  const profileDataRes = useGetProfileByDidQuery({ variables: { id: authorDID } });

  const author = useMemo(() => {
    if (profileDataRes.data) {
      return selectProfileData(profileDataRes.data);
    }
    return undefined;
  }, [profileDataRes]);

  const [pollSelections, setPollSelections] = useState<Vote[]>([]);
  const [votePercentage, setVotePercentage] = useState<{ [key: string]: number }>();

  useEffect(() => {
    if (selectedOptions) {
      setPollSelections(selectedOptions);
    }
  }, [selectedOptions]);

  useEffect(() => {
    setVotePercentage(prev => {
      if (!prev) {
        return {};
      }
      // only update if there is a vote with temp-id
      if (!pollSelections.find(selection => selection.id?.startsWith('temp-id'))) {
        return prev;
      }

      const newPercentage = { ...prev };
      pollSelections.forEach(selection => {
        const selId = selection.optionID;
        let selVoteCount = votesByOption.find(vote => vote.option.id === selId)?.votesCount || 0;
        // update total votes adding the ones that starts with temp-id
        const newTotalVotes =
          totalVotes + pollSelections.filter(sel => sel.id?.startsWith('temp-id')).length;

        if (selection.id?.startsWith('temp-id')) {
          selVoteCount += 1;
        }
        const percentage = (selVoteCount / newTotalVotes) * 100;
        newPercentage[selId] = Math.round(percentage);
      });
      return newPercentage;
    });
  }, [pollSelections, totalVotes]);

  useEffect(() => {
    if (totalVotes > 0) {
      setVotePercentage(
        options.reduce((acc, option) => {
          acc[option.id] = option.percentage;
          return acc;
        }, {}),
      );
    }
  }, [options, totalVotes]);

  const onVote = (optionId: string) => () => {
    setPollSelections(prev =>
      prev.concat({
        createdAt: new Date().toISOString(),
        id: `temp-id_${optionId}`,
        optionID: optionId,
        pollID: pollId,
        voter: { id: loggedDID },
        isValid: true,
      }),
    );
    createVote(pollId, optionId, true);
  };

  return (
    <ContentCard
      author={{ did: author?.did.id || '', name: author?.name || 'Unknown' }}
      publishedAt={publishedAt}
    >
      <ContentCardBody className="flex flex-col gap-4">
        <Typography variant="sm" bold>
          {title}
        </Typography>
        <Typography variant="sm">{description}</Typography>
        {options.map(option => (
          <Option
            value={option.name}
            key={option.id}
            percentage={votePercentage?.[option.id] || 0}
            selected={!!pollSelections.find(selection => selection.optionID === option.id)}
            onSelected={onVote(option.id)}
          />
        ))}
      </ContentCardBody>
      <ContentCardAction>
        <Typography variant="xs" className="text-muted-foreground">
          {totalVotes} votes
        </Typography>
      </ContentCardAction>
    </ContentCard>
  );
};

const Option = ({
  value,
  percentage,
  selected,
  onSelected,
  ...props
}: React.ComponentProps<typeof Stack> & {
  value: string;
  percentage: number;
  selected: boolean;
  onSelected: (selected: boolean) => void;
}) => {
  return (
    <Stack spacing={4} {...props}>
      <Typography variant="sm" bold>
        {value}
      </Typography>
      <Stack direction="row" alignItems="center" justifyContent="between" spacing={2}>
        <Stack direction="row" spacing={2} className="w-full">
          <Progress value={percentage} className="w-[75%]" />
          <Typography variant="xs" className="text-muted-foreground">
            ({percentage})%
          </Typography>
        </Stack>
        {selected ? (
          <Badge
            onClick={() => {
              // onSelected(false);
            }}
            className="cursor-pointer w-[88px]"
          >
            <Check /> Selected
          </Badge>
        ) : (
          <Badge
            variant="outline"
            onClick={() => {
              onSelected(true);
            }}
            className="cursor-pointer w-[88px]"
          >
            Select
          </Badge>
        )}
      </Stack>
    </Stack>
  );
};

export { PollCard };
