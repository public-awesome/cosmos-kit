"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosExensionClient = void 0;
const snapper_1 = require("@cosmsnap/snapper");
class CosmosExensionClient {
    cosmos = new snapper_1.CosmosSnap();
    snapInitialized = false;
    snapInstalled = false;
    constructor() {
        (0, snapper_1.isSnapInitialized)().then(res => this.snapInitialized = res);
        (0, snapper_1.isSnapInstalled)().then(res => this.snapInstalled = res);
    }
    async addChain(chainInfo) {
        await (0, snapper_1.suggestChain)(chainInfo.chain);
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
        return new snapper_1.CosmJSOfflineSigner(chainId);
    }
    getOfflineSignerDirect(chainId) {
        return new snapper_1.CosmJSOfflineSigner(chainId);
    }
    async signAmino(chainId, signer, signDoc, signOptions) {
        return await this.cosmos.signAmino(chainId, signer, signDoc);
    }
    async signDirect(chainId, signer, signDoc, signOptions) {
        return await this.cosmos.signDirect(chainId, signer, signDoc);
    }
}
exports.CosmosExensionClient = CosmosExensionClient;
//# sourceMappingURL=client.js.map