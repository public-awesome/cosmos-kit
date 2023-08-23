"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OkxwalletClient = void 0;
class OkxwalletClient {
    client;
    constructor(client) {
        this.client = client;
    }
    async enable(chainIds) {
        await this.client.enable(chainIds);
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
    getOfflineSigner(chainId) {
        return this.client.getOfflineSigner(chainId);
    }
}
exports.OkxwalletClient = OkxwalletClient;
//# sourceMappingURL=client.js.map