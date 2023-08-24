import Bowser from 'bowser';
import EventEmitter from 'events';
import { StateBase } from './bases';
import { WalletRepo } from './repository';
import { State, } from './types';
import { convertChain, getNameServiceRegistryFromName, Session, } from './utils';
export class WalletManager extends StateBase {
    chainRecords = [];
    walletRepos = [];
    defaultNameService = 'icns';
    mainWallets = [];
    coreEmitter;
    walletConnectOptions;
    session;
    repelWallet = true; // only allow one wallet type to connect at one time. i.e. you cannot connect keplr and cosmostation at the same time
    isLazy; // stands for `globalIsLazy` setting
    throwErrors;
    _reconnectMap = {};
    constructor(chains, assetLists, wallets, logger, throwErrors = false, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions) {
        super();
        this.throwErrors = throwErrors;
        this.coreEmitter = new EventEmitter();
        this.logger = logger;
        if (defaultNameService)
            this.defaultNameService = defaultNameService;
        this.session = new Session({
            duration: 1800000,
            callback: () => {
                this.mainWallets.forEach((w) => w.disconnectAll(false));
                window?.localStorage.removeItem('cosmos-kit@2:core//accounts');
                window?.localStorage.removeItem('cosmos-kit@2:core//current-wallet');
            },
            ...sessionOptions,
        });
        this.walletConnectOptions = walletConnectOptions;
        wallets.forEach(({ walletName }) => (this._reconnectMap[walletName] = () => this._reconnect(walletName)));
        this.init(chains, assetLists, wallets, walletConnectOptions, signerOptions, endpointOptions);
    }
    init(chains, assetLists, wallets, walletConnectOptions, signerOptions, endpointOptions) {
        this.logger.info(`${chains.length} chains and ${wallets.length} wallets are provided!`);
        this.isLazy = endpointOptions?.isLazy;
        this.chainRecords = chains.map((chain) => convertChain(chain, assetLists, signerOptions, endpointOptions?.endpoints?.[chain.chain_name], this.isLazy, this.logger));
        this.mainWallets = wallets.map((wallet) => {
            wallet.logger = this.logger;
            wallet.throwErrors = this.throwErrors;
            wallet.session = this.session;
            wallet.walletConnectOptions = this.walletConnectOptions;
            wallet.setChains(this.chainRecords);
            return wallet;
        });
        this.chainRecords.forEach((chainRecord) => {
            const repo = new WalletRepo(chainRecord, wallets.map(({ getChainWallet }) => getChainWallet(chainRecord.name)));
            repo.logger = this.logger;
            repo.repelWallet = this.repelWallet;
            repo.session = this.session;
            this.walletRepos.push(repo);
        });
    }
    setWalletRepel(value) {
        this.repelWallet = value;
        this.walletRepos.forEach((repo) => (repo.repelWallet = value));
        window?.localStorage.setItem('cosmos-kit@2:core//repel-wallet', value.toString());
    }
    addChains = (chains, assetLists, signerOptions, endpoints) => {
        const newChainRecords = chains.map((chain) => convertChain(chain, assetLists, signerOptions, endpoints?.[chain.chain_name], this.isLazy, this.logger));
        newChainRecords.forEach((chainRecord) => {
            const index = this.chainRecords.findIndex((chainRecord2) => chainRecord2.name !== chainRecord.name);
            if (index == -1) {
                this.chainRecords.push(chainRecord);
            }
            else {
                this.chainRecords[index] = chainRecord;
            }
        });
        this.mainWallets.forEach((wallet) => {
            wallet.setChains(newChainRecords, false);
        });
        newChainRecords.forEach((chainRecord) => {
            const repo = new WalletRepo(chainRecord, this.mainWallets.map(({ getChainWallet }) => getChainWallet(chainRecord.name)));
            repo.setActions({
                viewOpen: this.actions?.viewOpen,
                viewWalletRepo: this.actions?.viewWalletRepo,
            });
            repo.wallets.forEach((w) => {
                w.setActions({
                    data: this.actions?.data,
                    state: this.actions?.state,
                    message: this.actions?.message,
                });
            });
            repo.logger = this.logger;
            repo.repelWallet = this.repelWallet;
            repo.session = this.session;
            const index = this.walletRepos.findIndex((repo2) => repo2.chainName !== repo.chainName);
            if (index == -1) {
                this.walletRepos.push(repo);
            }
            else {
                this.walletRepos[index] = repo;
            }
        });
    };
    on = (event, handler) => {
        this.coreEmitter.on(event, handler);
    };
    off = (event, handler) => {
        this.coreEmitter.off(event, handler);
    };
    get activeRepos() {
        return this.walletRepos.filter((repo) => repo.isActive === true);
    }
    getMainWallet = (walletName) => {
        const wallet = this.mainWallets.find((w) => w.walletName === walletName);
        if (!wallet) {
            throw new Error(`Wallet ${walletName} is not provided.`);
        }
        return wallet;
    };
    getWalletRepo = (chainName) => {
        const walletRepo = this.walletRepos.find((wr) => wr.chainName === chainName);
        if (!walletRepo) {
            throw new Error(`Chain ${chainName} is not provided.`);
        }
        return walletRepo;
    };
    getChainWallet = (chainName, walletName) => {
        const chainWallet = this.getMainWallet(walletName).getChainWallet(chainName);
        if (!chainWallet) {
            throw new Error(`${chainName} is not provided!`);
        }
        return chainWallet;
    };
    getChainRecord = (chainName) => {
        const chainRecord = this.chainRecords.find((c) => c.name === chainName);
        if (!chainRecord) {
            throw new Error(`${chainName} is not provided!`);
        }
        return chainRecord;
    };
    // get chain logo
    getChainLogo = (chainName) => {
        const chainRecord = this.getChainRecord(chainName);
        return (
        // until chain_registry fix this
        // chainRecord?.chain.logo_URIs?.svg ||
        // chainRecord?.chain.logo_URIs?.png ||
        // chainRecord?.chain.logo_URIs?.jpeg ||
        chainRecord?.assetList?.assets[0]?.logo_URIs?.svg ||
            chainRecord?.assetList?.assets[0]?.logo_URIs?.png ||
            undefined);
    };
    getNameService = async (chainName) => {
        let _chainName;
        if (!chainName) {
            if (!this.defaultNameService) {
                throw new Error('defaultNameService is undefined');
            }
            const registry = getNameServiceRegistryFromName(this.defaultNameService);
            if (!registry) {
                throw new Error('Unknown defaultNameService ' + this.defaultNameService);
            }
            _chainName = registry.chainName;
        }
        else {
            _chainName = chainName;
        }
        return await this.getWalletRepo(_chainName).getNameService();
    };
    _reconnect = async (walletName) => {
        this.logger?.debug('[CORE EVENT] Emit `refresh_connection`');
        this.coreEmitter.emit('refresh_connection');
        await this.getMainWallet(walletName).connect();
        await this.getMainWallet(walletName)
            .getChainWalletList(true)[0]
            ?.connect(true);
    };
    _restoreAccounts = async () => {
        const walletName = window.localStorage.getItem('cosmos-kit@2:core//current-wallet');
        if (walletName) {
            const mainWallet = this.getMainWallet(walletName);
            mainWallet.activate();
            if (mainWallet.clientMutable.state === State.Done) {
                const accountsStr = window.localStorage.getItem('cosmos-kit@2:core//accounts');
                if (accountsStr && accountsStr !== '[]') {
                    const accounts = JSON.parse(accountsStr);
                    accounts.forEach((data) => {
                        const chainWallet = mainWallet
                            .getChainWalletList(false)
                            .find((w) => w.chainRecord.chain.chain_id === data.chainId &&
                            w.namespace === data.namespace);
                        chainWallet?.activate();
                        if (mainWallet.walletInfo.mode === 'wallet-connect') {
                            chainWallet?.setData(data);
                            chainWallet?.setState(State.Done);
                        }
                    });
                    mainWallet.setState(State.Done);
                }
            }
            if (mainWallet.walletInfo.mode !== 'wallet-connect') {
                await this._reconnect(walletName);
            }
        }
    };
    onMounted = async () => {
        if (typeof window === 'undefined')
            return;
        const parser = Bowser.getParser(window.navigator.userAgent);
        const env = {
            browser: parser.getBrowserName(true),
            device: (parser.getPlatform().type || 'desktop'),
            os: parser.getOSName(true),
        };
        this.setEnv(env);
        this.walletRepos.forEach((repo) => repo.setEnv(env));
        await Promise.all(this.mainWallets.map(async (wallet) => {
            wallet.setEnv(env);
            wallet.emitter?.emit('broadcast_env', env);
            wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
                window.addEventListener(eventName, this._reconnectMap[wallet.walletName]);
            });
            wallet.walletInfo.connectEventNamesOnClient?.forEach(async (eventName) => {
                wallet.client?.on?.(eventName, this._reconnectMap[wallet.walletName]);
            });
            if (wallet.walletInfo.mode === 'wallet-connect') {
                await wallet.initClient(this.walletConnectOptions);
            }
            else {
                await wallet.initClient();
            }
            wallet.chainWalletMap?.forEach((chainWallet) => {
                chainWallet.initClientDone(wallet.client);
            });
        }));
        await this._restoreAccounts();
    };
    onUnmounted = () => {
        if (typeof window === 'undefined') {
            return;
        }
        this.mainWallets.forEach((wallet) => {
            wallet.walletInfo.connectEventNamesOnWindow?.forEach((eventName) => {
                window.removeEventListener(eventName, this._reconnectMap[wallet.walletName]);
            });
            wallet.walletInfo.connectEventNamesOnClient?.forEach(async (eventName) => {
                wallet.client?.off?.(eventName, this._reconnectMap[wallet.walletName]);
            });
        });
    };
}
//# sourceMappingURL=manager.js.map