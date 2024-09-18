import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios, { AxiosResponse } from "axios";

import { IAppInfo, AppState } from "@/types/shared/appState";
import { AUTH_LOGIN_URL } from "@/constants/AuthConstants";

export const initAppInfo: IAppInfo = {
    title: "MobiLearn",
    description: "MobiLearn is a mobile learning platform that allows you to learn on the go.",
};

const useAppStore = create(
    persist<AppState>(
        (set, get) => ({
            token: "",
            // example of how to use axios with zustand
            // login: async (payload: ILogin) => {
            //     const loginResponse = await axios.post(AUTH_LOGIN_URL, payload).then((res) => res);
            //     if (loginResponse.status === 200) {
            //         set({ token: loginResponse.data.token });
            //     }
            // }
        }),
        {
            name: "app-store",
            storage: createJSONStorage(() => sessionStorage)
        }
    )
)