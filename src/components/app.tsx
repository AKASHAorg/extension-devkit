import { Button } from '@/components/ui/button';
import { FeedCTA } from '@/components/ui/feed-cta';
import { Stack } from '@/components/ui/stack';
import { POLLS } from '@/components/mock-data';
import { PollCard } from '@/components/poll-card';
import { getPolls, hasSession } from '../api';
import { useEffect, useState } from 'react';
import { useAkashaStore } from '@akashaorg/ui-core-hooks';
import { Card, CardContent } from './ui/card';
import { Typography } from './ui/typography';

const App = () => {
  const {
    data: { authenticatedDID, isAuthenticating },
  } = useAkashaStore();

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (authenticatedDID && !isAuthenticating) {
        const authorized = await hasSession();
        setIsAuthorized(authorized);
      }
    };
    checkAuthorization();
  }, [authenticatedDID, isAuthenticating]);

  useEffect(() => {
    const getAllPolls = async () => {
      const polls = await getPolls();
      console.log(polls, '<< polls data in componenet');
    };
    getAllPolls();
  }, []);

  useEffect(() => {
    console.log(isAuthenticating, authenticatedDID, isAuthorized, '<<< debug');
  }, [isAuthorized, isAuthenticating, authenticatedDID]);

  return (
    <Stack spacing={4}>
      {authenticatedDID && !isAuthenticating && !isAuthorized && (
        <Card className="p-4 bg-red-800">
          <CardContent>
            <Typography variant="sm" bold>
              Some changes requires re-authentification. Please logout and login again to apply them
              correctly.
            </Typography>
          </CardContent>
        </Card>
      )}

      <FeedCTA
        avatarSrc="https://github.com/akashaorg.png"
        profileDID="did:pkh:eip155:11155111:0x1a4b3c567890abcdeffedcba1234567890abcdef"
        cta="Unleash the Meow! 🐾 Create Your Purr-fect Poll!"
      >
        <Button size="sm">Create Poll</Button>
      </FeedCTA>
      {POLLS.map(poll => (
        <PollCard
          pollId={poll.id}
          title={poll.title}
          description={poll.description}
          options={poll.options}
          author={{
            did: 'did:pkh:eip155:11155111:0x1a4b3c567890abcdeffedcba1234567890abcdef',
            avatarSrc: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Man1',
            name: 'User1',
          }}
        />
      ))}
    </Stack>
  );
};

export default App;
