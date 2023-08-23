import { cosmjsOfflineSigner } from './cosmjs-offline-signer';
import { connectSnap, getKey, getSnap, requestSignAmino, requestSignDirect, } from './snap-connector';
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
            username: key.name,
            address: key.bech32Address,
            algo: key.algo,
            pubkey: key.pubKey,
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
        return new cosmjsOfflineSigner(chainId);
    }
    getOfflineSignerDirect(chainId) {
        return new cosmjsOfflineSigner(chainId);
    }
    async signAmino(chainId, signer, signDoc, signOptions) {
        return requestSignAmino(chainId, signer, signDoc);
    }
    async signDirect(chainId, signer, signDoc) {
        return requestSignDirect(chainId, signer, signDoc);
    }
}
//# sourceMappingURL=client.js.map