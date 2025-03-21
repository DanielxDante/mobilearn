import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import io, { Socket } from "socket.io-client";

import {
  PAYMENT_STRIPE_FETCH_PAYMENT_SHEET_URL,
  CHANNEL_USER_GET_CHANNELS_URL,
  CHANNEL_USER_INVITE_URL,
  COURSE_GET_ENROLLED_COURSE,
  COURSE_GET_UNENROLLED_COURSE,
  COURSE_GET_TOP_COURSES_INSTRUCTOR,
  COURSE_SEARCH_URL,
  COURSE_USER_ADD_FAVOURITE_COURSE_URL,
  COURSE_USER_COMPLETE_LESSON_URL,
  COURSE_USER_ENROLL_COURSE_URL,
  COURSE_USER_GET_FAVOURITE_COURSES_URL,
  COURSE_USER_GET_ENROLLED_COURSES_URL,
  COURSE_USER_GET_RECOMMENDED_COURSES_URL,
  COURSE_USER_GET_REVIEW_URL,
  COURSE_USER_GET_TOP_ENROLLED_COURSES_URL,
  COURSE_USER_REMOVE_FAVOURITE_COURSE_URL,
  COURSE_USER_SAVE_REVIEW_URL,
  COURSE_USER_SUBMIT_HOMEWORK_URL,
  COURSE_USER_WITHDRAW_COURSE_URL,
  COURSE_GET_ALL_INSTRUCTOR_COURSES,
  COURSE_CREATE_COURSE,
  COURSE_INSTRUCTOR_GET_PREVIEW_LESSON,
  COURSE_INSTRUCTOR_GET_COURSE_DETAILS,
  COURSE_INSTRUCTOR_EDIT_COURSE,
  COURSE_INSTRUCTOR_COURSE_REVIEW,
  COMMUNITY_GET_COMMUNITIES_URL,
  COMMUNITY_GET_INSTRUCTOR_DETAILS_URL,
  COMMUNITY_GET_INSTRUCTORS_URL,
  ACCOUNT_USER_GET_NOTIFICATIONS_URL,
  ACCOUNT_INSTRUCTOR_GET_NOTIFICATIONS_URL,
  CHAT_ADD_GROUP_CHAT_PARTICIPANTS_URL,
  CHAT_CREATE_GROUP_CHAT_URL,
  CHAT_CREATE_PRIVATE_CHAT_URL,
  CHAT_EDIT_GROUP_CHAT_NAME_URL,
  CHAT_EDIT_GROUP_CHAT_PICTURE_URL,
  CHAT_ELEVATE_PARTICIPANT_TO_ADMIN_URL,
  CHAT_GET_CHAT_DETAILS_URL,
  CHAT_GET_CHAT_MESSAGES_URL,
  CHAT_GET_PARTICIPANT_CHATS_URL,
  CHAT_REMOVE_GROUP_CHAT_PARTICIPANTS_URL,
  CHAT_SEARCH_PARTICIPANTS_URL,
  ANALYTICS_LESSONS,
  ANALYTICS_ENROLLMENTS,
  ANALYTICS_PROGRESS,
  ANALYTICS_REVIEWS,
  BACKEND_BASE_URL,
} from "@/constants/routes";
import Channel from "@/types/shared/Channel";
import Course from "@/types/shared/Course/Course";
import Review from "@/types/shared/Course/Review";
import Lesson from "@/types/shared/Course/Lesson";
import Instructor from "@/types/shared/Course/Instructor";
import { router } from "expo-router";
import notification from "@/types/shared/notification";
import { INSTRUCTOR_COURSE_DETAILS } from "@/constants/pages";
import Statistics from "@/types/shared/Statistics";
import Message from "@/types/shared/Message";

const socketSlice = (set: any, get: any) => ({
  isConnected: false,
  chat_socket: null as Socket | null,

  createSocket: () => {
    const socketInstance = io(BACKEND_BASE_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      // Enable if you need to bypass SSL verification (development only)
      // rejectUnauthorized: false
    });
    set({ chat_socket: socketInstance });

    socketInstance.on("connect", () => {
      console.log("(Store) Socket is connected");
      set({ isConnected: true });
    });

    socketInstance.on("disconnect", () => {
      get().disconnectSocket();
    });
  },
  getSocket: () => {
    console.log("(Store) Get Socket()");
    return get().chat_socket;
  },
  disconnectSocket: () => {
    const socketInstance = get().chat_socket;
    if (socketInstance) {
      socketInstance.emit("leave_chat");
      socketInstance.disconnect();
      set({ isConnected: false, socketInstance: null });
    }
  },
});

export interface AppState {
  channels: Channel[]; // List of Channels that user has access to
  channel_id: number; // ID of user's current channel
  favourite_courses?: Course[]; // List of user's favourite courses
  enrolled_courses?: Course[]; // List of user's enrolled courses
  recommended_courses: Course[]; // List of user's recommended courses
  top_enrolled_courses: Course[];
  instructor_courses: Course[];
  selectedCourse?: Course;
  instructorPreviewedLesson?: Lesson;
  notifications?: notification[];
  statistics?: Statistics;
  reviews?: any[];
  isConnected: boolean;
  createSocket: () => void;
  getSocket: () => Socket | null;
  disconnectSocket: () => void;
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
  getEnrolledCourse: (course_id: number) => Promise<Course>;
  getUnenrolledCourse: (course_id: number) => Promise<Course>;
  getInstructorCourses: () => Promise<void>;
  getTopCoursesInstructor: (
    page?: string,
    per_page?: string
  ) => Promise<Course[]>;
  getInstructorPreviewedLesson: (lesson_id: string) => Promise<Lesson>;
  createCourse: (formData: any) => Promise<void>;
  editCourse: (formData: any) => Promise<void>;
  searchCourse: (
    channel_id: number,
    search_term?: string,
    page?: string,
    per_page?: string
  ) => Promise<any[]>;
  addFavouriteCourse: (course_id: number) => Promise<void>;
  completeLesson: (lesson_id: number) => Promise<Boolean>;
  enrollCourse: (course_id: number) => Promise<number>;
  getEnrolledCourses: (page?: string, per_page?: string) => Promise<void>;
  getCourseDetails: (course_id: string) => Promise<void>;
  getFavouriteCourses: (page?: string, per_page?: string) => Promise<void>;
  getRecommendedCourses: (
    page?: string,
    per_page?: string,
    pagination?: boolean
  ) => Promise<Course[]>;
  getReview: (course_id: number) => Promise<Review | false>;
  getTopEnrolledCoursesUser: (
    page?: string,
    per_page?: string,
    pagination?: boolean
  ) => Promise<Course[]>;
  removeFavouriteCourse: (course_id: number) => Promise<void>;
  saveReview: (
    course_id: number,
    rating: number,
    review_text: string
  ) => Promise<Boolean>;
  submitHomework: (homework_submission_file: any) => Promise<Boolean>;
  withdrawCourse: (course_id: number) => Promise<void>;
  handleSelectCourse: (course_id: number) => Promise<void>;
  handleInstructorSelectCourse: (course_id: number) => Promise<void>;
  getCommunities: () => Promise<any[]>;
  getInstructorDetails: (instructor_id: string) => Promise<Instructor>;
  getInstructors: (community_id: string) => Promise<Instructor[] | undefined>;
  getNotificationsUser: () => Promise<void>;
  getNotificationsInstructor: () => Promise<void>;
  getCourseReview: (course_id: string) => Promise<void>;
  addGroupChatParticipants: (
    initiator_type: string,
    chat_id: number,
    new_participant_info: {
      participant_email: string;
      participant_type: string;
    }[]
  ) => Promise<boolean | string>;
  createGroupChat: (
    initiator_type: string,
    group_name: string,
    participant_info: {
      participant_email: string;
      participant_type: string;
    }[]
  ) => Promise<string | number>;
  createPrivateChat: (
    initiator_type: string,
    participant_email: string,
    participant_type: string
  ) => Promise<string | number>;
  editGroupChatName: (
    participant_type: string,
    chat_id: number,
    new_group_name: string
  ) => Promise<boolean | string>;
  editGroupChatPicture: (new_picture: any) => Promise<Boolean>;
  elevateParticipantToAdmin: (
    initiator_type: string,
    chat_id: number,
    participant_email: string,
    participant_type: string
  ) => Promise<Boolean | string>;
  getChatDetails: (initiator_type: string, chat_id: number) => Promise<any>;
  getChatMessages: (
    chat_id: number,
    chat_participant_id: string,
    page?: string,
    per_page?: string
  ) => Promise<Message[]>;
  getParticipantChats: (participant_type: string) => Promise<any>;
  removeGroupChatParticipant: (
    chat_id: number,
    participant_email: string,
    participant_type: string
  ) => Promise<string | boolean>;
  searchParticipants: (
    participant_type: string,
    search_term: string,
    page?: string,
    per_page?: string
  ) => Promise<any>;
  getStatistics: (time_period: string) => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      channels: [],
      channel_id: 0,
      recommended_courses: [],
      top_enrolled_courses: [],
      instructor_courses: [],
      ...socketSlice(set, get),
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
          console.log("Unexpected error has occurred. Error: ", error);
          throw new Error("Unexpected error has occurred.");
        }
      },
      logout: async () => {
        console.log("(appStore) Logging out");
        try {
          set({
            channels: [],
            channel_id: 0,
            favourite_courses: [],
            enrolled_courses: [],
            recommended_courses: [],
            top_enrolled_courses: [],
            instructor_courses: [],
            selectedCourse: undefined,
            instructorPreviewedLesson: undefined,
          });
          get().disconnectSocket();
        } catch (error) {
          console.error("Error logging out of AppStore:", error);
          throw new Error("An unexpected error occurred while logging out.");
        }
      },
      getUserChannels: async () => {
        console.log("Retrieving User channels");
        try {
          const response = await axios.get(CHANNEL_USER_GET_CHANNELS_URL, {
            headers: { "Content-Type": "application/json" },
          });
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
      getEnrolledCourse: async (course_id) => {
        console.log("(Store) Get Enrolled Course for course: " + course_id);
        try {
          const response = await axios.get(
            `${COURSE_GET_ENROLLED_COURSE}/${course_id.toString()}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status === 200) {
            set({
              selectedCourse: responseData,
            });
            return responseData;
          }
        } catch (error: any) {
          console.error(error.message);
        }
      },
      getUnenrolledCourse: async (course_id) => {
        console.log("(Store) Get Unenrolled Course for course: " + course_id);
        try {
          const response = await axios.get(
            `${COURSE_GET_UNENROLLED_COURSE}/${course_id.toString()}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status === 200) {
            set({
              selectedCourse: responseData,
            });
            return responseData;
          }
        } catch (error: any) {
          console.error(error.message);
        }
      },
      getInstructorCourses: async (): Promise<void> => {
        console.log("(Store) Get Instructor Courses");
        try {
          const response = await axios.get(
            `${COURSE_GET_ALL_INSTRUCTOR_COURSES}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status === 200) {
            // Map over the data to transform `name` into `title`, because the component expects `title`
            const active_courses = responseData.active_courses.map(
              (course: any) => ({
                ...course,
                course_id: course.id, // Add a `course_id` field based on `id`
                //course_name: course.name, // Add a `title` field based on `name`
                course_image: course.image, // Add a `course_image` field based on `image`

                // name: undefined, // Optionally remove the `name` field
              })
            );

            const not_approved_courses = responseData.not_approved_courses.map(
              (course: any) => ({
                ...course,
                course_id: course.id, // Add a `course_id` field based on `id`
                //course_name: course.name, // Add a `title` field based on `name`
                course_image: course.image, // Add a `course_image` field based on `image`
              })
            );
            set({ instructor_courses: active_courses });
          }
        } catch (error: any) {
          console.error(error.message);
        }
      },
      getTopCoursesInstructor: async (page, per_page) => {
        console.log("(Store) Instructor Get Top Course");
        try {
          const response = await axios.get(
            `${COURSE_GET_TOP_COURSES_INSTRUCTOR}`,
            {
              params: { page, per_page },
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          // MAP API response to FE Course type
          const mappedCourses = responseData.courses.map((course: any) => ({
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
          }));
          if (get().top_enrolled_courses.length === 0) {
            // ONLY SET FIRST 5 COURSES IN TOP_ENROLLED_COURSES
            set({ top_enrolled_courses: mappedCourses });
          } else {
            //  RETURN NEXT 5 COURSES TO COMPONENT (topCoursesSeeAll)
            return mappedCourses;
          }
        } catch (error: any) {
          console.error(error.message);
        }
      },
      getInstructorPreviewedLesson: async (lesson_id) => {
        console.log(
          "(Store) Get Instructor Previewed Lesson for lesson: " + lesson_id
        );
        try {
          const response = await axios.get(
            `${COURSE_INSTRUCTOR_GET_PREVIEW_LESSON}/${lesson_id.toString()}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = await response.data;
          if (response.status === 200) {
            set({
              instructorPreviewedLesson: responseData,
            });
            console.log("Instructor Previewed Lesson: ", responseData);
            return responseData;
          }
        } catch (error: any) {
          console.error(error.message);
        }
      },
      getCourseDetails: async (course_id) => {
        console.log("(Store) Get Course Details for course: " + course_id);
        try {
          const response = await axios.get(
            `${COURSE_INSTRUCTOR_GET_COURSE_DETAILS}/${course_id}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status === 200) {
            set({
              selectedCourse: responseData,
            });
            // console.log("Course Details: ", responseData);
          }
        } catch (error: any) {
          console.error(error.message);
        }
      },
      createCourse: async (formData) => {
        console.log("(Store) Create Course");
        try {
          const response = await axios.post(
            COURSE_CREATE_COURSE, // URL
            formData, // Payload
            {
              headers: {
                "Content-Type": "multipart/form-data",
                // Authorization: token, // Add your token if required
              },
            }
          );

          const responseData = response.data;
          if (response.status === 200) {
            console.log("Course created successfully: ", responseData);
            return responseData;
          }
        } catch (error: any) {
          console.error("Error creating course: ", error.message);
        }
      },
      editCourse: async (formData) => {
        console.log("(Store) Edit Course");
        try {
          const response = await axios.post(
            COURSE_INSTRUCTOR_EDIT_COURSE, // URL
            formData, // Payload
            {
              headers: {
                "Content-Type": "multipart/form-data",
                // Authorization: token, // Add your token if required
              },
            }
          );

          const responseData = response.data;
          if (response.status === 200) {
            console.log("Course edited successfully: ", responseData);
            return responseData;
          }
        } catch (error: any) {
          console.error("Error editing course: ", error.message);
        }
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
          if (response.status == 200) {
            get().getFavouriteCourses();
          }
          // Tentatively returns nothing for successful API request
          // Response is {"message": "Course successfully added to favourites"}
        } catch (error: any) {
          console.error(error);
        }
      },
      completeLesson: async (lesson_id: number) => {
        console.log("(Store) Complete Lesson: " + lesson_id);
        try {
          const response = await axios.post(
            COURSE_USER_COMPLETE_LESSON_URL,
            { lesson_id },
            { headers: { "Content-Type": "application/json" } }
          );
          if (response.status == 200) {
            return true;
          }
          return false;
        } catch (error: any) {
          console.error(error);
          return false;
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
          if (response.status === 200) {
            get().getEnrolledCourses();
            get().getRecommendedCourses();
            get().getTopEnrolledCoursesUser();
          }
          return response.status;
          // Tentatively returns nothing for successful API request
          // Response is {"message": "User successfully enrolled"}
        } catch (error: any) {
          console.error(error);
          return 500;
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
          // console.log(JSON.stringify(responseData));
          // MAP API response to FE Course type
          const mappedCourses = responseData.courses.map((course: any) => ({
            course_id: course.id,
            community_id: undefined,
            course_image: course.course_image,
            course_name: course.course_name,
            community_name: course.community_name,
            description: course.description,
            instructors: undefined,
            chapters: undefined,
            rating: course.rating,
            enrollment_count: undefined,
            completion_rate: course.progress,
          }));
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
          // console.log("responseData: " + JSON.stringify(responseData))
          // MAP API response to FE Course type
          const mappedCourses = responseData.map((course: any) => ({
            course_id: course.id,
            community_id: undefined,
            course_image: course.course_image,
            course_name: course.course_name,
            community_name: course.community_name,
            description: course.description,
            instructors: undefined,
            chapters: undefined,
            rating: course.rating,
            enrollment_count: course.enrollments,
          }));
          set({
            favourite_courses: mappedCourses,
          });
          // Tentatively returns nothing for successful API request
        } catch (error: any) {
          console.error(error);
        }
      },
      getRecommendedCourses: async (page, per_page, pagination = false) => {
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
          const mappedCourses = responseData.map((course: any) => ({
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
          }));
          if (get().recommended_courses.length === 0) {
            // ONLY SET FIRST 5 COURSES IN RECOMMENDED_COURSES
            set({
              recommended_courses: mappedCourses,
            });
          } else if (
            get().recommended_courses.length > 0 &&
            pagination == false
          ) {
            // ANOTHER API CALL TO REFRESH RECOMMENDED_COURSES
            set({
              recommended_courses: mappedCourses,
            });
          } else {
            //  RETURN NEXT 5 COURSES TO COMPONENT (suggestionsSeeAll)
            return mappedCourses;
          }

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
          if (response.status === 200) {
            const reviewData: Review = {
              course_id: course_id,
              rating: responseData.rating,
              review_text: responseData.review_text,
            };
            return reviewData;
          } else {
            return false;
          }

          // Tentatively returns nothing for successful API request
        } catch (error: any) {
          console.error(error);
          return false;
        }
      },
      getTopEnrolledCoursesUser: async (
        page?,
        per_page?,
        pagination = false
      ) => {
        console.log("(Store) Get Top Enrolled Courses");
        try {
          const response = await axios.get(
            `${COURSE_USER_GET_TOP_ENROLLED_COURSES_URL}/${get().channel_id.toString()}`,
            {
              params: { page, per_page },
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          // MAP API response to FE Course type
          const mappedCourses = responseData.courses.map((course: any) => ({
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
          }));
          if (get().top_enrolled_courses.length === 0) {
            // ONLY SET FIRST 5 COURSES IN TOP_ENROLLED_COURSES
            set({ top_enrolled_courses: mappedCourses });
          } else if (
            get().top_enrolled_courses.length > 0 &&
            pagination == false
          ) {
            // ANOTHER API CALL TO REFRESH TOP ENROLLED COURSES
            set({ top_enrolled_courses: mappedCourses });
          } else {
            //  RETURN NEXT 5 COURSES TO COMPONENT (topCoursesSeeAll)
            return mappedCourses;
          }

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
            { course_id, rating, review_text },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          if (response.status === 200) {
            return true;
          } else {
            return false;
          }
          // Tentatively returns nothing for successful API request
        } catch (error: any) {
          console.error(error);
          return false;
        }
      },
      submitHomework: async (homework_submission_file: any) => {
        console.log("(Store) Submit Homework");
        homework_submission_file.forEach((value: any, key: any) => {
          console.log("test: " + key, value);
        });
        try {
          const response = await axios.post(
            COURSE_USER_SUBMIT_HOMEWORK_URL,
            homework_submission_file,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          if (response.status == 200) {
            return true;
          }
          return false;
        } catch (error: any) {
          console.error(error.response);
          return false;
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
      handleSelectCourse: async (course_id: number) => {
        const courseSelected = get().enrolled_courses?.find(
          (course) => course.course_id === course_id
        );
        if (courseSelected) {
          // IF COURSE IS ALREADY ENROLLED
          router.replace({
            pathname: "/shared/course/courseContent",
            params: {
              courseId: courseSelected.course_id,
            },
          });
        } else {
          // COURSE NOT YET ENROLLED
          const unenrolledCourse = await get().getUnenrolledCourse(course_id);
          if (unenrolledCourse) {
            router.replace({
              pathname: "/shared/course/courseDetails",
              params: {
                courseId: unenrolledCourse.course_id,
              },
            });
          }
        }
      },
      handleInstructorSelectCourse: async (course_id: number) => {
        const unenrolledCourse = await get().getUnenrolledCourse(course_id);
        if (unenrolledCourse) {
          router.push({
            pathname: INSTRUCTOR_COURSE_DETAILS,
            params: {
              courseId: unenrolledCourse.course_id,
            },
          });
        }
      },
      getCommunities: async () => {
        console.log("(Store) Get communities");
        try {
          const response = await axios.get(`${COMMUNITY_GET_COMMUNITIES_URL}`, {
            headers: { "Content-Type": "application/json" },
          });
          const responseData = response.data;
          return responseData.communities;
        } catch (error: any) {
          console.error(error);
        }
      },
      getInstructorDetails: async (instructor_id: string) => {
        console.log("(Store) Get Instructor Details");
        try {
          const response = await axios.get(
            `${COMMUNITY_GET_INSTRUCTOR_DETAILS_URL}/${instructor_id}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          return responseData;
        } catch (error: any) {
          console.error(error);
        }
      },
      getInstructors: async (community_id: string) => {
        console.log("(Store) Get Instructors within community");
        try {
          const response = await axios.get(
            `${COMMUNITY_GET_INSTRUCTORS_URL}/${community_id}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          const instructors: Instructor[] = responseData.instructors.map(
            (instructor: any) => ({
              instructor_id: instructor.id,
              instructor_name: instructor.name,
              instructor_profile_picture: instructor.profile_picture_url,
              company: "",
              instructor_position: "",
            })
          );
          return instructors;
        } catch (error: any) {
          console.error(error);
        }
      },
      getNotificationsUser: async () => {
        console.log("(Store) Get Notifications");
        try {
          const response = await axios.get(
            `${ACCOUNT_USER_GET_NOTIFICATIONS_URL}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          // console.log("Raw User Notifications: ", responseData);
          // const notifications: notification[] = responseData.notifications.map(
          //   (notification: any) => ({
          //     type: notification.type,
          //     title: notification.title,
          //     subtitle: notification.subtitle,
          //     timestamp: notification.timestamp,
          //   })
          // );
          set({
            notifications: responseData.notifications,
          });
        } catch (error: any) {
          console.error(error);
        }
      },
      getNotificationsInstructor: async () => {
        console.log("(Store) Get Notifications");
        try {
          const response = await axios.get(
            `${ACCOUNT_INSTRUCTOR_GET_NOTIFICATIONS_URL}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          //console.log("RAW Notifications: ", responseData);
          // const notifications: notification[] = responseData.notifications.map(
          //   (notification: any) => ({
          //     type: notification.type,
          //     title: notification.title,
          //     subtitle: notification.subtitle,
          //     timestamp: notification.timestamp,
          //   })
          // );
          set({
            notifications: responseData.notifications,
          });
        } catch (error: any) {
          console.error(error);
        }
      },
      addGroupChatParticipants: async (
        initiator_type,
        chat_id,
        new_participant_info
      ) => {
        console.log(
          `(Store) Add Group Chat Participant(s) into chat: ${chat_id}`
        );
        try {
          const response = await axios.post(
            CHAT_ADD_GROUP_CHAT_PARTICIPANTS_URL,
            {
              initiator_type,
              chat_id,
              new_participant_info,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            return true;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          }
          console.error(error);
          // Return boolean false if any unknown error
          return false;
        }
      },
      createGroupChat: async (initiator_type, group_name, participant_info) => {
        console.log(`(Store) Create group chat: ${group_name}`);
        try {
          const response = await axios.post(
            CHAT_CREATE_GROUP_CHAT_URL,
            {
              initiator_type,
              group_name,
              participant_info,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            return responseData.chat_id;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          }
          console.error(error);
          // Return string if there is any error
          return "Unknown Error";
        }
      },
      createPrivateChat: async (
        initiator_type,
        participant_email,
        participant_type
      ) => {
        console.log(`(Store) Create Private chat with: ${participant_email}`);
        try {
          const response = await axios.post(
            CHAT_CREATE_PRIVATE_CHAT_URL,
            {
              initiator_type,
              participant_email,
              participant_type,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            return responseData.chat_id;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          }
          console.error(error);
          // Return string if there is any error
          return "Unknown Error";
        }
      },
      editGroupChatName: async (participant_type, chat_id, new_group_name) => {
        console.log(`(Store) Edit Group Chat Name to: ${new_group_name}`);
        try {
          const response = await axios.post(
            CHAT_EDIT_GROUP_CHAT_NAME_URL,
            {
              participant_type,
              chat_id,
              new_group_name,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            return true;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          }
          console.error(error);
          // Return string if there is any error
          return "Unknown Error";
        }
      },
      editGroupChatPicture: async (new_picture) => {
        console.log(`(Store) Edit Group Chat Picture`);
        try {
          const response = await axios.post(
            CHAT_EDIT_GROUP_CHAT_PICTURE_URL,
            new_picture,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            return true;
          } else {
            return false;
          }
        } catch (error: any) {
          console.error(error.response);
          return false;
        }
      },
      elevateParticipantToAdmin: async (
        initiator_type,
        chat_id,
        participant_email,
        participant_type
      ) => {
        console.log(`(Store) Elevate Participant to admin`);
        try {
          const response = await axios.post(
            CHAT_ELEVATE_PARTICIPANT_TO_ADMIN_URL,
            {
              initiator_type,
              chat_id,
              participant_email,
              participant_type,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            return true;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          }
          console.error(error);
          // Return string if there is any error
          return "Unknown Error";
        }
      },
      getChatDetails: async (initiator_type, chat_id) => {
        console.log(`(Store) Get Chat Details for id: ` + chat_id);
        try {
          const response = await axios.get(
            `${CHAT_GET_CHAT_DETAILS_URL}/${initiator_type}/${chat_id}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            return responseData.chat_info;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          } else if (error.status == 404) {
            return error.message;
          }
          console.error(error);
          // Return string if there is any error
          return "Unknown Error";
        }
      },
      getChatMessages: async (
        chat_id,
        chat_participant_id,
        page?,
        per_page?
      ) => {
        console.log(`(Store) Get Chat Messages for chat_id: ` + chat_id);
        try {
          const response = await axios.get(
            `${CHAT_GET_CHAT_MESSAGES_URL}/${chat_id.toString()}/${chat_participant_id}`,
            {
              params: { page, per_page },
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            const messages = responseData.messages.map((message: any) => ({
              message_id: message.message_id,
              chat_participant_id: message.chat_participant_id,
              content: message.content,
              timestamp: message.timestamp,
            }));
            return messages;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          } else if (error.status == 404) {
            return error.message;
          }
          console.error(error);
          // Return string if there is any error
          return "Unknown Error";
        }
      },
      getParticipantChats: async (participant_type) => {
        console.log(`(Store) Get Participant Chats`);
        try {
          const response = await axios.get(
            `${CHAT_GET_PARTICIPANT_CHATS_URL}/${participant_type}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            return responseData.chats;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          } else if (error.status == 404) {
            return error.message;
          }
          console.error(error);
          // Return string if there is any error
          return "Unknown Error";
        }
      },
      removeGroupChatParticipant: async (
        chat_id,
        participant_email,
        participant_type
      ) => {
        console.log(`(Store) Remove Group Chat Participant`);
        try {
          const response = await axios.post(
            `${CHAT_REMOVE_GROUP_CHAT_PARTICIPANTS_URL}`,
            {
              chat_id,
              participant_email,
              participant_type,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status == 200) {
            return true;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          } else if (error.status == 404) {
            return error.message;
          }
          console.error(error);
          // Return string if there is any error
          return "Unknown Error";
        }
      },
      searchParticipants: async (
        participant_type,
        search_term,
        page?,
        per_page?
      ) => {
        console.log(`(Store) Search for all participants`);
        try {
          const response = await axios.get(`${CHAT_SEARCH_PARTICIPANTS_URL}`, {
            params: { participant_type, search_term, page, per_page },
            headers: { "Content-Type": "application/json" },
          });
          const responseData = response.data;
          if (response.status == 200) {
            return responseData.participants;
          }
        } catch (error: any) {
          if (error.status == 400) {
            return error.message;
          } else if (error.status == 404) {
            return error.message;
          }
          console.error(error);
          // Return string if there is any error
          return "Unknown Error";
        }
      },
      getCourseReview: async (course_id) => {
        console.log("(Store) Get Course Review for course: " + course_id);
        try {
          const response = await axios.get(
            `${COURSE_INSTRUCTOR_COURSE_REVIEW}/${course_id}`,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          const responseData = response.data;
          if (response.status === 200) {
            console.log("Course Review: ", responseData);
            set({
              reviews: responseData.reviews,
            });
            return responseData;
          }
        } catch (error: any) {
          console.error(error.message);
        }
      },
      getStatistics: async (timePeriod: string) => {
        //console.log(`(Store) Get Statistics for ${timePeriod}`);
        try {
          // Construct API endpoints with timePeriod as a query parameter
          const analyticsEndpoints = {
            lessons: `${ANALYTICS_LESSONS}`,
            enrollments: `${ANALYTICS_ENROLLMENTS}/${timePeriod}`,
            progress: `${ANALYTICS_PROGRESS}/${timePeriod}`,
            reviews: `${ANALYTICS_REVIEWS}/${timePeriod}`,
          };
          console.log("Analytics Endpoints: ", analyticsEndpoints);

          // Fetch all statistics concurrently
          const [lessonsRes, enrollmentsRes, progressRes, reviewsRes] =
            await Promise.all([
              axios.get(analyticsEndpoints.lessons, {
                headers: { "Content-Type": "application/json" },
              }),
              axios.get(analyticsEndpoints.enrollments, {
                headers: { "Content-Type": "application/json" },
              }),
              axios.get(analyticsEndpoints.progress, {
                headers: { "Content-Type": "application/json" },
              }),
              axios.get(analyticsEndpoints.reviews, {
                headers: { "Content-Type": "application/json" },
              }),
            ]);

          // Construct statistics object
          const statistics = {
            average_course_progress:
              progressRes?.data?.average_course_progress ?? 0,
            progress_percentage_change:
              progressRes?.data?.percentage_change ?? 0,
            total_enrollments: enrollmentsRes?.data?.total_enrollments ?? 0,
            enrollments_percentage_change:
              enrollmentsRes?.data?.percentage_change ?? 0,
            total_lessons: lessonsRes?.data?.total_lessons ?? 0,
            total_reviews: reviewsRes?.data?.total_reviews ?? 0,
            reviews_percentage_change: reviewsRes?.data?.percentage_change ?? 0,
          };

          // Update the store
          set({ statistics });
        } catch (error) {
          console.error(
            `Error fetching statistics for ${timePeriod}:`,
            (error as any).message
          );
        }
      },
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        channels: state.channels,
        channel_id: state.channel_id,
        recommended_courses: state.recommended_courses,
        top_enrolled_courses: state.top_enrolled_courses,
        instructor_courses: state.instructor_courses,
      }),
    }
  )
);

export default useAppStore;
