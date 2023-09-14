import { MainWalletBase } from '@cosmos-kit/core';
import { ChainCosmosExtensionMetamaskSnap } from './chain-wallet';
import { CosmosExensionClient } from './client';
export class CosmosMetamaskExtensionWallet extends MainWalletBase {
    constructor(walletInfo) {
        super(walletInfo, ChainCosmosExtensionMetamaskSnap);
    }
    async initClient() {
        this.initingClient();
        try {
            this.initClientDone(new CosmosExensionClient());
        }
        catch (error) {
            this.initClientError(error);
        }
    }
}
//# sourceMappingURL=main-wallet.js.map