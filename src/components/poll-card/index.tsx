import * as React from 'react';
import { ContentCard, ContentCardBody } from '@/components/ui/content-card';
import { Typography } from '@/components/ui/typography';
import { Stack } from '@/components/ui/stack';
import { Progress } from '@/components/ui/progress';
import { Badge } from '../ui/badge';
import { POLL_SELECTIONS } from '../mock-data';
import { Check } from 'lucide-react';

const PollCard = ({
  pollId,
  title,
  description,
  options,
  author,
  publishedAt,
}: React.ComponentProps<typeof ContentCard> & {
  pollId: string;
  title: string;
  description: string;
  options: { id: string; value: string; percentage: number }[];
}) => {
  const loggedInDID = 'did:pkh:eip155:11155111:0x1a4b3c567890abcdeffedcba1234567890abcdef';
  const [pollSelections, setPollSelections] = React.useState(() => {
    const selectionsSet = new Set<{
      did: string;
      pollId: string;
      optionId: string;
      value: boolean;
    }>();
    options.forEach(option => {
      const selection = POLL_SELECTIONS.find(
        selection =>
          selection.did === loggedInDID &&
          selection.pollId === pollId &&
          option.id === selection.optionId,
      );
      if (selection) {
        selectionsSet.add(selection);
      }
    });
    return Array.from(selectionsSet);
  });
  return (
    <ContentCard author={author} publishedAt={publishedAt}>
      <ContentCardBody className="flex flex-col gap-4">
        <Typography variant="sm" bold>
          {title}
        </Typography>
        <Typography variant="sm">{description}</Typography>
        {options.map(option => (
          <Option
            value={option.value}
            percentage={option.percentage}
            selected={!!pollSelections.find(selection => selection.optionId === option.id)?.value}
            onSelected={selected => {
              const newSelections = [...pollSelections];
              const selection = newSelections.find(selection => selection.optionId === option.id);
              if (selection) {
                selection.value = selected;
                setPollSelections(newSelections);
              } else {
                setPollSelections([
                  ...newSelections,
                  {
                    did: loggedInDID,
                    pollId,
                    optionId: option.id,
                    value: selected,
                  },
                ]);
              }

              console.log(newSelections);
            }}
          />
        ))}
      </ContentCardBody>
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
              onSelected(false);
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
