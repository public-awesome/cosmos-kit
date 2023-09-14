export function checkInit(target, targetName, msg) {
    if (target === undefined || target === null) {
        throw new Error(msg || `${targetName || 'Variable'} is not inited!`);
    }
}
export function checkKey(target, key, targetName, msg) {
    if (!target.has(key)) {
        throw new Error(msg || `${key} not existed in Map ${targetName}!`);
    }
}
//# sourceMappingURL=check.js.map