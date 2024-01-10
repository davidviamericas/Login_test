import { create } from 'zustand'

const useLoader = create((set: (partial: any, replace?: boolean | undefined) => void, get: () => any) => ({
    open: false,
    background: "",
    getLoader: () => { return { open: get().open, background: get().background }},
    setLoader: (status: boolean, background="rgba(255,255,255,0.3)") => set({ open: status, background: background }),
}))

export default useLoader;
