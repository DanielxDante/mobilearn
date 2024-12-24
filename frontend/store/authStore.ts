import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosResponse, AxiosError } from "axios";

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
  //name?: string;
  gender: string;
  //role: "guest" | "member" | "instructor" | "admin";
  profile_picture_url?: string;
  membership?: string;
  message?: string;
  phone_number?: string;
  company?: string;
  position?: string;
  status?: string;
  access_token?: string;
  refresh_token?: string;
  signupMember: (
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
  loginMember: (email: string, password: string) => Promise<string>;
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

      signupMember: async (name, email, password, gender, membership) => {
        console.log("Signing up...");
        console.log(name, email, password, gender, membership);
        try {
          const response = await axios.post(
            AUTH_USER_SIGNUP_URL,
            { name, password, email, gender, membership }, // adapted to backend's API structure
            { headers: { "Content-Type": "application/json" } }
          );
          console.log("response is: " + JSON.stringify(response.data, null, 2));
          const responseData = response.data;
          if (response.status === 200) {
            console.log(responseData.message);
          } else {
            console.error("Axios error: ");
            throw new Error(
              response?.data?.message || "An unexpected error occurred"
            );
          }
        } catch (error) {
          const axiosError = error as AxiosError;
          if (axiosError.response) {
            console.log("Error Response:", axiosError.response.data);
          } else if (axiosError.request) {
            console.log(
              "No Response Received. Request was:",
              axiosError.request
            );
          } else {
            console.log("Error Message:", axiosError.message);
          }
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
      loginMember: async (email, password) => {
        console.log("Logging in...");
        try {
          // Send the login request
          const response = await axios.post(
            AUTH_USER_LOGIN_URL,
            { email, password },
            { headers: { "Content-Type": "application/json" } }
          );

          const responseData = response.data;

          // Handle success (status 200)
          if (response.status === 200) {
            set({
              message: responseData.message,
              username: responseData.name,
              gender: responseData.gender,
              profile_picture_url: responseData.profile_picture_url,
              membership: responseData.membership,
              token: responseData.token,
            });
            return responseData.membership;
          }
        } catch (error: unknown) {
          // Handle specific 400 status
          if (error instanceof AxiosError) {
            if (error.response && error.response.status === 400) {
              return error.response.data.message; // Return the message for further handling
            }
          }

          // Log and rethrow other errors for unexpected issues
          console.error("Unexpected error during login:", error);
          throw new Error("An unexpected error occurred while logging in.");
        }
      },
      loginInstructor: async (email, password) => {
        console.log("Logging in...");
        try {
          // Send the login request
          const response = await axios.post(
            AUTH_INSTRUCTOR_LOGIN_URL,
            { email, password },
            { headers: { "Content-Type": "application/json" } }
          );

          const responseData = response.data;

          // Handle success (status 200)
          if (response.status === 200) {
            set({
              message: responseData.message,
              username: responseData.name,
              gender: responseData.gender,
              profile_picture_url: responseData.profile_picture_url,
              phone_number: responseData.phone_number,
              company: responseData.company,
              position: responseData.position,
              status: responseData.status,
              access_token: responseData.access_token,
              refresh_token: responseData.refresh_token,
            });
            if (responseData.status) {
              return responseData.status;
            } else {
              return responseData.message;
            }
          }
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            if (error.response && error.response.status === 400) {
              return error.response.data.message; // Return the message for further handling
            }
          }
          // Log and rethrow other errors for unexpected issues
          console.error("Unexpected error during login:", error);
          throw new Error("An unexpected error occurred while logging in.");
        }
      },
      logout: async () => {
        console.log("Logging out...");
        set({
          username: "",
          email: "",
          token: "",
          membership: "guest",
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
