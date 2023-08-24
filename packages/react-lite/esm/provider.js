import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Logger, State, WalletManager, } from '@cosmos-kit/core';
import { createContext, useEffect, useMemo, useState } from 'react';
export const walletContext = createContext(null);
export function ChainProvider({ chains, assetLists, wallets, walletModal: ProvidedWalletModal, throwErrors = false, defaultNameService = 'icns', walletConnectOptions, signerOptions, endpointOptions, sessionOptions, logLevel = 'WARN', children, }) {
    const logger = useMemo(() => new Logger(logLevel), []);
    const walletManager = useMemo(() => new WalletManager(chains, assetLists, wallets, logger, throwErrors, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions), []);
    const [isViewOpen, setViewOpen] = useState(false);
    const [viewWalletRepo, setViewWalletRepo] = useState();
    const [, setData] = useState();
    const [, setState] = useState(State.Init);
    const [, setMsg] = useState();
    const [, setClientState] = useState(State.Init);
    const [, setClientMsg] = useState();
    walletManager.setActions({
        viewOpen: setViewOpen,
        viewWalletRepo: setViewWalletRepo,
        data: setData,
        state: setState,
        message: setMsg,
    });
    walletManager.walletRepos.forEach((wr) => {
        wr.setActions({
            viewOpen: setViewOpen,
            viewWalletRepo: setViewWalletRepo,
        });
        wr.wallets.forEach((w) => {
            w.setActions({
                data: setData,
                state: setState,
                message: setMsg,
            });
        });
    });
    walletManager.mainWallets.forEach((w) => {
        w.setActions({
            data: setData,
            state: setState,
            message: setMsg,
            clientState: setClientState,
            clientMessage: setClientMsg,
        });
    });
    useEffect(() => {
        walletManager.onMounted();
        return () => {
            setViewOpen(false);
            walletManager.onUnmounted();
        };
    }, []);
    return (_jsxs(walletContext.Provider, { value: { walletManager, modalProvided: Boolean(ProvidedWalletModal) }, children: [ProvidedWalletModal && (_jsx(ProvidedWalletModal, { isOpen: isViewOpen, setOpen: setViewOpen, walletRepo: viewWalletRepo })), children] }));
}
//# sourceMappingURL=provider.js.map