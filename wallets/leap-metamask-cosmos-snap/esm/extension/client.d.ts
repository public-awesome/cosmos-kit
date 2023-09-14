import { AminoSignResponse, OfflineAminoSigner, StdSignature, StdSignDoc } from '@cosmjs/amino';
import { Algo } from '@cosmjs/proto-signing';
import { SignType } from '@cosmos-kit/core';
import { SignOptions, WalletClient } from '@cosmos-kit/core';
import { ChainInfo, CosmjsOfflineSigner } from '@leapwallet/cosmos-snap-provider';
import { ProviderLong } from '@leapwallet/cosmos-snap-provider';
export declare class CosmosSnapClient implements WalletClient {
    readonly snapInstalled: boolean;
    constructor();
    getSimpleAccount(chainId: string): Promise<{
        namespace: string;
        chainId: string;
        address: string;
        username: string;
    }>;
    handleConnect(): Promise<void>;
    getAccount(chainId: string): Promise<{
        username: string;
        address: string;
        algo: Algo;
        pubkey: Uint8Array;
    }>;
    getOfflineSigner(chainId: string, preferredSignType?: SignType): OfflineAminoSigner | CosmjsOfflineSigner;
    getOfflineSignerAmino(chainId: string): OfflineAminoSigner;
    getOfflineSignerDirect(chainId: string): CosmjsOfflineSigner;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: SignOptions): Promise<AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: {
        bodyBytes?: Uint8Array | null;
        authInfoBytes?: Uint8Array | null;
        chainId?: string | null;
        accountNumber?: ProviderLong | null;
    }): Promise<{
        signature: StdSignature;
        signed: {
            accountNumber: string;
            authInfoBytes: Uint8Array;
            bodyBytes: Uint8Array;
            chainId: string;
        };
    }>;
    signArbitrary(chainId: string, signer: string, data: string): Promise<StdSignature>;
    addChain(chainInfo: ChainInfo): Promise<void>;
}
