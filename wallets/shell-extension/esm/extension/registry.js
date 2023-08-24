import { ICON } from '../constant';
export const shellExtensionInfo = {
    name: 'shell-extension',
    prettyName: 'Shell',
    logo: ICON,
    mode: 'extension',
    mobileDisabled: true,
    rejectMessage: {
        source: 'Request rejected',
    },
    connectEventNamesOnWindow: ['shell_keystorechange'],
    downloads: [
        {
            device: 'desktop',
            browser: 'chrome',
            link: 'https://chrome.google.com/webstore/detail/shell-wallet/kbdcddcmgoplfockflacnnefaehaiocb',
        },
    ],
};
//# sourceMappingURL=registry.js.map