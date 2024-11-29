import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse } from "axios";

import {
  AUTH_USER_LOGIN_URL,
  AUTH_INSTRUCTOR_LOGIN_URL,
  AUTH_INSTRUCTOR_SIGNUP_URL,
  AUTH_USER_SIGNUP_URL,
} from "@/constants/routes";

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
    membership: string // include membership
  ) => Promise<void>;
  signupInstructor: (
    username: string,
    email: string,
    password: string,
    gender: string,
    phone_number: string,
    company: string,
    position: string
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<string>;
  loginInstructor: (email: string, password: string) => Promise<string>;
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
      signup: async (name, email, password, gender, membership) => {
        console.log("Signing up...");
        console.log(name, email, password, gender, membership);
        const response = await axios.post(
          AUTH_USER_SIGNUP_URL,
          { name, password, email, gender, membership }, // adapted to backend's API structure
          { headers: { "Content-Type": "application/json" } }
        );

        const responseData = response.data;
        if (response.status === 200) {
          console.log(responseData.message);
        } else {
          console.error("Axios error: ");
          throw new Error(
            response?.data?.message || "An unexpected error occurred"
          );
        }
      },
      signupInstructor: async (
        name,
        email,
        password,
        gender,
        phone_number,
        company,
        position
      ) => {
        console.log("Signing up instructor...");
        const response = await axios.post(
          AUTH_INSTRUCTOR_SIGNUP_URL,
          {
            name,
            password,
            email,
            gender,
            phone_number,
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
      login: async (email, password) => {
        console.log("Logging in...");
        const response = await axios.post(
          AUTH_USER_LOGIN_URL,
          { email, password },
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
      loginInstructor: async (email, password) => {
        console.log("Logging in...");
        const response = await axios.post(
          AUTH_INSTRUCTOR_LOGIN_URL,
          { email, password },
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
