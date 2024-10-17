import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import { IRootComponentProps } from '@akashaorg/typings/lib/ui';

import App from './app';

const reactLifecycles = singleSpaReact({
    React,
    ReactDOMClient,
    rootComponent: App,
    errorBoundary: (error, errorInfo, props: IRootComponentProps) => {
        if (props.logger) {
            props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
        }
        return (
            <div>{error.message}</div>
        );
    },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;