"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metamaskCosmosSnapInfo = void 0;
const constant_1 = require("../constant");
exports.metamaskCosmosSnapInfo = {
    name: 'leap-metamask-cosmos-snap',
    description: 'The Leap Cosmos MetaMask Snap allows signing of Cosmos transactions using MetaMask.',
    prettyName: 'Leap Cosmos MetaMask Snap',
    logo: constant_1.ICON,
    mode: 'extension',
    extends: 'MetaMask',
    mobileDisabled: () => !('ethereum' in window),
    rejectMessage: {
        source: 'Request rejected',
    },
    downloads: [
        {
            device: 'desktop',
            browser: 'chrome',
            link: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
        },
        {
            link: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
        },
    ],
};
//# sourceMappingURL=registry.js.map