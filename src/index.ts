import { IAppConfig, IntegrationRegistrationOptions, MenuItemAreaType, MenuItemType } from "@akashaorg/typings/lib/ui";

export const register = (opts: IntegrationRegistrationOptions): IAppConfig => {
    return {
        loadingFn: () => import('./components'),
        mountsIn: opts.layoutSlots?.applicationSlotId as string,
        menuItems: {
            label: 'Example App',
            type: MenuItemType.App,
            area: [MenuItemAreaType.AppArea]
        }
    }
}
