import Long from 'long';
export const SnapOrigin = `npm:@leapwallet/metamask-cosmos-snap`;
/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async () => {
    return (await window.ethereum.request({
        method: 'wallet_getSnaps',
    }));
};
/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (snapId = SnapOrigin, params = {}) => {
    await window.ethereum.request({
        method: 'wallet_requestSnaps',
        params: {
            [snapId]: params,
        },
    });
};
/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version) => {
    try {
        const snaps = await getSnaps();
        return Object.values(snaps).find((snap) => snap.id === SnapOrigin && (!version || snap.version === version));
    }
    catch (e) {
        return undefined;
    }
};
export const requestSignDirect = async (chainId, signerAddress, signDoc) => {
    const signature = (await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: SnapOrigin,
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
    const modifiedAccountNumber = new Long(accountNumber.low, accountNumber.high, accountNumber.unsigned);
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
export const requestSignAmino = async (chainId, signerAddress, signDoc) => {
    const signResponse = (await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: SnapOrigin,
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
export const getKey = async (chainId) => {
    const accountData = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
            snapId: SnapOrigin,
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
export const isLocalSnap = (snapId) => snapId.startsWith('local:');
//# sourceMappingURL=snap-connector.js.map