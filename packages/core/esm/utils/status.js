import { WalletStatus } from '../types';
import { ClientNotExistError, RejectedError } from './error';
export const getWalletStatusFromState = (state, message) => {
    switch (state) {
        case 'Pending':
            return WalletStatus.Connecting;
        case 'Done':
            return WalletStatus.Connected;
        case 'Error':
            switch (message) {
                case ClientNotExistError.message:
                    return WalletStatus.NotExist;
                case RejectedError.message:
                    return WalletStatus.Rejected;
                default:
                    return WalletStatus.Error;
            }
        case 'Init':
            return WalletStatus.Disconnected;
        default:
            return WalletStatus.Disconnected;
    }
};
//# sourceMappingURL=status.js.map