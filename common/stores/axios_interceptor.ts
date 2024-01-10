import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { interceptorProps } from '../types';

export default create(
    persist(
        (set: (partial: any, replace?: boolean | undefined) => void, get: () => any) => ({
            interceptor: [],
            open: false,
            setOpenInterceptor: (open: boolean) => set({ open }),
            getOpenInterceptor: () : boolean => get().open,
            setInterceptor: (data: interceptorProps) =>
                set({
                    interceptor: [...get().interceptor, data]
                }),
            updateInterceptor: (data: interceptorProps) =>{
                const values = get().interceptor;
                const index = values.findIndex((item: interceptorProps) => item.key === data.key);
                values[index] = data;
                set({ interceptor: values});
            },
            deleteInterceptor: (key: string) =>{
                const values = get().interceptor;
                const index = values.findIndex((item: interceptorProps) => item.key === key);
                values.splice(index, 1);
                set({ interceptor: values});
            },
            getInterceptor: () : interceptorProps[] => {
                return get().interceptor;
            },
            clear: () => set({ interceptor: [] }),
        }),
        { name: 'interceptor', getStorage: () => localStorage }
    )
);
