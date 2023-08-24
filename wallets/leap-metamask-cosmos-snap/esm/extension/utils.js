import { ClientNotExistError } from '@cosmos-kit/core';
/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
export const isFlask = async () => {
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
export const getCosmosSnapFromExtension = async () => {
    if (typeof window === 'undefined') {
        return void 0;
    }
    const metamaskCosmosSnap = window.ethereum;
    const isFlaskDetected = await isFlask();
    if (document.readyState === 'complete') {
        if (!metamaskCosmosSnap && !isFlaskDetected) {
            throw ClientNotExistError;
        }
    }
};
//# sourceMappingURL=utils.js.map