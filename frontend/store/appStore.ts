import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

import {
    PAYMENT_STRIPE_FETCH_PAYMENT_SHEET_URL,
    CHANNEL_USER_GET_CHANNELS_URL,
    CHANNEL_USER_INVITE_URL,
    COURSE_SEARCH_URL,
    COURSE_USER_ADD_FAVOURITE_COURSE_URL,
    COURSE_USER_ENROLL_COURSE_URL,
    COURSE_USER_GET_FAVOURITE_COURSES_URL,
    COURSE_USER_GET_ENROLLED_COURSES_URL,
    COURSE_USER_GET_RECOMMENDED_COURSES_URL,
    COURSE_USER_GET_REVIEW_URL,
    COURSE_USER_GET_TOP_ENROLLED_COURSES_URL,
    COURSE_USER_REMOVE_FAVOURITE_COURSE_URL,
    COURSE_USER_SAVE_REVIEW_URL,
    COURSE_USER_WITHDRAW_COURSE_URL,
} from "@/constants/routes";
import Channel from "@/types/shared/Channel";
import Course from "@/types/shared/Course/Course";

export interface AppState {
    channels: Channel[];
    channel_id?: number;
    fetchPaymentSheet: (
        amount: string,
        currency: string
    ) => Promise<{
        payment_intent: string;
        ephemeral_key: string;
        customer_id: string;
    }>;
    logout: () => void;
    getUserChannels: () => Promise<void>;
    inviteUser: (inviteCode: string) => Promise<any>;
    setChannelId: (channel_id: number) => Promise<void>;
    searchCourse: (
        channel_id: number,
        search_term?: string,
        page?: string,
        per_page?: string
    ) => Promise<any[]>;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            channels: [],
            fetchPaymentSheet: async (amount, currency) => {
                console.log("Fetching donation payment sheet...");
                try {
                    const response = await axios.post(
                        PAYMENT_STRIPE_FETCH_PAYMENT_SHEET_URL,
                        { amount, currency },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    const responseData = response.data;

                    return {
                        payment_intent: responseData.payment_intent,
                        ephemeral_key: responseData.ephemeral_key,
                        customer_id: responseData.customer_id,
                    };
                } catch (error) {
                    console.log(
                        "Unexpected error has occurred. Error: ",
                        error
                    );
                    throw new Error("Unexpected error has occurred.");
                }
            },
            logout: async () => {
                console.log("Logging out appStore");
                try {
                    set({
                        channels: [],
                        channel_id: undefined,
                    });
                } catch (error) {
                    console.error("Error logging out of AppStore:", error);
                    throw new Error(
                        "An unexpected error occurred while logging out."
                    );
                }
            },
            getUserChannels: async () => {
                console.log("Retrieving User channels");
                try {
                    const response = await axios.get(
                        CHANNEL_USER_GET_CHANNELS_URL,
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    const responseData = response.data;
                    // console.log(JSON.stringify(responseData));
                    if (response.status === 200) {
                        set({
                            channels: responseData.channels,
                        });
                    }
                } catch (error: any) {
                    console.error(error);
                }
            },
            inviteUser: async (inviteCode) => {
                try {
                    const response = await axios.post(
                        CHANNEL_USER_INVITE_URL,
                        { invite_code: inviteCode },
                        { headers: { "Content-Type": "application/json" } }
                    );

                    const responseData = response.data;
                    if (response.status === 200) {
                        set({
                            channel_id: responseData.channel_id,
                        });
                        get().getUserChannels;
                        return responseData.channel_id;
                    }
                } catch (error: any) {
                    if (error.status === 400) {
                        return "Channel already joined";
                    } else {
                        return false;
                    }
                }
            },
            setChannelId: async (channel_id) => {
                console.log("(Store) setChannelId: " + channel_id);
                set({ channel_id: channel_id });
            },
            searchCourse: async (
                channel_id: number,
                search_term?: string,
                page?: string,
                per_page?: string
            ) => {
                try {
                    const requestData: any = { search_term };
                    if (page) {
                        requestData.page = page;
                    }
                    if (per_page) {
                        requestData.per_page = per_page;
                    }
                    const response = await axios.get(
                        `${COURSE_SEARCH_URL}/${channel_id.toString()}`,
                        {
                            params: { search_term, page, per_page },
                            headers: { "Content-Type": "application/json" },
                        }
                    );

                    const responseData = response.data;
                    if (response.status === 200) {
                        return responseData.courses;
                    }
                } catch (error: any) {
                    console.error(error.message);
                }
            },
        }),
        {
            name: "app-store",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useAppStore;
