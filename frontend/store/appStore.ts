import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios, { AxiosResponse } from "axios";

import { IAppInfo, AppState, ILogin } from "@/types/shared/appState";
import { AUTH_LOGIN_URL } from "@/constants/Routes";

export const initAppInfo: IAppInfo = {
  title: "MobiLearn",
  description:
    "MobiLearn is a mobile learning platform that allows you to learn on the go.",
};

export const useAppStore = create(
  persist<AppState>(
    (set, get) => ({
      token: "",
      login: async (payload: ILogin) => {
        try {
          const loginResponse = await axios.post(AUTH_LOGIN_URL, payload);
          if (loginResponse.status === 200) {
            set({ token: loginResponse.data.token });
            // navigate to correct home page
          } else {
            // Handle error cases
          }
        } catch (error) {
          // Handle network errors or other unexpected errors
          console.error("Login error:", error);
        }
      },
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
