import { RouterProvider } from '@tanstack/react-router';
import { useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { router } from './app-routes';
import React from 'react';

const App: React.FC<unknown> = () => {
  const { baseRouteName, getTranslationPlugin, worldConfig } = useRootComponentProps();

  return (
    <React.Suspense fallback={'loading...'}>
      <RouterProvider
        router={router({
          baseRouteName,
        })}
      />
    </React.Suspense>
  );
};

export default App;
