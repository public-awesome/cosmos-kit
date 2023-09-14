import { ClientNotExistError } from '@cosmos-kit/core';
export const getCosmostationFromExtension = async () => {
    if (typeof window === 'undefined') {
        return void 0;
    }
    const cosmostation = window.cosmostation;
    if (cosmostation) {
        return cosmostation;
    }
    if (document.readyState === 'complete') {
        if (cosmostation) {
            return cosmostation;
        }
        else {
            throw ClientNotExistError;
        }
    }
    return new Promise((resolve, reject) => {
        const documentStateChange = (event) => {
            if (event.target &&
                event.target.readyState === 'complete') {
                if (cosmostation) {
                    resolve(cosmostation);
                }
                else {
                    reject(ClientNotExistError.message);
                }
                document.removeEventListener('readystatechange', documentStateChange);
            }
        };
        document.addEventListener('readystatechange', documentStateChange);
    });
};
//# sourceMappingURL=utils.js.map