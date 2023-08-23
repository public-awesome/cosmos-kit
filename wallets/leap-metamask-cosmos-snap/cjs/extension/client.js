"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosSnapClient = void 0;
const cosmjs_offline_signer_1 = require("./cosmjs-offline-signer");
const snap_connector_1 = require("./snap-connector");
class CosmosSnapClient {
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
        const installedSnap = await (0, snap_connector_1.getSnap)();
        if (!installedSnap) {
            await (0, snap_connector_1.connectSnap)();
        }
    }
    async getAccount(chainId) {
        await this.handleConnect();
        const key = await (0, snap_connector_1.getKey)(chainId);
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
        return new cosmjs_offline_signer_1.cosmjsOfflineSigner(chainId);
    }
    getOfflineSignerDirect(chainId) {
        return new cosmjs_offline_signer_1.cosmjsOfflineSigner(chainId);
    }
    async signAmino(chainId, signer, signDoc, signOptions) {
        return (0, snap_connector_1.requestSignAmino)(chainId, signer, signDoc);
    }
    async signDirect(chainId, signer, signDoc) {
        return (0, snap_connector_1.requestSignDirect)(chainId, signer, signDoc);
    }
}
exports.CosmosSnapClient = CosmosSnapClient;
//# sourceMappingURL=client.js.map