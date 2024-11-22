

export const hrmSetup = async () => {
  console.log('setting up hot module reloading');

  if (!__DEV__) return;

  const vc = await import("/@vite/client");
  const hot = vc.createHotContext();
  console.log('hot?', hot);
  if (hot) {
    hot.on('spa-hmr', (data) => {
      const { chunkId } = data;

      /**
       * the problem: we cannot know the name of the app under which this code is running...
       * possible solution:
       * 
       * 1. take control of the reactLifecycles inside the app-loader.
       *    - app-loader can call the respective lifecycle manually (unmount and then mount)
       *    - highly simplifies the boilerplate (no need to wrap into the single-spa-react)
       *    - this might have some issues on the single-spa side
       * 
       * 3. full page refresh :)) - no more hmr, instead do a full page refresh
       *    - this might be the easiest but the DX is not so great. 
       */

      // @todo: instead of chunkId we should use the appName.

      // System.delete(System.resolve(chunkId));
      // singleSpa.unloadApplication(appName);
    });
  }
};
