import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import { IRootComponentProps } from "@akashaorg/typings/lib/ui";

import App from "./app";
import getSDK from "@akashaorg/core-sdk";
import { ApolloProvider } from "@apollo/client";
import { hrmSetup } from "../tools/hmr";

const withProviders = <T extends IRootComponentProps>(
  Component: React.ComponentType<T>,
) => {
  const sdk = getSDK();
  const displayName =
    Component.displayName || Component.name || "WrappedHOComponent";
  const apolloClient = sdk.services.gql.queryClient;
  const ProvidedComponent = (props: T) => {
    return (
      <ApolloProvider client={apolloClient}>
        <Component {...props} />
      </ApolloProvider>
    );
  };

  ProvidedComponent.displayName = `withProviders(${displayName})`;
  return ProvidedComponent;
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(App),
  errorBoundary: (error, errorInfo, props: IRootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return <div>{error.message}</div>;
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;

hrmSetup();
