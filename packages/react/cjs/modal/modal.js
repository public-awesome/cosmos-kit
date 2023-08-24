"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultModal = exports.WalletModal = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@cosmos-kit/core");
const react_1 = require("@interchain-ui/react");
const react_2 = require("react");
const views_1 = require("./components/views");
function WalletModal({ isOpen, setOpen, walletRepo, modalViews, includeAllWalletsOnMobile, overrides, themeDefs, customTheme, defaultTheme, }) {
    const initialFocus = (0, react_2.useRef)();
    const [currentView, setCurrentView] = (0, react_2.useState)(core_1.ModalView.WalletList);
    const [qrState, setQRState] = (0, react_2.useState)(core_1.State.Init); // state of QRCode
    const [qrMsg, setQRMsg] = (0, react_2.useState)(''); //   message of QRCode error
    const current = walletRepo?.current;
    current?.client?.setActions?.({
        qrUrl: {
            state: setQRState,
            message: setQRMsg,
        },
    });
    const walletStatus = current?.walletStatus;
    const message = current?.message;
    (0, react_2.useEffect)(() => {
        if (isOpen) {
            switch (walletStatus) {
                case core_1.WalletStatus.Connecting:
                    if (qrState === core_1.State.Init) {
                        setCurrentView(core_1.ModalView.Connecting);
                    }
                    else {
                        setCurrentView(core_1.ModalView.QRCode);
                    }
                    break;
                case core_1.WalletStatus.Connected:
                    setCurrentView(core_1.ModalView.Connected);
                    break;
                case core_1.WalletStatus.Error:
                    if (qrState === core_1.State.Init) {
                        setCurrentView(core_1.ModalView.Error);
                    }
                    else {
                        setCurrentView(core_1.ModalView.QRCode);
                    }
                    break;
                case core_1.WalletStatus.Rejected:
                    setCurrentView(core_1.ModalView.Rejected);
                    break;
                case core_1.WalletStatus.NotExist:
                    setCurrentView(core_1.ModalView.NotExist);
                    break;
                case core_1.WalletStatus.Disconnected:
                    setCurrentView(core_1.ModalView.WalletList);
                    break;
                default:
                    setCurrentView(core_1.ModalView.WalletList);
                    break;
            }
        }
    }, [isOpen, qrState, walletStatus, qrMsg, message]);
    const onCloseModal = (0, react_2.useCallback)(() => {
        setOpen(false);
        if (walletStatus === 'Connecting') {
            current?.disconnect();
        }
    }, [setOpen, walletStatus, current]);
    const onReturn = (0, react_2.useCallback)(() => {
        setCurrentView(core_1.ModalView.WalletList);
    }, [setCurrentView]);
    const wallets = (0, react_2.useMemo)(() => !includeAllWalletsOnMobile
        ? walletRepo?.platformEnabledWallets
        : walletRepo?.wallets, [walletRepo, includeAllWalletsOnMobile]);
    const modalView = (0, react_2.useMemo)(() => {
        const getImplementation = modalViews[`${currentView}`];
        switch (currentView) {
            case core_1.ModalView.WalletList:
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
    return ((0, jsx_runtime_1.jsx)(react_1.ThemeProvider, { defaultTheme: defaultTheme, overrides: overrides, themeDefs: themeDefs, customTheme: customTheme, children: (0, jsx_runtime_1.jsx)(react_1.ConnectModal, { isOpen: isOpen, header: modalView.head, onClose: onCloseModal, children: modalView.content }) }));
}
exports.WalletModal = WalletModal;
function DefaultModal({ isOpen, setOpen, walletRepo, }) {
    return ((0, jsx_runtime_1.jsx)(WalletModal, { isOpen: isOpen, setOpen: setOpen, walletRepo: walletRepo, modalViews: views_1.defaultModalViews }));
}
exports.DefaultModal = DefaultModal;
//# sourceMappingURL=modal.js.map