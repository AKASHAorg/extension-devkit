import React from 'react';
import getSDK from '@akashaorg/core-sdk';

const App = () => {
    const sdk = getSDK();
    console.log(sdk.services.common.misc.getIndexingDID());
    return (
        <div>Hello world!!</div>
    )
}

export default App;