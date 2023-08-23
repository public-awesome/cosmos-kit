/// <reference types="node" />
import EventEmitter from 'events';
import { Callbacks, DownloadInfo, Mutable, Wallet, WalletClient, WalletConnectOptions } from '../types';
import { Session } from '../utils';
import { StateBase } from './state';
export declare abstract class WalletBase extends StateBase {
    clientMutable: Mutable<WalletClient>;
    emitter?: EventEmitter;
    protected _walletInfo: Wallet;
    callbacks?: Callbacks;
    session?: Session;
    walletConnectOptions?: WalletConnectOptions;
    /**
     * isActive in mainWallet is not like chainWallet
     * - mainWallet: activated when connected
     * - chainWallet: activated when called by hooks (useChain, useChainWallet etc)
     */
    isActive: boolean;
    throwErrors: boolean;
    constructor(walletInfo: Wallet);
    get appUrl(): Mutable<import("../types").AppUrl>;
    get qrUrl(): Mutable<string>;
    activate(): void;
    inactivate(): void;
    get client(): WalletClient;
    initingClient(): void;
    initClientDone(client: WalletClient | undefined): void;
    initClientError(error: Error | undefined): void;
    get walletInfo(): Wallet;
    get isModeExtension(): boolean;
    get isModeWalletConnect(): boolean;
    get downloadInfo(): DownloadInfo | undefined;
    get walletName(): string;
    get walletPrettyName(): string;
    get rejectMessageSource(): string;
    get rejectMessageTarget(): string;
    get rejectCode(): number;
    rejectMatched(e: Error): boolean;
    updateCallbacks(callbacks: Callbacks): void;
    protected _disconnect: (sync?: boolean) => Promise<void>;
    disconnect: (sync?: boolean) => Promise<void>;
    setClientNotExist(): void;
    setRejected(): void;
    setError(e?: Error | string): void;
    connect: (sync?: boolean) => Promise<void>;
    abstract initClient(options?: any): void | Promise<void>;
    abstract update(): void | Promise<void>;
}
