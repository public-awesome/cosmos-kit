"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletContext = exports.useWalletClient = exports.useWallet = exports.useNameService = exports.useManager = exports.useChainWallet = exports.useChain = void 0;
var react_lite_1 = require("@cosmos-kit/react-lite");
Object.defineProperty(exports, "useChain", { enumerable: true, get: function () { return react_lite_1.useChain; } });
Object.defineProperty(exports, "useChainWallet", { enumerable: true, get: function () { return react_lite_1.useChainWallet; } });
Object.defineProperty(exports, "useManager", { enumerable: true, get: function () { return react_lite_1.useManager; } });
Object.defineProperty(exports, "useNameService", { enumerable: true, get: function () { return react_lite_1.useNameService; } });
Object.defineProperty(exports, "useWallet", { enumerable: true, get: function () { return react_lite_1.useWallet; } });
Object.defineProperty(exports, "useWalletClient", { enumerable: true, get: function () { return react_lite_1.useWalletClient; } });
Object.defineProperty(exports, "walletContext", { enumerable: true, get: function () { return react_lite_1.walletContext; } });
__exportStar(require("./modal"), exports);
__exportStar(require("./provider"), exports);
__exportStar(require("./hooks"), exports);
//# sourceMappingURL=index.js.map