import { MainWalletBase } from '@cosmos-kit/core';
import { ChainLeapExtension } from './chain-wallet';
import { LeapClient } from './client';
import { getLeapFromExtension } from './utils';
export class LeapExtensionWallet extends MainWalletBase {
    constructor(walletInfo) {
        super(walletInfo, ChainLeapExtension);
    }
    async initClient() {
        this.initingClient();
        try {
            const leap = await getLeapFromExtension();
            this.initClientDone(leap ? new LeapClient(leap) : undefined);
        }
        catch (error) {
            this.initClientError(error);
        }
    }
}
//# sourceMappingURL=main-wallet.js.map