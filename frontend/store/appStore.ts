import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";

import {
  PAYMENT_STRIPE_FETCH_PAYMENT_SHEET_URL,
  CHANNEL_USER_GET_CHANNELS_URL,
  CHANNEL_USER_INVITE_URL,
  COURSE_GET_ENROLLED_COURSE,
  COURSE_GET_UNENROLLED_COURSE,
  COURSE_GET_TOP_COURSES_INSTRUCTOR,
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
  COURSE_GET_ALL_INSTRUCTOR_COURSES,
  COURSE_CREATE_COURSE,
  COURSE_INSTRUCTOR_GET_PREVIEW_LESSON,
  COURSE_INSTRUCTOR_GET_COURSE_DETAILS,
  COURSE_INSTRUCTOR_EDIT_COURSE,
  COMMUNITY_GET_COMMUNITIES_URL,
  COMMUNITY_GET_INSTRUCTOR_DETAILS_URL,
  COMMUNITY_GET_INSTRUCTORS_URL,
} from "@/constants/routes";
import Channel from "@/types/shared/Channel";
import Course from "@/types/shared/Course/Course";
import Review from "@/types/shared/Course/Review";
import Lesson from "@/types/shared/Course/Lesson";
import Instructor from "@/types/shared/Course/Instructor";
import { router } from "expo-router";

export interface AppState {
  channels: Channel[]; // List of Channels that user has access to
  channel_id: number; // ID of user's current channel
  favourite_courses?: Course[]; // List of user's favourite courses
  enrolled_courses?: Course[]; // List of user's enrolled courses
  recommended_courses: Course[]; // List of user's recommended courses
  top_enrolled_courses: Course[];
  review?: Review; // Not sure if review or reviews should be stored
  instructor_courses: Course[];
  selectedCourse?: Course;
  instructorPreviewedLesson?: Lesson;
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
  searchCourse: (
    channel_id: number,
    search_term?: string,
    page?: string,
    per_page?: string
  ) => Promise<any[]>;
  addFavouriteCourse: (course_id: number) => Promise<void>;
  enrollCourse: (course_id: number) => Promise<number>;
  getEnrolledCourses: (page?: string, per_page?: string) => Promise<void>;
  getCourseDetails: (course_id: string) => Promise<void>;
  getFavouriteCourses: (page?: string, per_page?: string) => Promise<void>;
  getRecommendedCourses: (
    page?: string,
    per_page?: string,
    pagination?: boolean,
  ) => Promise<Course[]>;
  getReview: (course_id: number) => Promise<void>;
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
  ) => Promise<void>;
  withdrawCourse: (course_id: number) => Promise<void>;
  editCourse: (formData: any) => Promise<void>;
  getCommunities: () => Promise<any[]>;
  getInstructorDetails: (instructor_id: string) => Promise<Instructor>;
  getInstructors: (community_id: string) => Promise<Instructor[] | undefined>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      channels: [],
      channel_id: 0,
      recommended_courses: [],
      top_enrolled_courses: [],
      instructor_courses: [],
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
            review: undefined,
            instructor_courses: [],
            selectedCourse: undefined,
            instructorPreviewedLesson: undefined,
          });
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
          } else if (get().recommended_courses.length > 0 && pagination == false) {
            // ANOTHER API CALL TO REFRESH RECOMMENDED_COURSES
            set({
              recommended_courses: mappedCourses,
            });
          }
          else {
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
      getTopEnrolledCoursesUser: async (page?, per_page?, pagination = false) => {
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
          } else if (get().top_enrolled_courses.length > 0 && pagination == false) {
            // ANOTHER API CALL TO REFRESH TOP ENROLLED COURSES
            set({ top_enrolled_courses: mappedCourses });
          }
          else {
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
          const response = await axios.post(`${COURSE_USER_SAVE_REVIEW_URL}`, {
            params: { course_id, rating, review_text },
            headers: { "Content-Type": "application/json" },
          });
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
      handleSelectCourse: async (course_id: number) => {
        const courseSelected = get().enrolled_courses?.find(
          (course) => course.course_id === course_id
        );
        if (courseSelected) { // IF COURSE IS ALREADY ENROLLED
          console.log("Hereeee!");
          router.push({
              pathname: "/shared/course/courseContent",
              params: {
                  courseId: courseSelected.course_id,
              },
          });
        } else { // COURSE NOT YET ENROLLED
          console.log("Here!");
          const unenrolledCourse = await get().getUnenrolledCourse(course_id);
          if (unenrolledCourse) {
              router.push({
                  pathname: "/shared/course/courseDetails",
                  params: {
                      courseId: unenrolledCourse.course_id,
                  },
              });
          }
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
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAppStore;
