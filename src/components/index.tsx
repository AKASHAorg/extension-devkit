import { IRootComponentProps } from '@akashaorg/typings/lib/ui';
import { RouterProvider } from '@tanstack/react-router';
import { getRouter } from './routes';
import { withProviders } from '@akashaorg/ui-core-hooks';


const RootComponent = (props: IRootComponentProps) => {
    
    // application loader will pass down the baseRouteName as a prop,
    // this is then used by the router as a basepath (aka: every sub-route should match starting from this path)

    return (
        <RouterProvider router={getRouter(props.baseRouteName)} />
    )
}

export default withProviders(RootComponent);
