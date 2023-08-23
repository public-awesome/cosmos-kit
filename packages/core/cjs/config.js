"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameServiceRegistries = void 0;
exports.nameServiceRegistries = [
    {
        name: 'icns',
        contract: 'osmo1xk0s8xgktn9x5vwcgtjdxqzadg88fgn33p8u9cnpdxwemvxscvast52cdd',
        chainName: 'osmosis',
        getQueryMsg: (address) => {
            return {
                icns_names: { address },
            };
        },
        slip173: 'osmo',
    },
    {
        name: 'stargaze',
        contract: 'stars1fx74nkqkw2748av8j7ew7r3xt9cgjqduwn8m0ur5lhe49uhlsasszc5fhr',
        chainName: 'stargaze',
        getQueryMsg: (address) => {
            return {
                name: { address },
            };
        },
        slip173: 'stars',
    },
];
//# sourceMappingURL=config.js.map