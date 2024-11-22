import React, { useEffect } from "react";
import getSDK from "@akashaorg/core-sdk";

const App = () => {
  const sdk = getSDK();
  console.log(sdk.services.common.misc.getIndexingDID());
  return <div className="bg-white dark:bg-grey2 p-4 rounded-2xl">
    <h3 className="text-black dark:text-white">Hello world 2!!</h3>
  </div>;
};

export default App;
