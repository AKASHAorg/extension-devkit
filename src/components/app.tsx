import { useAkashaStore } from '@akashaorg/ui-core-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { selectProfileData } from '@akashaorg/ui-core-hooks/lib/selectors/get-profile-by-did-query';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Typography } from './ui/typography';

const App = () => {
  const {
    data: { isAuthenticating, authenticatedDID },
  } = useAkashaStore();

  const handleAuth = () => {
    // some auth logic
  };

  const profileDataReq = useGetProfileByDidQuery({
    variables: { id: authenticatedDID },
    skip: !authenticatedDID, // do not run the query if there is no authenticated DID
  });

  const userProfile = profileDataReq.data ? selectProfileData(profileDataReq.data) : null;

  const profileCreationDate = new Date(userProfile?.createdAt);

  return (
    <div>
      {isAuthenticating && <div>User is authenticating...</div>}

      {!isAuthenticating && (
        <>
          {!authenticatedDID && (
            <div>
              <h3>No authenticated user</h3>
              <Button onClick={handleAuth}>Authenticate</Button>
            </div>
          )}
          {authenticatedDID && (
            <Card>
              <CardHeader>
                <Typography>Hello, {userProfile?.name}</Typography>
              </CardHeader>
              <CardContent style={{ flexDirection: 'column', gap: '0.5rem' }}>
                <Typography>
                  Your profile was created on: {profileCreationDate.getDay()}/
                  {profileCreationDate.getMonth()}/{profileCreationDate.getFullYear()}
                </Typography>
                <Typography>
                  Your Decentralized IDentity is: {userProfile?.did.id}
                </Typography>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default App;
