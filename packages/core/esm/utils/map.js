export function valuesApply(target, callbackfn) {
    return new Map(Array.from(target).map(([key, value]) => [key, callbackfn(value)]));
}
//# sourceMappingURL=map.js.map