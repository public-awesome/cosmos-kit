"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCosmosSnapFromExtension = exports.isFlask = void 0;
const core_1 = require("@cosmos-kit/core");
/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
const isFlask = async () => {
    const provider = window.ethereum;
    try {
        const clientVersion = await provider?.request({
            method: 'web3_clientVersion',
        });
        const isFlaskDetected = clientVersion?.includes('flask');
        return Boolean(provider && isFlaskDetected);
    }
    catch {
        return false;
    }
};
exports.isFlask = isFlask;
const getCosmosSnapFromExtension = async () => {
    if (typeof window === 'undefined') {
        return void 0;
    }
    const metamaskCosmosSnap = window.ethereum;
    const isFlaskDetected = await (0, exports.isFlask)();
    if (document.readyState === 'complete') {
        if (!metamaskCosmosSnap && !isFlaskDetected) {
            throw core_1.ClientNotExistError;
        }
    }
};
exports.getCosmosSnapFromExtension = getCosmosSnapFromExtension;
//# sourceMappingURL=utils.js.map