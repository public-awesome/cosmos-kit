import { ICON } from '../constant';
export const vectisExtensionInfo = {
    name: 'vectis-extension',
    prettyName: 'Vectis',
    logo: ICON,
    mode: 'extension',
    mobileDisabled: true,
    rejectMessage: {
        source: "The requested action couldn't be completed, it was rejected by the user.",
    },
    connectEventNamesOnWindow: ['vectis_accountChanged'],
    downloads: [
        {
            device: 'desktop',
            browser: 'chrome',
            link: 'https://chrome.google.com/webstore/detail/vectis-wallet/cgkaddoglojnmfiblgmlinfaijcdpfjm',
        },
    ],
};
//# sourceMappingURL=registry.js.map