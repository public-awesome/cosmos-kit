import { Chain } from '@chain-registry/types';
import { HttpEndpoint, SigningCosmWasmClientOptions } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClientOptions, StargateClientOptions } from '@cosmjs/stargate';
import { ChainName } from './chain';
import { Dispatch, SignType, StateActions } from './common';
import { WalletName } from './wallet';
export interface SignerOptions {
    stargate?: (chain: Chain) => StargateClientOptions | undefined;
    signingStargate?: (chain: Chain) => SigningStargateClientOptions | undefined;
    signingCosmwasm?: (chain: Chain) => SigningCosmWasmClientOptions | undefined;
    preferredSignType?: (chain: Chain) => SignType | undefined;
}
export interface SessionOptions {
    /**
     * Duration in ms.
     */
    duration: number;
    callback?: () => void;
}
export interface ExtendedHttpEndpoint extends HttpEndpoint {
    isLazy?: boolean;
}
export interface Endpoints {
    rpc?: (string | ExtendedHttpEndpoint)[];
    rest?: (string | ExtendedHttpEndpoint)[];
    isLazy?: boolean;
}
export interface EndpointOptions {
    isLazy?: boolean;
    endpoints?: Record<ChainName, Endpoints>;
}
export interface ManagerActions<T> extends StateActions<T> {
    walletName?: Dispatch<WalletName | undefined>;
    chainName?: Dispatch<ChainName | undefined>;
    viewOpen?: Dispatch<boolean>;
}
export declare type EventName = 'refresh_connection';
