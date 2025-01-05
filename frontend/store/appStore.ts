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
import Review from "@/types/shared/Course/Review";

export interface AppState {
    channels: Channel[]; // List of Channels that user has access to
    channel_id: number; // ID of user's current channel
    favourite_courses?: Course[]; // List of user's favourite courses
    enrolled_courses?: Course[]; // List of user's enrolled courses
    recommended_courses: Course[]; // List of user's recommended courses
    top_enrolled_courses: Course[];
    review?: Review; // Not sure if review or reviews should be stored
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
    addFavouriteCourse: (course_id: number) => Promise<void>;
    enrollCourse: (course_id: number) => Promise<void>;
    getEnrolledCourses: (page?: string, per_page?: string) => Promise<void>;
    getFavouriteCourses: (page?: string, per_page?: string) => Promise<void>;
    getRecommendedCourses: (page?: string, per_page?: string) => Promise<void>;
    getReview: (course_id: number) => Promise<void>;
    getTopEnrolledCourses: () => Promise<void>;
    removeFavouriteCourse: (course_id: number) => Promise<void>;
    saveReview: (
        course_id: number,
        rating: number,
        review_text: string
    ) => Promise<void>;
    withdrawCourse: (course_id: number) => Promise<void>;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            channels: [],
            channel_id: 0,
            recommended_courses: [],
            top_enrolled_courses: [],
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
            searchCourse: async (channel_id, search_term, page?, per_page?) => {
                try {
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
            addFavouriteCourse: async (course_id) => {
                console.log("(Store) Add Favourite Course: " + course_id);
                try {
                    const response = await axios.post(
                        COURSE_USER_ADD_FAVOURITE_COURSE_URL,
                        { course_id },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    // Tentatively returns nothing for successful API request
                    // Response is {"message": "Course successfully added to favourites"}
                } catch (error: any) {
                    console.error(error);
                }
            },
            enrollCourse: async (course_id) => {
                console.log("(Store) Enroll Course: " + course_id);
                try {
                    const response = await axios.post(
                        COURSE_USER_ENROLL_COURSE_URL,
                        { course_id },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    // Tentatively returns nothing for successful API request
                    // Response is {"message": "User successfully enrolled"}
                } catch (error: any) {
                    console.error(error);
                }
            },
            getEnrolledCourses: async (page?, per_page?) => {
                console.log("(Store) Get Enrolled Courses");
                try {
                    const response = await axios.get(
                        `${COURSE_USER_GET_ENROLLED_COURSES_URL}/${get().channel_id.toString()}`,
                        {
                            params: { page, per_page },
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    const responseData = response.data;
                    // MAP API response to FE Course type
                    const mappedCourses = responseData.courses.map(
                        (course: any) => ({
                            course_id: course.id,
                            community_id: undefined,
                            course_image: course.course_image,
                            course_name: course.course_name,
                            community_name: course.community_name,
                            description: undefined,
                            instructors: undefined,
                            chapters: undefined,
                            rating: course.rating,
                            enrollment_count: undefined,
                        })
                    );
                    set({
                        enrolled_courses: mappedCourses,
                    });
                    // Tentatively returns nothing for successful API request
                } catch (error: any) {
                    console.error(error);
                }
            },
            getFavouriteCourses: async (page?, per_page?) => {
                console.log("(Store) Get Favourite Courses");
                try {
                    const response = await axios.get(
                        `${COURSE_USER_GET_FAVOURITE_COURSES_URL}/${get().channel_id.toString()}`,
                        {
                            params: { page, per_page },
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    const responseData = response.data;
                    // MAP API response to FE Course type
                    const mappedCourses = responseData.courses.map(
                        (course: any) => ({
                            course_id: course.id,
                            community_id: undefined,
                            course_image: course.course_image,
                            course_name: course.course_name,
                            community_name: course.community_name,
                            description: undefined,
                            instructors: undefined,
                            chapters: undefined,
                            rating: course.rating,
                            enrollment_count: course.enrollments,
                        })
                    );
                    set({
                        favourite_courses: mappedCourses,
                    });
                    // Tentatively returns nothing for successful API request
                } catch (error: any) {
                    console.error(error);
                }
            },
            getRecommendedCourses: async (page, per_page) => {
                console.log("(Store) Get Recommended Courses");
                try {
                    const response = await axios.get(
                        `${COURSE_USER_GET_RECOMMENDED_COURSES_URL}/${get().channel_id.toString()}`,
                        {
                            params: { page, per_page },
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    const responseData = response.data;
                    // MAP API response to FE Course type
                    const mappedCourses = responseData.courses.map(
                        (course: any) => ({
                            course_id: course.id,
                            community_id: undefined,
                            course_image: course.course_image,
                            course_name: course.course_name,
                            community_name: course.community_name,
                            description: undefined,
                            instructors: undefined,
                            chapters: undefined,
                            rating: course.rating,
                            enrollment_count: undefined,
                        })
                    );
                    set({
                        recommended_courses: mappedCourses,
                    });
                    // Tentatively returns nothing for successful API request
                } catch (error: any) {
                    console.error(error);
                }
            },
            getReview: async (course_id) => {
                console.log("(Store) Get Review for course: " + course_id);
                try {
                    const response = await axios.get(
                        `${COURSE_USER_GET_REVIEW_URL}/${course_id.toString()}`,
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    const responseData = response.data;
                    const reviewData: Review = {
                        course_id: course_id,
                        rating: responseData.rating,
                        review_text: responseData.review_text,
                    };
                    // Assuming only 1 review is stored at a time in store
                    set({
                        review: reviewData,
                    });
                    // Tentatively returns nothing for successful API request
                } catch (error: any) {
                    console.error(error);
                }
            },
            getTopEnrolledCourses: async () => {
                console.log("(Store) Get Top Enrolled Courses");
                try {
                    const response = await axios.get(
                        `${COURSE_USER_GET_TOP_ENROLLED_COURSES_URL}/${get().channel_id.toString()}`,
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    const responseData = response.data;
                    // MAP API response to FE Course type
                    const mappedCourses = responseData.courses.map(
                        (course: any) => ({
                            course_id: course.id,
                            community_id: undefined,
                            course_image: course.course_image,
                            course_name: course.course_name,
                            community_name: course.community_name,
                            description: undefined,
                            instructors: undefined,
                            chapters: undefined,
                            rating: course.rating,
                            enrollment_count: undefined,
                        })
                    );
                    set({
                        top_enrolled_courses: mappedCourses,
                    });
                    // Tentatively returns nothing for successful API request
                } catch (error: any) {
                    console.error(error);
                }
            },
            removeFavouriteCourse: async (course_id) => {
                console.log("(Store) Remove Favourite Course");
                try {
                    const response = await axios.post(
                        `${COURSE_USER_REMOVE_FAVOURITE_COURSE_URL}`,
                        { course_id },
                        { headers: { "Content-Type": "application/json" } }
                    );
                    const responseData = response.data;
                    if (response.status === 200) {
                        get().getFavouriteCourses();
                    }
                    // Tentatively returns nothing for successful API request
                } catch (error: any) {
                    console.error(error);
                }
            },
            saveReview: async (course_id, rating, review_text) => {
                console.log("(Store) Save Review for course: " + course_id);
                try {
                    const response = await axios.post(
                        `${COURSE_USER_SAVE_REVIEW_URL}`,
                        {
                            params: { course_id, rating, review_text },
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    const review: Review = {
                        course_id: course_id,
                        rating: rating,
                        review_text: review_text,
                    };
                    if (response.status === 200) {
                        // Set saved review into store
                        set({
                            review: review,
                        });
                    }
                    // Tentatively returns nothing for successful API request
                } catch (error: any) {
                    console.error(error);
                }
            },
            withdrawCourse: async (course_id) => {
                console.log("(Store) Withdraw from course: " + course_id);
                try {
                    const response = await axios.post(
                        `${COURSE_USER_WITHDRAW_COURSE_URL}`,
                        {
                            params: { course_id },
                            headers: { "Content-Type": "application/json" },
                        }
                    );
                    if (response.status === 200) {
                        // Call all course APIs to ensure withdrawn course is not inside store??
                        get().getEnrolledCourses();
                        get().getFavouriteCourses();
                        get().getEnrolledCourses();
                    }
                    // Tentatively returns nothing for successful API request
                } catch (error: any) {
                    console.error(error);
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
