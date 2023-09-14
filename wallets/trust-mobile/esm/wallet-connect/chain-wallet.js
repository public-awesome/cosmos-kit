import { ChainWC } from '@cosmos-kit/walletconnect';
import { TrustClient } from './client';
export class ChainTrustMobile extends ChainWC {
    constructor(walletInfo, chainInfo) {
        super(walletInfo, chainInfo, TrustClient);
    }
}
//# sourceMappingURL=chain-wallet.js.map