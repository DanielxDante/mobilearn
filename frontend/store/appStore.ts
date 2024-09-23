import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from "axios";

import { ILogin } from "@/types/shared/appState";
import { AUTH_LOGIN_URL } from "@/constants/Routes";

export type AppState = {
  token: string;
  login: (payload: ILogin) => Promise<void>;
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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
