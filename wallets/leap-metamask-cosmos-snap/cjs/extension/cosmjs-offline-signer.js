"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOfflineSigner = exports.cosmjsOfflineSigner = void 0;
const snap_connector_1 = require("./snap-connector");
class cosmjsOfflineSigner {
    chainId;
    constructor(chainId) {
        this.chainId = chainId;
    }
    async getAccounts() {
        const key = await (0, snap_connector_1.getKey)(this.chainId);
        return [
            {
                address: key.bech32Address,
                algo: 'secp256k1',
                pubkey: key.pubKey,
            },
        ];
    }
    async signDirect(signerAddress, signDoc) {
        if (this.chainId !== signDoc.chainId) {
            throw new Error('Chain ID does not match signer chain ID');
        }
        const accounts = await this.getAccounts();
        if (accounts.find((account) => account.address !== signerAddress)) {
            throw new Error('Signer address does not match wallet address');
        }
        return (0, snap_connector_1.requestSignDirect)(this.chainId, signerAddress, signDoc);
    }
    async signAmino(signerAddress, signDoc) {
        if (this.chainId !== signDoc.chain_id) {
            throw new Error('Chain ID does not match signer chain ID');
        }
        const accounts = await this.getAccounts();
        if (accounts.find((account) => account.address !== signerAddress)) {
            throw new Error('Signer address does not match wallet address');
        }
        return (0, snap_connector_1.requestSignAmino)(this.chainId, signerAddress, signDoc);
    }
}
exports.cosmjsOfflineSigner = cosmjsOfflineSigner;
function getOfflineSigner(chainId) {
    return new cosmjsOfflineSigner(chainId);
}
exports.getOfflineSigner = getOfflineSigner;
//# sourceMappingURL=cosmjs-offline-signer.js.map