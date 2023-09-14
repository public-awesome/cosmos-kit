"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosSnapClient = void 0;
const cosmos_snap_provider_1 = require("@leapwallet/cosmos-snap-provider");
const cosmos_snap_provider_2 = require("@leapwallet/cosmos-snap-provider");
const long_1 = __importDefault(require("long"));
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
        const installedSnap = await (0, cosmos_snap_provider_2.getSnap)();
        if (!installedSnap) {
            await (0, cosmos_snap_provider_2.connectSnap)();
        }
    }
    async getAccount(chainId) {
        await this.handleConnect();
        const key = await (0, cosmos_snap_provider_2.getKey)(chainId);
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
        return new cosmos_snap_provider_1.CosmjsOfflineSigner(chainId);
    }
    getOfflineSignerDirect(chainId) {
        return new cosmos_snap_provider_1.CosmjsOfflineSigner(chainId);
    }
    async signAmino(chainId, signer, signDoc, signOptions) {
        return (0, cosmos_snap_provider_2.requestSignAmino)(chainId, signer, signDoc);
    }
    async signDirect(chainId, signer, signDoc) {
        const signature = (0, cosmos_snap_provider_2.requestSignature)(chainId, signer, signDoc // @ts-nocheck
        );
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
    }
    async signArbitrary(chainId, signer, data) {
        return (await (0, cosmos_snap_provider_1.signArbitrary)(chainId, signer, data));
    }
    async addChain(chainInfo) {
        await (0, cosmos_snap_provider_1.experimentalSuggestChain)(chainInfo);
    }
}
exports.CosmosSnapClient = CosmosSnapClient;
//# sourceMappingURL=client.js.map