import { MainWalletBase } from '@cosmos-kit/core';
import { ChainCompassExtension } from './chain-wallet';
import { CompassClient } from './client';
import { getCompassFromExtension } from './utils';
export class CompassExtensionWallet extends MainWalletBase {
    constructor(walletInfo) {
        super(walletInfo, ChainCompassExtension);
    }
    async initClient() {
        this.initingClient();
        try {
            const compass = await getCompassFromExtension();
            this.initClientDone(compass ? new CompassClient(compass) : undefined);
        }
        catch (error) {
            this.initClientError(error);
        }
    }
}
//# sourceMappingURL=main-wallet.js.map