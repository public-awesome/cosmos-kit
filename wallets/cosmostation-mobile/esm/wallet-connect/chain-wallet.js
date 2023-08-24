import { ChainWC } from '@cosmos-kit/walletconnect';
import { CosmostationClient } from './client';
export class ChainCosmostationMobile extends ChainWC {
    constructor(walletInfo, chainInfo) {
        super(walletInfo, chainInfo, CosmostationClient);
    }
}
//# sourceMappingURL=chain-wallet.js.map