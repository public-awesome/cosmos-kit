import { ICON } from '../constant';
export const keplrMobileInfo = {
    name: 'keplr-mobile',
    prettyName: 'Keplr Mobile',
    logo: ICON,
    mode: 'wallet-connect',
    mobileDisabled: false,
    rejectMessage: {
        source: 'Request rejected',
    },
    downloads: [
        {
            device: 'mobile',
            os: 'android',
            link: 'https://play.google.com/store/apps/details?id=com.chainapsis.keplr&hl=en&gl=US&pli=1',
        },
        {
            device: 'mobile',
            os: 'ios',
            link: 'https://apps.apple.com/us/app/keplr-wallet/id1567851089',
        },
        {
            link: 'https://www.keplr.app/download',
        },
    ],
    connectEventNamesOnWindow: ['keplr_keystorechange'],
    walletconnect: {
        name: 'Keplr',
        projectId: '6adb6082c909901b9e7189af3a4a0223102cd6f8d5c39e39f3d49acb92b578bb',
        encoding: 'base64',
        mobile: {
            native: {
                ios: 'keplrwallet:',
                android: 'intent:',
            },
        },
        formatNativeUrl: (appUrl, wcUri, os, _name) => {
            const plainAppUrl = appUrl.replaceAll('/', '').replaceAll(':', '');
            const encodedWcUrl = encodeURIComponent(wcUri);
            const baseUrl = `${plainAppUrl}://wcV2?${encodedWcUrl}`;
            console.log({ os, plainAppUrl, encodedWcUrl });
            switch (os) {
                case 'ios':
                    return baseUrl;
                case 'android':
                    return `${baseUrl}#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;`;
                default:
                    return baseUrl;
            }
        },
    },
};
//# sourceMappingURL=registry.js.map