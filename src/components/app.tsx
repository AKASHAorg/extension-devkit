/*@ts-ignore-next-line*/
import logoWhite from '../assets/devkit-logo-white.png?inline';
/*@ts-ignore-next-line*/
import logoBlack from '../assets/devkit-logo-black.png?inline';

import { Button } from "./ui/button";
import { useAkashaStore } from "@akashaorg/ui-core-hooks";
import { Card, CardContent, CardHeader } from "./ui/card";

const App = () => {
  const { data } = useAkashaStore();

  const handleAuth = () => {
    // @todo
  }
  
  return (
    <div className="bg-white dark:bg-grey2 shadow-[0_0_4px_rgba(0,0,0,0.2)] dark:shadow-[0_0_4px_rgba(0,0,0,0.2)] p-4 rounded-2xl text-black dark:text-white justify-center border-none">
      <div className="gap-4 flex flex-col">
        <div className="flex justify-center">
          <img src={logoWhite} className="hidden dark:block w-2/3" />
          <img src={logoBlack} className="dark:hidden w-2/3" />
        </div>
        <div className="w-full flex">
          <div>
            Documentation:
            <a className="ml-2 text-indigo-400" href="https://docs.akasha.world/devkit" target="_blank">
              docs.akasha.world/devkit
            </a>
          </div>
        </div>
        <hr />
      </div>
      {data.isAuthenticating && <div>User is authenticating...</div>}
      {data.authenticatedDID && (
        <Card>
          <CardHeader>Authenticated User</CardHeader>
          <CardContent>
            DID: {data.authenticatedDID}  
          </CardContent>
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
