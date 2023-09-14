import { isSnapInitialized, isSnapInstalled, CosmosSnap, suggestChain, CosmJSOfflineSigner } from '@cosmsnap/snapper';
export class CosmosExensionClient {
    cosmos = new CosmosSnap();
    snapInitialized = false;
    snapInstalled = false;
    constructor() {
        isSnapInitialized().then(res => this.snapInitialized = res);
        isSnapInstalled().then(res => this.snapInstalled = res);
    }
    async addChain(chainInfo) {
        await suggestChain(chainInfo.chain);
    }
    async getSimpleAccount(chainId) {
        const { address } = await this.cosmos.getAccount(chainId);
        return {
            namespace: 'cosmos',
            chainId,
            address,
        };
    }
    async getAccount(chainId) {
        const key = await this.cosmos.getAccount(chainId);
        return {
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
        // return this.client.getOfflineSignerAuto(chainId);
    }
    getOfflineSignerAmino(chainId) {
        return new CosmJSOfflineSigner(chainId);
    }
    getOfflineSignerDirect(chainId) {
        return new CosmJSOfflineSigner(chainId);
    }
    async signAmino(chainId, signer, signDoc, signOptions) {
        return await this.cosmos.signAmino(chainId, signer, signDoc);
    }
    async signDirect(chainId, signer, signDoc, signOptions) {
        return await this.cosmos.signDirect(chainId, signer, signDoc);
    }
}
//# sourceMappingURL=client.js.map