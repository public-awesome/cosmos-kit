/// <reference types="long" />
import { AminoSignResponse, OfflineAminoSigner, StdSignDoc, StdSignature } from '@cosmjs/amino';
import { OfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { DirectSignResponse } from '@cosmjs/proto-signing';
import { BroadcastMode, Key } from '@cosmos-kit/core';
export interface XDEFISignOptions {
    readonly preferNoSetFee?: boolean;
    readonly preferNoSetMemo?: boolean;
    readonly disableBalanceCheck?: boolean;
}
export interface XDEFI {
    isXDEFI: boolean;
    disconnect(): Promise<void>;
    enable(chainIds: string | string[]): Promise<void>;
    mode: 'extension';
    getKey(chainId: string): Promise<Key>;
    getOfflineSigner(chainId: string): OfflineAminoSigner & OfflineDirectSigner;
    getOfflineSignerOnlyAmino(chainId: string): OfflineAminoSigner;
    getOfflineSignerAuto(chainId: string): Promise<OfflineSigner>;
    signAmino(chainId: string, signer: string, signDoc: StdSignDoc, signOptions?: XDEFISignOptions): Promise<AminoSignResponse>;
    signDirect(chainId: string, signer: string, signDoc: {
        /** SignDoc bodyBytes */
        bodyBytes?: Uint8Array | null;
        /** SignDoc authInfoBytes */
        authInfoBytes?: Uint8Array | null;
        /** SignDoc chainId */
        chainId?: string | null;
        /** SignDoc accountNumber */
        accountNumber?: Long | null;
    }, signOptions?: XDEFISignOptions): Promise<DirectSignResponse>;
    signArbitrary(chainId: string, signer: string, data: string | Uint8Array): Promise<StdSignature>;
    getEnigmaPubKey(chainId: string): Promise<Uint8Array>;
    getEnigmaTxEncryptionKey(chainId: string, nonce: Uint8Array): Promise<Uint8Array>;
    enigmaEncrypt(chainId: string, contractCodeHash: string, msg: object): Promise<Uint8Array>;
    enigmaDecrypt(chainId: string, ciphertext: Uint8Array, nonce: Uint8Array): Promise<Uint8Array>;
    sendTx(chainId: string, tx: Uint8Array, mode: BroadcastMode): Promise<Uint8Array>;
}
