/*@ts-ignore-next-line*/
import logoWhite from '../assets/devkit-logo-white.png?inline';
/*@ts-ignore-next-line*/
import logoBlack from '../assets/devkit-logo-black.png?inline';

import { Button } from './ui/button';
import { useAkashaStore } from '@akashaorg/ui-core-hooks';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Image, ImageRoot } from './ui/image';

const App = () => {
  const { data } = useAkashaStore();

  const handleAuth = () => {
    // @todo
  }

  return (
    <div>
      <div className="bg-white dark:bg-grey2 shadow-[0_0_4px_rgba(0,0,0,0.2)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] p-4 rounded-2xl text-black dark:text-white justify-center border-none">
        <div className="gap-4 flex flex-col">
          <div>
            <ImageRoot className='flex justify-center'>
              <Image src={logoWhite} className="hidden dark:block w-2/3" />
              <Image src={logoBlack} className="dark:hidden w-2/3" />
            </ImageRoot>
          </div>
          <div className="w-full flex">
            <div className='flex justify-center w-full'>
              Documentation:
              <a className="ml-2 text-indigo-400" href="https://docs.akasha.world/devkit" target="_blank">
                docs.akasha.world/devkit
              </a>
            </div>
          </div>
        </div>
      </div>
      {data.isAuthenticating && <div>User is authenticating...</div>}
        {data.authenticatedDID && (
          <Card>
            <CardHeader>Authenticated User</CardHeader>
            <CardContent>
              DID: {data.authenticatedDID}  
            </CardContent>
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
          )
        }
    </div>
  );
};

export default App;
