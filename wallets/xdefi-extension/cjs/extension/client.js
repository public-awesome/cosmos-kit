"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XDEFIClient = void 0;
class XDEFIClient {
    client;
    constructor(client) {
        this.client = client;
    }
    async enable(chainIds) {
        await this.client.enable(chainIds);
    }
    async disconnect() {
        await this.client?.disconnect?.();
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
    async getAccount(chainId) {
        const key = await this.client.getKey(chainId);
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
        // return this.client.getOfflineSignerAuto(chainId);
    }
    getOfflineSignerAmino(chainId) {
        return this.client.getOfflineSignerOnlyAmino(chainId);
    }
    getOfflineSignerDirect(chainId) {
        return this.client.getOfflineSigner(chainId);
    }
    async signAmino(chainId, signer, signDoc, signOptions) {
        return await this.client.signAmino(chainId, signer, signDoc, signOptions);
    }
    async signDirect(chainId, signer, signDoc, signOptions) {
        return await this.client.signDirect(chainId, signer, signDoc, signOptions);
    }
    async signArbitrary(chainId, signer, data) {
        return await this.client.signArbitrary(chainId, signer, data);
    }
    async sendTx(chainId, tx, mode) {
        return await this.client.sendTx(chainId, tx, mode);
    }
}
exports.XDEFIClient = XDEFIClient;
//# sourceMappingURL=client.js.map