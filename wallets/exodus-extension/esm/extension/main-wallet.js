import { MainWalletBase } from '@cosmos-kit/core';
import { ChainExodusExtension } from './chain-wallet';
import { ExodusClient } from './client';
import { getExodusFromExtension } from './utils';
export class ExodusExtensionWallet extends MainWalletBase {
    constructor(walletInfo, preferredEndpoints) {
        super(walletInfo, ChainExodusExtension);
        this.preferredEndpoints = preferredEndpoints;
    }
    async initClient() {
        this.initingClient();
        try {
            const exodus = await getExodusFromExtension();
            if (!exodus?.cosmos) {
                throw new Error('Exodus client does not support Cosmos provider');
            }
            this.initClientDone(exodus ? new ExodusClient(exodus.cosmos) : undefined);
        }
        catch (error) {
            this.logger?.error(error);
            this.initClientError(error);
        }
    }
}
//# sourceMappingURL=main-wallet.js.map