import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import { userInfoProps } from '../types';

export default create(
    persist(
        (set: (partial: any, replace?: boolean | undefined) => void, get: () => any) => ({
            userInfo: {},
            env: "uat",
            setUserInfo: (data: userInfoProps) =>
                set({
                    userInfo: data
                }),
            getUserInfo: () : userInfoProps => {
                return get().userInfo;
            },
            clear: () => set({ userInfo: {} }),
            setEnv: (env: string) => set({ env: env }),
            getEnv: () : string => {
                return get().env;
            },
        }),
        { name: 'userInfo', getStorage: () => localStorage }
    )
);
