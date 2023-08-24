import { useContext } from 'react';
import { walletContext } from '../provider';
export const useManager = () => {
    const context = useContext(walletContext);
    if (!context) {
        throw new Error('You have forgot to use ChainProvider.');
    }
    const { walletManager: { mainWallets, chainRecords, walletRepos, defaultNameService, getChainRecord, getWalletRepo, addChains, getChainLogo, getNameService, on, off, }, } = context;
    return {
        chainRecords,
        walletRepos,
        mainWallets,
        defaultNameService,
        getChainRecord,
        getWalletRepo,
        addChains,
        getChainLogo,
        getNameService,
        on,
        off,
    };
};
//# sourceMappingURL=useManager.js.map