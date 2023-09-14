import { CosmjsOfflineSigner, experimentalSuggestChain, signArbitrary } from '@leapwallet/cosmos-snap-provider';
import { connectSnap, getKey, getSnap, requestSignAmino, requestSignature } from '@leapwallet/cosmos-snap-provider';
import Long from 'long';
export class CosmosSnapClient {
    snapInstalled = false;
    constructor() {
        this.snapInstalled = localStorage.getItem('snapInstalled') === 'true';
    }
    async getSimpleAccount(chainId) {
        const { address, username } = await this.getAccount(chainId);
        return {
            namespace: 'cosmos',
            chainId,
            address,
            username,
        };
    }
    async handleConnect() {
        const installedSnap = await getSnap();
        if (!installedSnap) {
            await connectSnap();
        }
    }
    async getAccount(chainId) {
        await this.handleConnect();
        const key = await getKey(chainId);
        return {
            username: key?.address,
            address: key.address,
            algo: key.algo,
            pubkey: key.pubkey,
        };
    }
    getOfflineSigner(chainId, preferredSignType) {
        switch (preferredSignType) {
            case 'amino':
                return this.getOfflineSignerAmino(chainId);
            case 'direct':
                return this.getOfflineSignerDirect(chainId);
            default:
                return this.getOfflineSignerAmino(chainId);
        }
    }
    getOfflineSignerAmino(chainId) {
        return new CosmjsOfflineSigner(chainId);
    }
    getOfflineSignerDirect(chainId) {
        return new CosmjsOfflineSigner(chainId);
    }
    async signAmino(chainId, signer, signDoc, signOptions) {
        return requestSignAmino(chainId, signer, signDoc);
    }
    async signDirect(chainId, signer, signDoc) {
        const signature = requestSignature(chainId, signer, signDoc // @ts-nocheck
        );
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
    }
    async signArbitrary(chainId, signer, data) {
        return (await signArbitrary(chainId, signer, data));
    }
    async addChain(chainInfo) {
        await experimentalSuggestChain(chainInfo);
    }
}
//# sourceMappingURL=client.js.map