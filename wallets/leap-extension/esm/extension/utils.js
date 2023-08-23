import { ClientNotExistError } from '@cosmos-kit/core';
export const getLeapFromExtension = async () => {
    if (typeof window === 'undefined') {
        return void 0;
    }
    const leap = window.leap;
    if (leap) {
        return leap;
    }
    if (document.readyState === 'complete') {
        if (leap) {
            return leap;
        }
        else {
            throw ClientNotExistError;
        }
    }
    return new Promise((resolve, reject) => {
        const documentStateChange = (event) => {
            if (event.target &&
                event.target.readyState === 'complete') {
                if (leap) {
                    resolve(leap);
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