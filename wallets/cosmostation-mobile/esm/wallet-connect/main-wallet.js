import { WCWallet } from '@cosmos-kit/walletconnect';
import { ChainCosmostationMobile } from './chain-wallet';
import { CosmostationClient } from './client';
export class CosmostationMobileWallet extends WCWallet {
    constructor(walletInfo, preferredEndpoints) {
        super(walletInfo, ChainCosmostationMobile, CosmostationClient);
        this.preferredEndpoints = preferredEndpoints;
    }
}
//# sourceMappingURL=main-wallet.js.map