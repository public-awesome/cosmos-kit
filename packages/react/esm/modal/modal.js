import { jsx as _jsx } from "react/jsx-runtime";
import { ModalView, State, WalletStatus, } from '@cosmos-kit/core';
import { ConnectModal, ThemeProvider, } from '@interchain-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { defaultModalViews } from './components/views';
export function WalletModal({ isOpen, setOpen, walletRepo, modalViews, includeAllWalletsOnMobile, overrides, themeDefs, customTheme, defaultTheme, }) {
    const initialFocus = useRef();
    const [currentView, setCurrentView] = useState(ModalView.WalletList);
    const [qrState, setQRState] = useState(State.Init); // state of QRCode
    const [qrMsg, setQRMsg] = useState(''); //   message of QRCode error
    const current = walletRepo?.current;
    current?.client?.setActions?.({
        qrUrl: {
            state: setQRState,
            message: setQRMsg,
        },
    });
    const walletStatus = current?.walletStatus;
    const message = current?.message;
    useEffect(() => {
        if (isOpen) {
            switch (walletStatus) {
                case WalletStatus.Connecting:
                    if (qrState === State.Init) {
                        setCurrentView(ModalView.Connecting);
                    }
                    else {
                        setCurrentView(ModalView.QRCode);
                    }
                    break;
                case WalletStatus.Connected:
                    setCurrentView(ModalView.Connected);
                    break;
                case WalletStatus.Error:
                    if (qrState === State.Init) {
                        setCurrentView(ModalView.Error);
                    }
                    else {
                        setCurrentView(ModalView.QRCode);
                    }
                    break;
                case WalletStatus.Rejected:
                    setCurrentView(ModalView.Rejected);
                    break;
                case WalletStatus.NotExist:
                    setCurrentView(ModalView.NotExist);
                    break;
                case WalletStatus.Disconnected:
                    setCurrentView(ModalView.WalletList);
                    break;
                default:
                    setCurrentView(ModalView.WalletList);
                    break;
            }
        }
    }, [isOpen, qrState, walletStatus, qrMsg, message]);
    const onCloseModal = useCallback(() => {
        setOpen(false);
        if (walletStatus === 'Connecting') {
            current?.disconnect();
        }
    }, [setOpen, walletStatus, current]);
    const onReturn = useCallback(() => {
        setCurrentView(ModalView.WalletList);
    }, [setCurrentView]);
    const wallets = useMemo(() => !includeAllWalletsOnMobile
        ? walletRepo?.platformEnabledWallets
        : walletRepo?.wallets, [walletRepo, includeAllWalletsOnMobile]);
    const modalView = useMemo(() => {
        const getImplementation = modalViews[`${currentView}`];
        switch (currentView) {
            case ModalView.WalletList:
                return getImplementation({
                    onClose: onCloseModal,
                    wallets: wallets || [],
                    initialFocus: initialFocus,
                });
            default:
                if (!current) {
                    return {
                        head: null,
                        content: null,
                    };
                }
                return getImplementation({
                    onClose: onCloseModal,
                    onReturn: onReturn,
                    wallet: current,
                });
        }
    }, [
        currentView,
        onReturn,
        onCloseModal,
        current,
        qrState,
        walletStatus,
        walletRepo,
        wallets,
        message,
        initialFocus,
        qrMsg,
    ]);
    return (_jsx(ThemeProvider, { defaultTheme: defaultTheme, overrides: overrides, themeDefs: themeDefs, customTheme: customTheme, children: _jsx(ConnectModal, { isOpen: isOpen, header: modalView.head, onClose: onCloseModal, children: modalView.content }) }));
}
export function DefaultModal({ isOpen, setOpen, walletRepo, }) {
    return (_jsx(WalletModal, { isOpen: isOpen, setOpen: setOpen, walletRepo: walletRepo, modalViews: defaultModalViews }));
}
//# sourceMappingURL=modal.js.map