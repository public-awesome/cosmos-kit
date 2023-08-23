/* eslint-disable no-unused-expressions */
import { CosmWasmClient, SigningCosmWasmClient, } from '@cosmjs/cosmwasm-stargate';
import { calculateFee, SigningStargateClient, StargateClient, } from '@cosmjs/stargate';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { NameService } from '../name-service';
import { State, } from '../types';
import { getFastestEndpoint, getIsLazy, getNameServiceRegistryFromChainName, isValidEndpoint, } from '../utils';
import { WalletBase } from './wallet';
export class ChainWalletBase extends WalletBase {
    mainWallet;
    _chainRecord;
    rpcEndpoints = [];
    restEndpoints = [];
    _rpcEndpoint;
    _restEndpoint;
    connectChains;
    offlineSigner;
    namespace = 'cosmos';
    isLazy; // stands for real `chainIsLazy` considered both `globalIsLazy` and `chainIsLazy` settings
    constructor(walletInfo, chainRecord) {
        super(walletInfo);
        this._chainRecord = chainRecord;
        this.rpcEndpoints = chainRecord.preferredEndpoints?.rpc;
        this.restEndpoints = chainRecord.preferredEndpoints?.rest;
    }
    get chainRecord() {
        return this._chainRecord;
    }
    get chainName() {
        return this.chainRecord.name;
    }
    get chainLogoUrl() {
        return (
        // until chain_registry fix this
        // this.chainInfo.chain.logo_URIs?.svg ||
        // this.chainInfo.chain.logo_URIs?.png ||
        // this.chainInfo.chain.logo_URIs?.jpeg ||
        this.chainRecord.assetList?.assets[0]?.logo_URIs?.svg ||
            this.chainRecord.assetList?.assets[0]?.logo_URIs?.png ||
            undefined);
    }
    get stargateOptions() {
        return this.chainRecord.clientOptions?.stargate;
    }
    get signingStargateOptions() {
        return (this.chainRecord.clientOptions?.signingStargate ||
            this.chainRecord.clientOptions?.stargate);
    }
    get signingCosmwasmOptions() {
        return this.chainRecord.clientOptions?.signingCosmwasm;
    }
    get preferredSignType() {
        return this.chainRecord.clientOptions?.preferredSignType || 'amino';
    }
    get chain() {
        return this.chainRecord.chain;
    }
    get assets() {
        return this.chainRecord.assetList?.assets;
    }
    get assetList() {
        return this.chainRecord.assetList;
    }
    get chainId() {
        return this.chain?.chain_id;
    }
    get cosmwasmEnabled() {
        return this.chain?.codebase?.cosmwasm_enabled;
    }
    get username() {
        return this.data?.username;
    }
    get address() {
        return this.data?.address;
    }
    setData(data) {
        this._mutable.data = data;
        this.actions?.data?.(data);
        const accountsStr = window.localStorage.getItem('cosmos-kit@2:core//accounts');
        let accounts = accountsStr ? JSON.parse(accountsStr) : [];
        if (typeof data === 'undefined') {
            accounts = accounts.filter((a) => a.chainId !== this.chainId || a.namespace !== this.namespace);
        }
        else {
            accounts = accounts.filter((a) => a.chainId !== this.chainId || a.namespace !== this.namespace);
            accounts.push(data);
        }
        window?.localStorage.setItem('cosmos-kit@2:core//accounts', JSON.stringify(accounts));
        this.session?.update();
    }
    initClient(_options) {
        throw new Error('initClient not implemented');
    }
    async update(options = { connect: true }) {
        this.setState(State.Pending);
        this.setMessage(void 0);
        try {
            if (options.connect) {
                this.connectChains
                    ? await this.connectChains()
                    : await this?.client?.connect?.(this.chainId);
            }
            let account;
            try {
                this.logger?.debug(`Fetching ${this.walletName} ${this.chainId} account.`);
                account = await this?.client?.getSimpleAccount(this.chainId);
            }
            catch (error) {
                if (this.rejectMatched(error)) {
                    this.setRejected();
                    return;
                }
                if (this.client && this?.client?.addChain) {
                    await this.client.addChain(this.chainRecord);
                    account = await this.client.getSimpleAccount(this.chainId);
                }
                else {
                    throw error;
                }
            }
            this.setData(account);
            this.setState(State.Done);
            this.setMessage(void 0);
        }
        catch (e) {
            // this.logger?.error(e);
            if (e && this.rejectMatched(e)) {
                this.setRejected();
            }
            else {
                this.setError(e);
            }
        }
        if (!this.isWalletRejected) {
            window?.localStorage.setItem('cosmos-kit@2:core//current-wallet', this.walletName);
        }
    }
    getRpcEndpoint = async (isLazy) => {
        const lazy = getIsLazy(void 0, this.isLazy, this._rpcEndpoint?.isLazy, isLazy, this.logger);
        if (lazy) {
            const endpoint = this._rpcEndpoint || this.rpcEndpoints[0];
            if (!endpoint) {
                return Promise.reject('No endpoint available.');
            }
            return endpoint;
        }
        const nodeType = 'rpc';
        if (this._rpcEndpoint &&
            (await isValidEndpoint(this._rpcEndpoint, nodeType, lazy, this.logger))) {
            return this._rpcEndpoint;
        }
        this._rpcEndpoint = await getFastestEndpoint(this.rpcEndpoints, nodeType, this.logger);
        return this._rpcEndpoint;
    };
    getRestEndpoint = async (isLazy) => {
        const lazy = getIsLazy(void 0, this.isLazy, this._restEndpoint?.isLazy, isLazy, this.logger);
        if (lazy) {
            const endpoint = this._restEndpoint || this.restEndpoints[0];
            if (!endpoint) {
                return Promise.reject('No endpoint available.');
            }
            return endpoint;
        }
        const nodeType = 'rest';
        if (this._restEndpoint &&
            (await isValidEndpoint(this._restEndpoint, nodeType, lazy, this.logger))) {
            return this._restEndpoint;
        }
        this._restEndpoint = await getFastestEndpoint(this.restEndpoints, nodeType, this.logger);
        return this._restEndpoint;
    };
    getStargateClient = async () => {
        const rpcEndpoint = await this.getRpcEndpoint();
        return StargateClient.connect(rpcEndpoint, this.stargateOptions);
    };
    getCosmWasmClient = async () => {
        const rpcEndpoint = await this.getRpcEndpoint();
        return CosmWasmClient.connect(rpcEndpoint);
    };
    getNameService = async () => {
        const client = await this.getCosmWasmClient();
        const registry = getNameServiceRegistryFromChainName(this.chainName);
        return new NameService(client, registry);
    };
    async initOfflineSigner() {
        if (typeof this.client === 'undefined') {
            throw new Error('WalletClient is not initialized');
        }
        this.offlineSigner = await this.client.getOfflineSigner(this.chainId, this.preferredSignType);
    }
    getSigningStargateClient = async () => {
        const rpcEndpoint = await this.getRpcEndpoint();
        if (!this.offlineSigner) {
            await this.initOfflineSigner();
        }
        return SigningStargateClient.connectWithSigner(rpcEndpoint, this.offlineSigner, this.signingStargateOptions);
    };
    getSigningCosmWasmClient = async () => {
        const rpcEndpoint = await this.getRpcEndpoint();
        if (!this.offlineSigner) {
            await this.initOfflineSigner();
        }
        return SigningCosmWasmClient.connectWithSigner(rpcEndpoint, this.offlineSigner, this.signingCosmwasmOptions);
    };
    getSigningClient = async (type) => {
        switch (type) {
            case 'stargate':
                return await this.getSigningStargateClient();
            case 'cosmwasm':
                return await this.getSigningCosmWasmClient();
            default:
                return this.getSigningStargateClient();
        }
    };
    estimateFee = async (messages, type, memo, multiplier) => {
        if (!this.address) {
            throw new Error('Address is required to estimate fee. Try connect to fetch address.');
        }
        let gasPrice;
        switch (type) {
            case 'stargate':
                gasPrice = this.signingStargateOptions?.gasPrice;
                break;
            case 'cosmwasm':
                // @ts-expect-error
                gasPrice = this.signingCosmwasmOptions?.gasPrice;
                break;
            default:
                gasPrice = this.signingStargateOptions?.gasPrice;
                break;
        }
        if (!gasPrice) {
            throw new Error('Gas price must be set in the client options when auto gas is used.');
        }
        const client = await this.getSigningClient(type);
        const gasEstimation = await client.simulate(this.address, messages, memo);
        return calculateFee(Math.round(gasEstimation * (multiplier || 1.3)), gasPrice);
    };
    sign = async (messages, fee, memo, type) => {
        if (!this.address) {
            throw new Error('Address is required to estimate fee. Try connect to fetch address.');
        }
        const client = await this.getSigningClient(type);
        let usedFee;
        if (typeof fee === 'undefined' || typeof fee === 'number') {
            usedFee = await this.estimateFee(messages, type, memo, fee);
        }
        else {
            usedFee = fee;
        }
        return await client.sign(this.address, messages, usedFee, memo || '');
    };
    broadcast = async (signedMessages, type) => {
        const client = await this.getSigningClient(type);
        const txBytes = TxRaw.encode(signedMessages).finish();
        let timeoutMs, pollIntervalMs;
        switch (type) {
            case 'stargate':
                timeoutMs = this.signingStargateOptions?.broadcastTimeoutMs;
                pollIntervalMs = this.signingStargateOptions?.broadcastPollIntervalMs;
                break;
            case 'cosmwasm':
                timeoutMs = this.signingCosmwasmOptions?.broadcastTimeoutMs;
                pollIntervalMs = this.signingCosmwasmOptions?.broadcastPollIntervalMs;
                break;
            default:
                timeoutMs = this.signingStargateOptions?.broadcastTimeoutMs;
                pollIntervalMs = this.signingStargateOptions?.broadcastPollIntervalMs;
                break;
        }
        return client.broadcastTx(txBytes, timeoutMs, pollIntervalMs);
    };
    signAndBroadcast = async (messages, fee, memo, type) => {
        const signedMessages = await this.sign(messages, fee, memo, type);
        return this.broadcast(signedMessages, type);
    };
}
//# sourceMappingURL=chain-wallet.js.map