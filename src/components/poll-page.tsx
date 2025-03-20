import { Button } from '@/components/ui/button';
import { FeedCTA } from '@/components/ui/feed-cta';
import { Stack } from '@/components/ui/stack';
import { POLLS } from '@/components/mock-data';
import { PollCard } from '@/components/poll-card';
import { useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAkashaStore } from '@akashaorg/ui-core-hooks';

const PollPage = () => {
  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const navigate = useNavigate();

  const handleEditorPlaceholderClick = useCallback(() => {
    if (!authenticatedDID) {
      alert('Please login to create a poll');
      // showLoginModal();
      return;
    }
    navigate({ to: '/poll-editor' });
  }, [authenticatedDID, navigate]);

  return (
    <Stack spacing={4}>
      <FeedCTA
        avatarSrc="https://github.com/akashaorg.png"
        profileDID="did:pkh:eip155:11155111:0x1a4b3c567890abcdeffedcba1234567890abcdef"
        cta="Unleash the Meow! 🐾 Create Your Purr-fect Poll!"
      >
        <Button size="sm" onClick={handleEditorPlaceholderClick}>
          Create Poll
        </Button>
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

export default PollPage;
