import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";

import { AUTH_LOGIN_URL, AUTH_SIGNUP_URL } from "@/constants/routes";

export interface AuthState {
  username: string;
  email: string;
  token: string;
  role: "guest" | "member" | "instructor" | "admin";
  gender: "male" | "female";
  signup: (
    username: string,
    email: string,
    password: string,
    role: "member" | "instructor",
    gender: "male" | "female"
  ) => Promise<void>;
  login: (
    email: string,
    password: string,
    role: "member" | "instructor"
  ) => Promise<string>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: "",
      email: "",
      token: "",
      role: "guest",
      gender: "male",
      signup: async (username, email, password, role, gender) => {
        console.log("Signing up...");
        const response = await axios.post(
          AUTH_SIGNUP_URL,
          { username, email, password, role, gender },
          { headers: { "Content-Type": "application/json" } }
        );

        const responseData = response.data;
        if (response.status === 200) {
          console.log(responseData.message);
        } else {
          throw new Error("An unexpected error occurred");
        }
      },
      login: async (email, password, role) => {
        console.log("Logging in...");
        const response = await axios.post(
          AUTH_LOGIN_URL,
          { email, password, role },
          { headers: { "Content-Type": "application/json" } }
        );

        const responseData = response.data;
        if (response.status === 200) {
          set({
            username: responseData.username,
            email: email,
            token: responseData.token,
            role: responseData.role,
          });
          return responseData.role;
        } else {
          throw new Error("An unexpected error occurred");
        }
      },
      logout: async () => {
        console.log("Logging out...");
        set({ username: "", email: "", token: "", role: "guest" });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
