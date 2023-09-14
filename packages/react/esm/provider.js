import { jsx as _jsx } from "react/jsx-runtime";
import { Logger, } from '@cosmos-kit/core';
import { ChainProvider as ChainProviderLite } from '@cosmos-kit/react-lite';
import { useCallback, useMemo } from 'react';
import { WalletModal } from './modal';
import { defaultModalViews } from './modal/components/views';
export const ChainProvider = ({ chains, assetLists, wallets, walletModal, modalViews, throwErrors = false, subscribeConnectEvents = true, defaultNameService = 'icns', walletConnectOptions, signerOptions, endpointOptions, sessionOptions, logLevel = 'WARN', children, modalTheme = {}, }) => {
    const logger = useMemo(() => new Logger(logLevel), []);
    const withChainProvider = (modal) => (_jsx(ChainProviderLite, { chains: chains, assetLists: assetLists, wallets: wallets, walletModal: modal, throwErrors: throwErrors, subscribeConnectEvents: subscribeConnectEvents, defaultNameService: defaultNameService, walletConnectOptions: walletConnectOptions, signerOptions: signerOptions, endpointOptions: endpointOptions, sessionOptions: sessionOptions, logLevel: logLevel, children: children }));
    if (walletModal) {
        logger.debug('Using provided wallet modal.');
        return withChainProvider(walletModal);
    }
    logger.debug('Using default wallet modal.');
    const defaultModal = useCallback((props) => (_jsx(WalletModal, { ...props, ...modalTheme, modalViews: {
            ...defaultModalViews,
            ...modalViews,
        } })), [defaultModalViews]);
    return withChainProvider(defaultModal);
};
//# sourceMappingURL=provider.js.map