import { ClientNotExistError } from '@cosmos-kit/core';
export const getTrustFromExtension = async () => {
    if (typeof window === 'undefined') {
        return void 0;
    }
    const trust = window.trustwallet?.cosmos;
    if (trust) {
        return trust;
    }
    if (document.readyState === 'complete') {
        if (trust) {
            return trust;
        }
        else {
            throw ClientNotExistError;
        }
    }
    return new Promise((resolve, reject) => {
        const documentStateChange = (event) => {
            if (event.target &&
                event.target.readyState === 'complete') {
                if (trust) {
                    resolve(trust);
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