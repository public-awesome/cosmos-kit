"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainProvider = exports.walletContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const core_1 = require("@cosmos-kit/core");
const react_1 = require("react");
exports.walletContext = (0, react_1.createContext)(null);
function ChainProvider({ chains, assetLists, wallets, walletModal: ProvidedWalletModal, throwErrors = false, defaultNameService = 'icns', walletConnectOptions, signerOptions, endpointOptions, sessionOptions, logLevel = 'WARN', children, }) {
    const logger = (0, react_1.useMemo)(() => new core_1.Logger(logLevel), []);
    const walletManager = (0, react_1.useMemo)(() => new core_1.WalletManager(chains, assetLists, wallets, logger, throwErrors, defaultNameService, walletConnectOptions, signerOptions, endpointOptions, sessionOptions), []);
    const [isViewOpen, setViewOpen] = (0, react_1.useState)(false);
    const [viewWalletRepo, setViewWalletRepo] = (0, react_1.useState)();
    const [, setData] = (0, react_1.useState)();
    const [, setState] = (0, react_1.useState)(core_1.State.Init);
    const [, setMsg] = (0, react_1.useState)();
    const [, setClientState] = (0, react_1.useState)(core_1.State.Init);
    const [, setClientMsg] = (0, react_1.useState)();
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
    (0, react_1.useEffect)(() => {
        walletManager.onMounted();
        return () => {
            setViewOpen(false);
            walletManager.onUnmounted();
        };
    }, []);
    return ((0, jsx_runtime_1.jsxs)(exports.walletContext.Provider, { value: { walletManager, modalProvided: Boolean(ProvidedWalletModal) }, children: [ProvidedWalletModal && ((0, jsx_runtime_1.jsx)(ProvidedWalletModal, { isOpen: isViewOpen, setOpen: setViewOpen, walletRepo: viewWalletRepo })), children] }));
}
exports.ChainProvider = ChainProvider;
//# sourceMappingURL=provider.js.map