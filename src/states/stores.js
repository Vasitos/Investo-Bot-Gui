// store/index.js
import { create } from "zustand"

const useStore = create(set => ({
    search: {},
    addSearch: data =>
        set({
            search: data
        }),
    removeSearch: () =>
        set(() => ({
            search: {}
        })),
}));

export const storeData = useStore;