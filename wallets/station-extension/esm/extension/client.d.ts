import { WalletClient, WalletAccount } from '@cosmos-kit/core';
import Station from '@terra-money/station-connector';
export declare class StationClient implements WalletClient {
    readonly client: Station;
    constructor(client: Station);
    disconnect(): Promise<void>;
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
        username: string;
    }>;
    getAccount(chainId: string): Promise<WalletAccount>;
    getOfflineSigner(chainId: string): Promise<import("@terra-money/station-connector/cosmjsOfflineSigner").default>;
}
