import { persist } from 'zustand/middleware';
import { create } from 'zustand';

export default create(
    persist(
        (set: (partial: any, replace?: boolean | undefined) => void, get: () => any) => ({
            ChainId: "USA000006",
            User: "test-1@inmindsoftware.com",
            Password: "Martest321@",
            Cookie: "VA_RME_DEVICE_ID=5832d653-2717-4fa1-8460-8deb0ac35fd7",
            setLoginInfo: (ChainId : string, User : string, Password : string, Cookie : string) =>
                set({
                    ChainId,
                    User,
                    Password,
                    Cookie
                }),
            getLoginInfo: () : any => {
                return {
                    ChainId: get().ChainId,
                    User: get().User,
                    Password: get().Password,
                    Cookie: get().Cookie,
                };
            },
        }),
        { name: 'loginInfo', getStorage: () => localStorage }
    )
);
