import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

import {
    AUTH_USER_LOGIN_URL,
    AUTH_INSTRUCTOR_LOGIN_URL,
    AUTH_INSTRUCTOR_SIGNUP_URL,
    AUTH_USER_SIGNUP_URL,
    AUTH_REFRESH_TOKEN_URL,
    AUTH_LOGOUT_URL,
    ACCOUNT_INSTRUCTOR_EDIT_GENDER_URL,
    ACCOUNT_INSTRUCTOR_EDIT_NAME_URL,
    ACCOUNT_INSTRUCTOR_EDIT_PHONENUMBER_URL,
    ACCOUNT_INSTRUCTOR_EDIT_POSITION_URL,
    ACCOUNT_INSTRUCTOR_EDIT_PROFILEPICTURE_URL,
    ACCOUNT_INSTRUCTOR_GET_GENDER_URL,
    ACCOUNT_INSTRUCTOR_GET_NAME_URL,
    ACCOUNT_INSTRUCTOR_GET_PHONENUMBER_URL,
    ACCOUNT_INSTRUCTOR_GET_POSITION_URL,
    ACCOUNT_INSTRUCTOR_GET_PROFILEPICTURE_URL,
    ACCOUNT_INSTRUCTOR_EDIT_COMPANY_URL,
    ACCOUNT_INSTRUCTOR_EDIT_EMAIL_URL,
    ACCOUNT_INSTRUCTOR_EDIT_PASSWORD_URL,
    ACCOUNT_USER_EDIT_GENDER_URL,
    ACCOUNT_USER_EDIT_NAME_URL,
    ACCOUNT_USER_EDIT_PROFILEPICTURE_URL,
    ACCOUNT_USER_GET_GENDER_URL,
    ACCOUNT_USER_GET_NAME_URL,
    ACCOUNT_USER_GET_PROFILEPICTURE_URL,
    ACCOUNT_USER_EDIT_EMAIL_URL,
    ACCOUNT_USER_EDIT_PASSWORD_URL,
} from "@/constants/routes";

export interface AuthState {
    username: string;
    email: string;
    gender: string;
    profile_picture_url?: string;
    membership?: string;
    message?: string;
    phone_number?: string;
    company?: string;
    position?: string;
    status: string;
    access_token?: string;
    refresh_token?: string;
    signupUser: (
        username: string,
        email: string,
        password: string,
        gender: string,
        membership: string
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
    loginUser: (email: string, password: string) => Promise<string>;
    loginInstructor: (email: string, password: string) => Promise<string>;
    refreshAccessToken: () => Promise<string>;
    setupAxiosInterceptors: () => void;
    logout: () => Promise<void>;
    // Account operations
    editGenderInstructor: (new_gender: string) => Promise<void>;
    // editNameInstructor: (new_name: string) => Promise<string>;
    // editPhoneNumberInstructor: (new_phone_number: string) => Promise<string>;
    // editPositionInstructor: (new_position: string) => Promise<string>;
    // editProfilePictureInstructor: (file: File) => Promise<string>;
    // getGenderInstructor: () => Promise<string>;
    // getNameInstructor: () => Promise<string>;
    // getPhoneNumberInstructor: () => Promise<string>;
    // getPositionInstructor: () => Promise<string>;
    // getProfilePictureInstructor: () => Promise<string>;
    // editCompanyInstructor: (new_company: string) => Promise<string>;
    // editEmailInstructor: (
    //     new_email: string,
    //     refresh_token: string
    // ) => Promise<string>;
    // editPasswordInstructor: (
    //     old_password: string,
    //     new_password: string
    // ) => Promise<string>;
    editGenderUser: (new_gender: string) => Promise<void>;
    editNameUser: (new_name: string) => Promise<string>;
    editProfilePictureUser: (file: File) => Promise<string>;
    getGenderUser: () => Promise<string>;
    getNameUser: () => Promise<string>;
    getProfilePictureUser: () => Promise<string>;
    editEmailUser: (new_email: string) => Promise<void>;
    editPasswordUser: (
        old_password: string,
        new_password: string
    ) => Promise<void>;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            username: "",
            email: "",
            gender: "",
            profile_picture_url: "",
            membership: "",
            phone_number: "",
            company: "",
            position: undefined,
            status: "",
            signupUser: async (name, email, password, gender, membership) => {
                console.log("Signing up...");
                console.log(name, email, password, gender, membership);
                try {
                    const response = await axios.post(
                        AUTH_USER_SIGNUP_URL,
                        { name, password, email, gender, membership },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    console.log(
                        "response is: " + JSON.stringify(response.data, null, 2)
                    );
                    const responseData = response.data;
                    if (response.status === 200) {
                        console.log(responseData.message);
                    } else {
                        console.error("Axios error: ");
                        throw new Error(
                            response?.data?.message ||
                                "An unexpected error occurred"
                        );
                    }
                } catch (error) {
                    const axiosError = error as AxiosError;
                    if (axiosError.response) {
                        console.log(
                            "Error Response:",
                            axiosError.response.data
                        );
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
            loginUser: async (email, password) => {
                console.log("Logging in...");
                try {
                    const response = await axios.post(
                        AUTH_USER_LOGIN_URL,
                        { email, password },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    const responseData = response.data;
                    if (response.status === 200) {
                        set({
                            //message: responseData.message,
                            username: responseData.name,
                            gender: responseData.gender,
                            profile_picture_url:
                                responseData.profile_picture_url,
                            membership: responseData.membership,
                            status: responseData.status,
                            access_token: responseData.access_token,
                            refresh_token: responseData.refresh_token,
                            email: email,
                        });

                        get().setupAxiosInterceptors();

                        return responseData.membership;
                    } else {
                        return responseData.message;
                    }
                } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                        if (error.response && error.response.status === 400) {
                            return error.response.data.message;
                        }
                    }

                    console.error("Unexpected error during login:", error);
                    throw new Error(
                        "An unexpected error occurred while logging in."
                    );
                }
            },
            loginInstructor: async (email, password) => {
                console.log("Logging in...");
                try {
                    const response = await axios.post(
                        AUTH_INSTRUCTOR_LOGIN_URL,
                        { email, password },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    const responseData = response.data;

                    if (response.status === 200) {
                        set({
                            message: responseData.message,
                            username: responseData.name,
                            gender: responseData.gender,
                            profile_picture_url:
                                responseData.profile_picture_url,
                            phone_number: responseData.phone_number,
                            company: responseData.company,
                            position: responseData.position,
                            status: responseData.status,
                            access_token: responseData.access_token,
                            refresh_token: responseData.refresh_token,
                        });

                        get().setupAxiosInterceptors();
                        if (responseData.status) {
                            return responseData.status;
                        } else {
                            return responseData.message;
                        }
                    }
                } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                        if (error.response && error.response.status === 400) {
                            return error.response.data.message;
                        }
                    }
                    console.error("Unexpected error during login:", error);
                    throw new Error(
                        "An unexpected error occurred while logging in."
                    );
                }
            },
            refreshAccessToken: async () => {
                console.log("Refreshing access token...");
                try {
                    const response = await axios.post(AUTH_REFRESH_TOKEN_URL, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: get().refresh_token,
                        },
                    });

                    const responseData = response.data;

                    if (response.status === 200) {
                        set({
                            access_token: responseData.access_token,
                        });

                        return responseData.access_token;
                    } else {
                        throw new Error("An unexpected error occurred");
                    }
                } catch (error) {
                    console.error("Error refreshing access token:", error);
                    get().logout();
                    throw new Error(
                        "An unexpected error occurred while refreshing the access token."
                    );
                }
            },
            setupAxiosInterceptors: () => {
                axios.interceptors.request.use(async (config) => {
                    if (config.url === AUTH_REFRESH_TOKEN_URL) {
                        config.headers.Authorization = get().refresh_token;
                        return config;
                    }

                    const access_token = get().access_token;
                    if (!access_token) return config;

                    const decoded_access_token = jwtDecode(access_token);
                    const current_time = Date.now() / 1000;

                    if (
                        decoded_access_token.exp &&
                        decoded_access_token.exp - current_time < 30
                    ) {
                        const new_access_token =
                            await get().refreshAccessToken();
                        config.headers.Authorization = new_access_token;
                    } else {
                        config.headers.Authorization = access_token;
                    }

                    return config;
                });

                axios.interceptors.response.use(
                    (response) => {
                        return response;
                    },
                    async (error) => {
                        const originalRequest = error.config;
                        if (
                            error.response?.status === 401 &&
                            !originalRequest._retry
                        ) {
                            originalRequest._retry = true;
                            try {
                                await get().refreshAccessToken();
                                return axios(originalRequest);
                            } catch (error) {
                                console.error(
                                    "Error refreshing access token:",
                                    error
                                );
                                get().logout();
                                throw new Error(
                                    "An unexpected error occurred while refreshing the access token."
                                );
                            }
                        }
                        throw error;
                    }
                );
            },
            logout: async () => {
                console.log("Logging out...");

                try {
                    const response = await axios.delete(AUTH_LOGOUT_URL, {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${get().access_token}`,
                        },
                        data: {
                            refresh_token: get().refresh_token,
                        },
                    });

                    if (response.status === 200) {
                        set({
                            username: "",
                            email: "",
                            gender: "",
                            profile_picture_url: "",
                            membership: "",
                            phone_number: "",
                            company: "",
                            position: "",
                            status: "",
                            access_token: "",
                            refresh_token: "",
                        });
                    } else {
                        throw new Error("An unexpected error occurred");
                    }
                } catch (error) {
                    console.error("Error logging out:", error);
                    throw new Error(
                        "An unexpected error occurred while logging out."
                    );
                }
            },
            editGenderInstructor: async (new_gender) => {
                console.log("(Store) Edit Instructor gender");
                const response = await axios.post(
                    ACCOUNT_INSTRUCTOR_EDIT_GENDER_URL,
                    { new_gender },
                    { headers: { "Content-Type": "application/json" } }
                );
                const responseData = response.data;
                if (response.status === 200) {
                    console.log(responseData.message);
                    set({
                        gender: responseData.gender,
                    });
                }
            },
            editGenderUser: async (new_gender) => {
                console.log("(Store) Edit User gender");
                const response = await axios.post(
                    ACCOUNT_USER_EDIT_GENDER_URL,
                    { new_gender },
                    { headers: { "Content-Type": "application/json" } }
                );
                const responseData = response.data;
                if (response.status === 200) {
                    console.log(responseData.message);
                    set({
                        gender: responseData.gender,
                    });
                }
            },
            editNameUser: async (new_name) => {
                console.log("(Store) Edit User name: " + new_name);
                const response = await axios.post(
                    ACCOUNT_USER_EDIT_NAME_URL,
                    { new_name },
                    { headers: { "Content-Type": "application/json" } }
                );
                const responseData = response.data;
                if (response.status === 200) {
                    console.log(responseData.message);
                    set({
                        username: new_name,
                    });
                    return "Name has been changed";
                } else {
                    return response.data;
                }
            },
            editProfilePictureUser: async (file) => {
                console.log("(Store) Edit User profile picture");
                const response = await axios.post(
                    ACCOUNT_USER_EDIT_PROFILEPICTURE_URL,
                    { file },
                    { headers: { "Content-Type": "application/json" } }
                );
                const responseData = response.data;
                if (response.status === 200) {
                    set({
                        profile_picture_url: responseData.profile_picture_url,
                    });
                    return responseData.profile_picture_url;
                }
            },
            getGenderUser: async () => {
                console.log("(Store) Get User gender");
                const response = await axios.get(ACCOUNT_USER_GET_GENDER_URL, {
                    headers: { "Content-Type": "application/json" },
                });
                const responseData = response.data;
                if (response.status === 200) {
                    set({
                        gender: responseData.gender,
                    });
                    return responseData.gender;
                }
            },
            getNameUser: async () => {
                console.log("(Store) Get User name");
                const response = await axios.get(ACCOUNT_USER_GET_NAME_URL, {
                    headers: { "Content-Type": "application/json" },
                });
                const responseData = response.data;
                if (response.status === 200) {
                    set({
                        username: responseData.name,
                    });
                    return responseData.name;
                }
            },
            getProfilePictureUser: async () => {
                console.log("(Store) Get User profile picture");
                const response = await axios.get(
                    ACCOUNT_USER_GET_PROFILEPICTURE_URL,
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );
                const responseData = response.data;
                if (response.status === 200) {
                    set({
                        profile_picture_url: responseData.profile_picture_url,
                    });
                    return responseData.profile_picture_url;
                }
            },
            editEmailUser: async (new_email) => {
                console.log("(Store) Edit User email");
                const response = await axios.post(
                    ACCOUNT_USER_EDIT_EMAIL_URL,
                    { new_email, refresh_token: get().refresh_token },
                    { headers: { "Content-Type": "application/json" } }
                );
                const responseData = response.data;
                if (response.status === 200) {
                    set({
                        access_token: responseData.access_token,
                        refresh_token: responseData.refresh_token,
                        email: new_email,
                    });
                }
            },
            editPasswordUser: async (old_password, new_password) => {
                console.log("(Store) Edit User password");
                const response = await axios.post(
                    ACCOUNT_USER_EDIT_PASSWORD_URL,
                    { old_password: old_password, new_password: new_password },
                    { headers: { "Content-Type": "application/json" } }
                );
                const responseData = response.data;
                if (response.status === 200) {
                    console.log(responseData.message);
                }
            },
        }),
        {
            name: "auth-store",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAuthStore;
