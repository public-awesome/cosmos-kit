import { MainWalletBase } from '@cosmos-kit/core';
import { ChainCosmostationExtension } from './chain-wallet';
import { CosmostationClient } from './client';
import { getCosmostationFromExtension } from './utils';
export class CosmostationExtensionWallet extends MainWalletBase {
    constructor(walletInfo) {
        super(walletInfo, ChainCosmostationExtension);
    }
    async initClient() {
        this.initingClient();
        try {
            const cosmostation = await getCosmostationFromExtension();
            this.initClientDone(cosmostation ? new CosmostationClient(cosmostation) : undefined);
        }
        catch (error) {
            this.initClientError(error);
        }
    }
}
//# sourceMappingURL=main-wallet.js.map