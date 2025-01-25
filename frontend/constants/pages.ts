import { Href } from "expo-router";

export const BASE_HOME = "/(app)";

// SHARED PAGES
export const CAROUSEL_PAGE = "/shared/carouselPage" as Href<string>;
export const ROLE_SELECTION_PAGE = "/shared/roleSelectionPage" as Href<string>;
export const MEMBER_FLOW_PAGE = "/shared/memberSignInUpPage" as Href<string>;
export const INSTRUCTOR_FLOW_PAGE =
  "/shared/instructorSignInUpPage" as Href<string>;
export const INSTRUCTOR_LOGIN_PAGE =
  "/shared/instructorLoginPage" as Href<string>;
export const INSTRUCTOR_SIGNUP_PAGE =
  "/shared/instructorSignUpPage" as Href<string>;
export const MEMBER_LOGIN_PAGE = "/shared/memberLoginPage" as Href<string>;
export const MEMBER_SIGNUP_PAGE = "/shared/memberSignUpPage" as Href<string>;
export const INSTRUCTOR_REGISTRATION_SUCCESS =
  "/shared/registrationSuccessInstructorPage" as Href<string>;
export const INSTRUCTOR_WAITING_PAGE =
  "/shared/instructorWaitingPage" as Href<string>;
export const MEMBER_REGISTRATION_SUCCESS =
  "/shared/registrationSuccessMemberPage" as Href<string>;
export const DONATION_PAGE = "/shared/profile/donate" as Href<string>;
export const MEMBER_CHANNEL_REGISTRATION =
  `/shared/memberChannelSignUpPage` as Href<string>;
export const NOTIFICATION_PAGE = "/shared/notification" as Href<string>;

// COURSE PAGES
export const COURSE_CONTENT_PAGE = `courseContent` as Href<string>;
export const COURSE_DETAILS_PAGE =
  `shared/course/courseDetails` as Href<string>;

// MEMBER/GUEST PAGES
export const MEMBER_GUEST_NAMESPACE = "(member_guest)";
export const MEMBER_GUEST_TABS = "(tabs)";
export const MEMBER_GUEST_TABS_NAMESPACE = `${MEMBER_GUEST_NAMESPACE}/${MEMBER_GUEST_TABS}`;
export const MEMBER_GUEST_HOME =
  `/${MEMBER_GUEST_TABS_NAMESPACE}` as Href<string>;
export const MEMBER_GUEST_COURSEPAGE =
  `/${MEMBER_GUEST_TABS_NAMESPACE}/coursePage` as Href<string>;
export const MEMBER_GUEST_CHAT =
  `/${MEMBER_GUEST_TABS_NAMESPACE}/chat` as Href<string>;
export const MEMBER_GUEST_PROFILE =
  `/${MEMBER_GUEST_TABS_NAMESPACE}/profile` as Href<string>;

// INSTRUCTOR PAGES
export const INSTRUCTOR_NAMESPACE = "(instructor)";
export const INSTRUCTOR_HOME =
  `/${INSTRUCTOR_NAMESPACE}/homePage` as Href<string>;
export const INSTRUCTOR_COURSEPAGE =
  `/${INSTRUCTOR_NAMESPACE}/coursePage` as Href<string>;
export const INSTRUCTOR_COURSECONTENT =
  `/shared/course/instructorCourseContent` as Href<string>;
export const INSTRUCTOR_CREATE_COURSE =
  `/shared/course/createCoursePage` as Href<string>;
export const TOP_COURSES_SEE_ALL =
  `/(instructor)/home/topCoursesSeeAll` as Href<string>;
export const INSTRUCTOR_COURSE_DETAILS =
  `/shared/course/instructorCourseDetails` as Href<string>;

// ADMIN PAGES
export const ADMIN_NAMESPACE = "(admin)";
export const ADMIN_HOME = `/${ADMIN_NAMESPACE}` as Href<string>;

export const ADMIN_USER_SETTINGS_NAMESPACE = "user_settings";
export const ADMIN_MEMBER_SETTINGS_NAMESPACE = "member";
export const ADMIN_INSTRUCTOR_SETTINGS_NAMESPACE = "instructor";
export const ADMIN_USER_SETTINGS =
  `${ADMIN_HOME}/${ADMIN_USER_SETTINGS_NAMESPACE}` as Href<string>;
export const ADMIN_MEMBER_SETTINGS =
  `${ADMIN_USER_SETTINGS}/${ADMIN_MEMBER_SETTINGS_NAMESPACE}` as Href<string>;
export const ADMIN_MEMBER_MANAGE =
  `${ADMIN_MEMBER_SETTINGS}/manage` as Href<string>;
export const ADMIN_INSTRUCTOR_SETTINGS =
  `${ADMIN_USER_SETTINGS}/${ADMIN_INSTRUCTOR_SETTINGS_NAMESPACE}` as Href<string>;
export const ADMIN_INSTRUCTOR_MANAGE =
  `${ADMIN_INSTRUCTOR_SETTINGS}/manage` as Href<string>;
export const ADMIN_INSTRUCTOR_REQUEST =
  `${ADMIN_INSTRUCTOR_SETTINGS}/request` as Href<string>;

export const ADMIN_CONTENT_SETTINGS =
  `${ADMIN_HOME}/content_settings` as Href<string>;
export const ADMIN_CHANNELS_MANAGE =
  `${ADMIN_CONTENT_SETTINGS}/channels_manage` as Href<string>;
export const ADMIN_COURSES_MANAGE =
  `${ADMIN_CONTENT_SETTINGS}/courses_manage` as Href<string>;
export const ADMIN_COURSES_REQUEST =
  `${ADMIN_CONTENT_SETTINGS}/courses_request` as Href<string>;

export const ADMIN_PAYMENT_SETTINGS =
  `${ADMIN_HOME}/payment_settings` as Href<string>;
export const ADMIN_PAYMENT_CONFIGS =
  `${ADMIN_PAYMENT_SETTINGS}/configs` as Href<string>;
export const ADMIN_PAYMENT_TRANSACTIONS =
  `${ADMIN_PAYMENT_SETTINGS}/transactions` as Href<string>;

export const ADMIN_SYSTEM_SETTINGS =
  `${ADMIN_HOME}/system_settings` as Href<string>;
export const ADMIN_SYSTEM_INFO =
  `${ADMIN_SYSTEM_SETTINGS}/info` as Href<string>;
export const ADMIN_SYSTEM_POLICY =
  `${ADMIN_SYSTEM_SETTINGS}/policy` as Href<string>;
