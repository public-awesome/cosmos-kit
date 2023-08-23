import { MainWalletBase } from '@cosmos-kit/core';
import { ChainVectisExtension } from './chain-wallet';
import { VectisClient } from './client';
import { getVectisFromExtension } from './utils';
export class VectisExtensionWallet extends MainWalletBase {
    constructor(walletInfo) {
        super(walletInfo, ChainVectisExtension);
    }
    async initClient() {
        this.initingClient();
        try {
            const vectis = await getVectisFromExtension();
            this.initClientDone(vectis ? new VectisClient(vectis) : undefined);
        }
        catch (error) {
            this.initClientError(error);
        }
    }
}
//# sourceMappingURL=main-wallet.js.map