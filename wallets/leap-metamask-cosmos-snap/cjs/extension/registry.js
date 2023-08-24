"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metamaskCosmosSnapInfo = void 0;
const constant_1 = require("../constant");
exports.metamaskCosmosSnapInfo = {
    name: 'leap-metamask-cosmos-snap',
    description: 'The Leap MetaMask Cosmos Snap allows signing of Cosmos transactions using MetaMask.',
    prettyName: 'Leap Metamask Cosmos Snap',
    logo: constant_1.ICON,
    mode: 'extension',
    mobileDisabled: () => !('ethereum' in window),
    rejectMessage: {
        source: 'Request rejected',
    },
    downloads: [
        {
            device: 'desktop',
            browser: 'chrome',
            link: 'https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk',
        },
        {
            link: 'https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk',
        },
    ],
};
//# sourceMappingURL=registry.js.map