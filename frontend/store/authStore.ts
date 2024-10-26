import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";

import { AUTH_LOGIN_URL, AUTH_SIGNUP_URL } from "@/constants/routes";

export interface AuthState {
  username: string;
  email: string;
  token: string;
  gender: string;
  role: "guest" | "member" | "instructor" | "admin";
  company?: string;
  position?: string;
  signup: (
    username: string,
    email: string,
    password: string,
    gender: string,
    //role: "member" | "instructor"
    role: "member"
  ) => Promise<void>;
  signupInstructor: (
    username: string,
    email: string,
    password: string,
    gender: string,
    role: "instructor",
    company: string,
    position: string
  ) => Promise<void>;
  login: (email: string, password: string, role: "member") => Promise<string>;
  loginInstructor: (
    email: string,
    password: string,
    role: "instructor"
  ) => Promise<string>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      username: "",
      email: "",
      token: "",
      gender: "",
      role: "guest",
      company: undefined,
      position: undefined,
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
      signupInstructor: async (
        username,
        email,
        password,
        role,
        gender,
        company,
        position
      ) => {
        console.log("Signing up instructor...");
        const response = await axios.post(
          AUTH_SIGNUP_URL,
          {
            username,
            email,
            password,
            role,
            gender,
            company,
            position,
          },
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
            gender: responseData.gender,
          });
          return responseData.role;
        } else {
          throw new Error("An unexpected error occurred");
        }
      },
      loginInstructor: async (email, password, role) => {
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
            gender: responseData.gender,
          });
          return responseData.role;
        } else {
          throw new Error("An unexpected error occurred");
        }
      },
      logout: async () => {
        console.log("Logging out...");
        set({
          username: "",
          email: "",
          token: "",
          role: "guest",
          gender: "",
        });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
