"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalSnap = exports.getKey = exports.requestSignAmino = exports.requestSignDirect = exports.getSnap = exports.connectSnap = exports.getSnaps = exports.SnapOrigin = void 0;
const long_1 = __importDefault(require("long"));
exports.SnapOrigin = `npm:@leapwallet/metamask-cosmos-snap`;
/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
const getSnaps = async () => {
    return (await window.ethereum.request({
        method: 'wallet_getSnaps',
    }));
};
exports.getSnaps = getSnaps;
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
const connectSnap = async (snapId = exports.SnapOrigin, params = {}) => {
    await window.ethereum.request({
        method: 'wallet_requestSnaps',
        params: {
            [snapId]: params,
        },
    });
};
exports.connectSnap = connectSnap;
/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
const getSnap = async (version) => {
    try {
        const snaps = await (0, exports.getSnaps)();
        return Object.values(snaps).find((snap) => snap.id === exports.SnapOrigin && (!version || snap.version === version));
    }
    catch (e) {
        return undefined;
    }
};
exports.getSnap = getSnap;
const requestSignDirect = async (chainId, signerAddress, signDoc) => {
    const signature = (await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: exports.SnapOrigin,
            request: {
                method: 'signDirect',
                params: {
                    chainId,
                    signerAddress,
                    signDoc,
                },
            },
        },
    }));
    const accountNumber = signDoc.accountNumber;
    const modifiedAccountNumber = new long_1.default(accountNumber.low, accountNumber.high, accountNumber.unsigned);
    return {
        signature: signature.signature,
        signed: {
            ...signature.signed,
            accountNumber: `${modifiedAccountNumber.toString()}`,
            authInfoBytes: new Uint8Array(Object.values(signature.signed.authInfoBytes)),
            bodyBytes: new Uint8Array(Object.values(signature.signed.bodyBytes)),
        },
    };
};
exports.requestSignDirect = requestSignDirect;
const requestSignAmino = async (chainId, signerAddress, signDoc) => {
    const signResponse = (await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: exports.SnapOrigin,
            request: {
                method: 'signAmino',
                params: {
                    chainId,
                    signerAddress,
                    signDoc,
                },
            },
        },
    }));
    return signResponse;
};
exports.requestSignAmino = requestSignAmino;
const getKey = async (chainId) => {
    const accountData = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: exports.SnapOrigin,
            request: {
                method: 'getKey',
                params: {
                    chainId,
                },
            },
        },
    });
    if (!accountData)
        throw new Error('No account data found');
    accountData.pubKey = Uint8Array.from(Object.values(accountData.pubkey));
    return accountData;
};
exports.getKey = getKey;
const isLocalSnap = (snapId) => snapId.startsWith('local:');
exports.isLocalSnap = isLocalSnap;
//# sourceMappingURL=snap-connector.js.map