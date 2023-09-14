/// <reference types="react" />
import { WalletModalProps } from '@cosmos-kit/core';
import { ThemeProviderProps } from '@interchain-ui/react';
import { defaultModalViews } from './components/views';
export declare type ThemeCustomizationProps = Pick<ThemeProviderProps, 'defaultTheme' | 'overrides' | 'themeDefs' | 'customTheme'>;
export declare type WalletModalComponentProps = WalletModalProps & ThemeCustomizationProps & {
    modalViews: typeof defaultModalViews;
    includeAllWalletsOnMobile?: boolean;
};
export declare function WalletModal({ isOpen, setOpen, walletRepo, modalViews, includeAllWalletsOnMobile, overrides, themeDefs, customTheme, defaultTheme, }: WalletModalComponentProps): JSX.Element;
export declare function DefaultModal({ isOpen, setOpen, walletRepo, }: WalletModalProps): JSX.Element;
