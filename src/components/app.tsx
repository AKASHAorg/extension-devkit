/*@ts-ignore-next-line*/
import logoWhite from '../assets/devkit-logo-white.png?inline';
/*@ts-ignore-next-line*/
import logoBlack from '../assets/devkit-logo-black.png?inline';

import { Button } from './ui/button';
import { useAkashaStore } from '@akashaorg/ui-core-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { selectProfileData } from '@akashaorg/ui-core-hooks/lib/selectors/get-profile-by-did-query';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Image, ImageRoot } from './ui/image';
import { Typography } from './ui/typography';

const App = () => {
  const {
    data: { isAuthenticating, authenticatedDID },
  } = useAkashaStore();

  const handleAuth = () => {
    // @todo
  };

  const profileDataReq = useGetProfileByDidQuery({
    variables: { id: authenticatedDID },
    skip: !authenticatedDID, // do not run the query if there is no authenticated DID
  });

  const userProfile = profileDataReq.data ? selectProfileData(profileDataReq.data) : null;

  const profileCreationDate = new Date(userProfile?.createdAt);

  return (
    <div>
      <div className="p-4 rounded-2xl text-black dark:text-white justify-center border-none">
        <div className="gap-4 flex flex-col">
          <div>
            <ImageRoot className="flex justify-center opacity-60">
              <Image src={logoWhite} className="hidden dark:block w-2/3" />
              <Image src={logoBlack} className="dark:hidden w-2/3" />
            </ImageRoot>
          </div>
          <div className="w-full flex">
            <div className="flex justify-center w-full">
              Documentation:
              <a
                className="ml-2 text-indigo-400"
                href="https://docs.akasha.world/devkit"
                target="_blank"
              >
                docs.akasha.world/devkit
              </a>
            </div>
          </div>
        </div>
      </div>
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
                  You have created your profile on: {profileCreationDate.getDay()}/
                  {profileCreationDate.getMonth()}/{profileCreationDate.getFullYear()}
                </Typography>
                <Typography>
                  You have authenticated with the Decentralized IDentity: {userProfile?.did.id}
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
