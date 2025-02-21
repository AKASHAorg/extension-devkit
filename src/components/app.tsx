/*@ts-ignore-next-line*/
import logoWhite from '../assets/devkit-logo-white.png?inline';
/*@ts-ignore-next-line*/
import logoBlack from '../assets/devkit-logo-black.png?inline';

import { Button } from './ui/button';
import { useAkashaStore } from '@akashaorg/ui-core-hooks';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Image, ImageRoot } from './ui/image';
import { Typography } from './ui/typography';

const App = () => {
  const { data } = useAkashaStore();

  const handleAuth = () => {
    // @todo
  };

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
      {data.isAuthenticating && <div>User is authenticating...</div>}
      {data.authenticatedDID && (
        <Card>
          <CardHeader>
            <Typography>Authenticated User</Typography>
          </CardHeader>
          <CardContent>DID: {data.authenticatedDID}</CardContent>
          <CardFooter>
            <Button>View Profile</Button>
          </CardFooter>
        </Card>
      )}
      {!data.isAuthenticating && !data.authenticatedDID && (
        <div>
          <h3>No authenticated user</h3>
          <Button onClick={handleAuth}>Authenticate</Button>
        </div>
      )}
    </div>
  );
};

export default App;
