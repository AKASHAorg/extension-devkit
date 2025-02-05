import React, { useState } from "react";
import getSDK from "@akashaorg/core-sdk";
import { Button } from "./Button";

const App = () => {
  const sdk = getSDK();
  const [count, setCount] = useState(0);
  
  const incrementState = () => {
    setCount(prev => prev + 1);
  }

  console.log("indexing did is: ", sdk.services.common.misc.getIndexingDID());
  return <div className="bg-white dark:bg-grey2 p-4 rounded-2xl text-black dark:text-white">
    <h3>Hello World!</h3>
    <div>Count: {count}</div>
    <div className="flex justify-center">
      <Button label="Click me!" onClick={incrementState} />
    </div>
  </div>;
};

export default App;
