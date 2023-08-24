"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useModalTheme = void 0;
const react_1 = require("@interchain-ui/react");
const react_2 = require("react");
const zustand_1 = require("zustand");
const shallow_1 = require("zustand/shallow");
const useStore = (0, zustand_1.create)(react_1.store);
const useCosmologyUIStore = () => {
    return useStore((state) => ({
        theme: state.theme,
        themeClass: state.themeClass,
        setThemeMode: state.setThemeMode,
    }), shallow_1.shallow);
};
function useModalTheme() {
    const { theme, setThemeMode } = useCosmologyUIStore();
    const value = (0, react_2.useMemo)(() => theme, [theme]);
    const setModalTheme = (0, react_2.useCallback)((mode) => {
        setThemeMode(mode);
    }, []);
    return {
        modalTheme: value,
        setModalTheme,
    };
}
exports.useModalTheme = useModalTheme;
//# sourceMappingURL=useModalTheme.js.map