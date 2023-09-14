"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletBase = void 0;
const types_1 = require("../types");
const utils_1 = require("../utils");
const state_1 = require("./state");
class WalletBase extends state_1.StateBase {
    clientMutable = { state: types_1.State.Init };
    emitter;
    _walletInfo;
    callbacks;
    session;
    walletConnectOptions;
    /**
     * isActive in mainWallet is not like chainWallet
     * - mainWallet: activated when connected
     * - chainWallet: activated when called by hooks (useChain, useChainWallet etc)
     */
    isActive = false;
    throwErrors = false;
    constructor(walletInfo) {
        super();
        this._walletInfo = walletInfo;
    }
    get appUrl() {
        return this.client?.appUrl;
    }
    get qrUrl() {
        return this.client?.qrUrl;
    }
    activate() {
        this.isActive = true;
    }
    inactivate() {
        this.isActive = false;
    }
    get client() {
        return this.clientMutable?.data;
    }
    initingClient() {
        this.clientMutable.state = types_1.State.Pending;
    }
    initClientDone(client) {
        this.clientMutable.data = client;
        this.clientMutable.state = types_1.State.Done;
    }
    initClientError(error) {
        this.clientMutable.message = error?.message;
        this.clientMutable.state = types_1.State.Error;
    }
    get walletInfo() {
        return this._walletInfo;
    }
    get isModeExtension() {
        return this.walletInfo.mode === 'extension';
    }
    get isModeWalletConnect() {
        return this.walletInfo.mode === 'wallet-connect';
    }
    get downloadInfo() {
        let downloads = this.walletInfo.downloads || [];
        downloads = downloads.filter((d) => d.device === this.env?.device || !d.device);
        if (downloads.length === 1) {
            return downloads[0];
        }
        downloads = downloads.filter((d) => d.os === this.env?.os || !d.os);
        if (downloads.length === 1) {
            return downloads[0];
        }
        downloads = downloads.filter((d) => d.browser === this.env?.browser || !d.browser);
        return downloads[0];
    }
    get walletName() {
        return this.walletInfo.name;
    }
    get walletPrettyName() {
        return this.walletInfo.prettyName;
    }
    get rejectMessageSource() {
        if (typeof this.walletInfo.rejectMessage === 'string') {
            return this.walletInfo.rejectMessage;
        }
        else {
            return this.walletInfo.rejectMessage?.source;
        }
    }
    get rejectMessageTarget() {
        if (typeof this.walletInfo.rejectMessage === 'string') {
            return void 0;
        }
        else {
            return this.walletInfo.rejectMessage?.target;
        }
    }
    get rejectCode() {
        return this.walletInfo.rejectCode;
    }
    rejectMatched(e) {
        return ((this.rejectMessageSource && e.message === this.rejectMessageSource) ||
            (this.rejectCode && e.code === this.rejectCode));
    }
    updateCallbacks(callbacks) {
        this.callbacks = { ...this.callbacks, ...callbacks };
    }
    _disconnect = async (sync) => {
        await this.callbacks?.beforeDisconnect?.();
        await this.client?.disconnect?.();
        this.reset();
        window.localStorage.removeItem('cosmos-kit@2:core//current-wallet');
        if (sync) {
            this.emitter?.emit('sync_disconnect', this.chainName);
            this.logger?.debug('[WALLET EVENT] Emit `sync_disconnect`');
        }
        await this.callbacks?.afterDisconnect?.();
    };
    disconnect = async (sync) => {
        await this._disconnect(sync);
    };
    setClientNotExist() {
        this.setState(types_1.State.Error);
        this.setMessage(utils_1.ClientNotExistError.message);
        if (this.throwErrors) {
            throw new Error(this.message);
        }
    }
    setRejected() {
        this.setState(types_1.State.Error);
        this.setMessage(utils_1.RejectedError.message);
        if (this.throwErrors) {
            throw new Error(this.message);
        }
    }
    setError(e) {
        this.setState(types_1.State.Error);
        this.setMessage(typeof e === 'string' ? e : e?.message);
        if (typeof e !== 'string' && e?.stack) {
            this.logger?.error(e.stack);
        }
        if (this.throwErrors) {
            throw new Error(this.message);
        }
    }
    connect = async (sync) => {
        await this.callbacks?.beforeConnect?.();
        const mobileDisabled = typeof this.walletInfo.mobileDisabled === 'boolean'
            ? this.walletInfo.mobileDisabled
            : this.walletInfo.mobileDisabled();
        if (this.isMobile && mobileDisabled) {
            this.setError('This wallet is not supported on mobile, please use desktop browsers.');
            return;
        }
        if (sync) {
            this.emitter?.emit('sync_connect', this.chainName);
            this.logger?.debug('[WALLET EVENT] Emit `sync_connect`');
        }
        try {
            if (!this.client) {
                this.setState(types_1.State.Pending);
                this.setMessage('InitClient');
                await this.initClient(this.walletInfo.mode === 'wallet-connect'
                    ? this.walletConnectOptions
                    : void 0);
                this.emitter?.emit('broadcast_client', this.client);
                this.logger?.debug('[WALLET EVENT] Emit `broadcast_client`');
                if (!this.client) {
                    this.setClientNotExist();
                    return;
                }
            }
            await this.update();
        }
        catch (error) {
            this.setError(error);
        }
        await this.callbacks?.afterConnect?.();
    };
}
exports.WalletBase = WalletBase;
//# sourceMappingURL=wallet.js.map