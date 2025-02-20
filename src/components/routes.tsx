import { createRootRoute, createRoute, createRouter, Outlet, redirect } from "@tanstack/react-router";
import { HomePage } from "./pages/home";
import { DocsPage } from "./pages/docs";
import { ComponentsPage } from "./pages/components";

export const ROUTE_NAMES = {
    HOME: '/home',
    DOCS: '/docs',
    COMPONENTS: '/components',
}

const rootRoute = createRootRoute({
    component: () => <Outlet />,
});

const indexRoute = createRoute({
    beforeLoad: () => {
        throw redirect({
            to: ROUTE_NAMES.HOME,
            replace: true,
        });
    },
    path: '/',
    getParentRoute: () => rootRoute,
});

const homeRoute = createRoute({
    component: HomePage,
    path: ROUTE_NAMES.HOME,
    getParentRoute: () => rootRoute,
});

const docsRoute = createRoute({
    component: DocsPage,
    path: ROUTE_NAMES.DOCS,
    getParentRoute: () => rootRoute,
});

const componentsRoute = createRoute({
    path: ROUTE_NAMES.COMPONENTS,
    component: ComponentsPage,
    getParentRoute: () => rootRoute,
});

const routeTree = rootRoute.addChildren([indexRoute, homeRoute, docsRoute, componentsRoute]);

export const getRouter = (basePath: string) => {
    return createRouter({
        routeTree,
        basepath: basePath,
    });
}