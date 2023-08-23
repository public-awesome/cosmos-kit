import { getKey, requestSignAmino, requestSignDirect } from './snap-connector';
export class cosmjsOfflineSigner {
    chainId;
    constructor(chainId) {
        this.chainId = chainId;
    }
    async getAccounts() {
        const key = await getKey(this.chainId);
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
        return requestSignDirect(this.chainId, signerAddress, signDoc);
    }
    async signAmino(signerAddress, signDoc) {
        if (this.chainId !== signDoc.chain_id) {
            throw new Error('Chain ID does not match signer chain ID');
        }
        const accounts = await this.getAccounts();
        if (accounts.find((account) => account.address !== signerAddress)) {
            throw new Error('Signer address does not match wallet address');
        }
        return requestSignAmino(this.chainId, signerAddress, signDoc);
    }
}
export function getOfflineSigner(chainId) {
    return new cosmjsOfflineSigner(chainId);
}
//# sourceMappingURL=cosmjs-offline-signer.js.map