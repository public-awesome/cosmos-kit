"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetamaskCosmosSnapWallet = void 0;
const core_1 = require("@cosmos-kit/core");
const chain_wallet_1 = require("./chain-wallet");
const client_1 = require("./client");
class MetamaskCosmosSnapWallet extends core_1.MainWalletBase {
    constructor(walletInfo) {
        super(walletInfo, chain_wallet_1.ChainMetamaskCosmosSnap);
    }
    async initClient() {
        this.initingClient();
        try {
            this.initClientDone(new client_1.CosmosSnapClient());
        }
        catch (error) {
            this.logger?.error(error);
            this.initClientError(error);
        }
    }
}
exports.MetamaskCosmosSnapWallet = MetamaskCosmosSnapWallet;
//# sourceMappingURL=main-wallet.js.map