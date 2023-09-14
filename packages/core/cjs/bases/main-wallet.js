"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainWalletBase = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
const events_1 = __importDefault(require("events"));
const types_1 = require("../types");
const wallet_1 = require("./wallet");
class MainWalletBase extends wallet_1.WalletBase {
    _chainWalletMap;
    preferredEndpoints;
    ChainWallet;
    constructor(walletInfo, ChainWallet) {
        super(walletInfo);
        this.ChainWallet = ChainWallet;
        this.emitter = new events_1.default();
        this.emitter.on('broadcast_client', (client) => {
            this.chainWalletMap?.forEach((chainWallet) => {
                chainWallet.initClientDone(client);
            });
        });
        this.emitter.on('broadcast_env', (env) => {
            this.chainWalletMap?.forEach((chainWallet) => {
                chainWallet.setEnv(env);
            });
        });
        this.emitter.on('sync_connect', async (chainName) => {
            await this.connectAll(true, chainName);
            this.update();
        });
        this.emitter.on('sync_disconnect', async (chainName) => {
            await this.disconnectAll(true, chainName);
            this.reset();
        });
        this.emitter.on('reset', (chainIds) => {
            chainIds.forEach((chainId) => Array.from(this.chainWalletMap.values())
                .find((cw) => cw.chainId === chainId)
                ?.reset());
        });
    }
    initingClient() {
        this.clientMutable.state = types_1.State.Pending;
        this.actions?.clientState?.(types_1.State.Pending);
        this.chainWalletMap?.forEach((chainWallet) => {
            chainWallet.initingClient();
        });
    }
    initClientDone(client) {
        this.clientMutable.data = client;
        this.clientMutable.state = types_1.State.Done;
        this.actions?.clientState?.(types_1.State.Done);
        this.chainWalletMap?.forEach((chainWallet) => {
            chainWallet.initClientDone(client);
        });
    }
    initClientError(error) {
        this.clientMutable.message = error?.message;
        this.clientMutable.state = types_1.State.Error;
        this.actions?.clientState?.(types_1.State.Error);
        this.actions?.clientMessage?.(error?.message);
        this.chainWalletMap?.forEach((chainWallet) => {
            chainWallet.initClientError(error);
        });
        // this.logger?.error(error);
        if (this.throwErrors) {
            throw new Error(this.clientMutable.message);
        }
    }
    onSetChainsDone() { }
    setChains(chains, overwrite = true) {
        if (overwrite || !this._chainWalletMap) {
            this._chainWalletMap = new Map();
        }
        chains.forEach((chain) => {
            const isTestNet = chain.name.includes('testnet');
            chain.preferredEndpoints = {
                ...chain.preferredEndpoints,
                rpc: [
                    ...(chain.preferredEndpoints?.rpc || []),
                    ...(this.preferredEndpoints?.[chain.name]?.rpc || []),
                    ...(chain.chain?.apis?.rpc?.map((e) => e.address) || []),
                    isTestNet
                        ? `https://rpc.testcosmos.directory/${chain.name}`
                        : `https://rpc.cosmos.directory/${chain.name}`,
                ],
                rest: [
                    ...(chain.preferredEndpoints?.rest || []),
                    ...(this.preferredEndpoints?.[chain.name]?.rest || []),
                    ...(chain.chain?.apis?.rest?.map((e) => e.address) || []),
                    isTestNet
                        ? `https://rest.testcosmos.directory/${chain.name}`
                        : `https://rest.cosmos.directory/${chain.name}`,
                ],
            };
            const chainWallet = new this.ChainWallet(this.walletInfo, chain);
            chainWallet.mainWallet = this;
            chainWallet.emitter = this.emitter;
            chainWallet.logger = this.logger;
            chainWallet.throwErrors = this.throwErrors;
            chainWallet.session = this.session;
            chainWallet.walletConnectOptions = this.walletConnectOptions;
            chainWallet.initClient = this.initClient;
            chainWallet.isLazy = chain.preferredEndpoints?.isLazy;
            this._chainWalletMap.set(chain.name, chainWallet);
        });
        this.onSetChainsDone();
    }
    get chainWalletMap() {
        return this._chainWalletMap;
    }
    getChainWallet = (chainName) => {
        return this.chainWalletMap?.get(chainName);
    };
    getChainWalletList = (activeOnly = true) => {
        const allChainWallets = Array.from(this.chainWalletMap.values());
        return activeOnly
            ? allChainWallets.filter((w) => w.isActive)
            : allChainWallets;
    };
    getGlobalStatusAndMessage = (activeOnly = true) => {
        const chainWalletList = this.getChainWalletList(activeOnly);
        let wallet = chainWalletList.find((w) => w.isWalletNotExist);
        if (wallet)
            return [wallet.walletStatus, wallet.message];
        wallet = chainWalletList.find((w) => w.isWalletConnecting);
        if (wallet)
            return [types_1.WalletStatus.Connecting, void 0];
        wallet = chainWalletList.find((w) => w.isWalletDisconnected);
        if (wallet) {
            return [types_1.WalletStatus.Disconnected, 'Exist disconnected wallets'];
        }
        wallet = chainWalletList.find((w) => w.isError || w.isWalletRejected);
        if (wallet)
            return [wallet.walletStatus, wallet.message];
        return [types_1.WalletStatus.Connected, void 0];
    };
    async update() {
        this.setData(void 0);
        this.setMessage(void 0);
        this.setState(types_1.State.Done);
        this.activate();
        window?.localStorage.setItem('cosmos-kit@2:core//current-wallet', this.walletName);
    }
    reset() {
        this.setData(void 0);
        this.setMessage(void 0);
        this.setState(types_1.State.Init);
        this.inactivate();
    }
    async connectAll(activeOnly = true, exclude) {
        const chainWalletList = this.getChainWalletList(activeOnly);
        // Avoid duplicate connect popups in wallet mobile Apps when using useChains
        if (chainWalletList.length > 0 &&
            chainWalletList.every((wallet) => wallet.isModeWalletConnect && wallet.connectChains)) {
            return;
        }
        for (const w of chainWalletList) {
            if (w.chainName !== exclude) {
                await w.connect();
            }
        }
    }
    async disconnectAll(activeOnly = true, exclude) {
        const chainWalletList = this.getChainWalletList(activeOnly);
        for (const w of chainWalletList) {
            if (w.chainName !== exclude) {
                await w.disconnect();
            }
        }
    }
}
exports.MainWalletBase = MainWalletBase;
//# sourceMappingURL=main-wallet.js.map