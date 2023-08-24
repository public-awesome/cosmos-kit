export class TrustClient {
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
    getOfflineSigner(chainId, preferredSignType) {
        // switch (preferredSignType) {
        //   case 'amino':
        //     return this.getOfflineSignerAmino(chainId);
        //   case 'direct':
        //     return this.getOfflineSignerDirect(chainId);
        //   default:
        //     return this.getOfflineSignerAmino(chainId);
        // }
        return this.client.getOfflineSigner(chainId);
    }
}
//# sourceMappingURL=client.js.map