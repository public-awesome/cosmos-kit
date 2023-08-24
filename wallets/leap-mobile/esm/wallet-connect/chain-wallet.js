import { ChainWC } from '@cosmos-kit/walletconnect';
import { LeapClient } from './client';
export class ChainLeapMobile extends ChainWC {
    constructor(walletInfo, chainInfo) {
        super(walletInfo, chainInfo, LeapClient);
    }
}
//# sourceMappingURL=chain-wallet.js.map