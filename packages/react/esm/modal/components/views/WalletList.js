import { jsx as _jsx } from "react/jsx-runtime";
import { ConnectModalHead, ConnectModalWalletList, } from '@interchain-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getWalletProp } from './config';
function DynamicWalletList({ wallets, onClose }) {
    const [isLargeScreen, setIsLargeScreen] = useState(true);
    const onWalletClicked = useCallback(async (wallet) => {
        await wallet.connect(true);
        onClose();
    }, []);
    useEffect(() => {
        const handleWindowResize = () => {
            if (window.innerWidth >= 768) {
                setIsLargeScreen(true);
            }
            else {
                setIsLargeScreen(false);
            }
        };
        handleWindowResize();
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    const walletsData = useMemo(() => wallets
        .sort((a, b) => {
        if (a.walletInfo.mode !== 'wallet-connect' &&
            b.walletInfo.mode !== 'wallet-connect') {
            return 0;
        }
        else if (a.walletInfo.mode !== 'wallet-connect') {
            return -1;
        }
        else {
            return 1;
        }
    })
        .map((wallet, i) => {
        return {
            ...getWalletProp(wallet.walletInfo),
            // subLogo can either be 'walletConnect' or a valid <img /> src attribute
            subLogo: wallet.walletInfo.mode === 'wallet-connect'
                ? 'walletConnect'
                : undefined,
            btmLogo: wallet.walletInfo.extends,
            badge: ({ MetaMask: 'SNAP' })[wallet.walletInfo.extends],
            shape: i < 2 && isLargeScreen ? 'square' : 'list',
            downloadUrl: '',
            originalWallet: wallet,
        };
    }), [wallets, isLargeScreen]);
    return (_jsx(ConnectModalWalletList, { wallets: walletsData, onWalletItemClick: onWalletClicked }));
}
export function WalletListView({ onClose, wallets, initialFocus, }) {
    const modalHead = (_jsx(ConnectModalHead, { title: "Select your wallet", hasBackButton: false, onClose: onClose }));
    const modalContent = (_jsx(DynamicWalletList, { wallets: wallets, onClose: onClose }));
    return { head: modalHead, content: modalContent };
}
//# sourceMappingURL=WalletList.js.map