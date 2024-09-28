import { Href } from "expo-router";

export const BASE_HOME = "/(app)";

// SHARED PAGES
export const MEMBER_LOGIN_PAGE = "/shared/loginPage" as Href<string>;

// MEMBER/GUEST PAGES
export const MEMBER_GUEST_NAMESPACE = "(member_guest)";
export const MEMBER_GUEST_HOME = `/${MEMBER_GUEST_NAMESPACE}/home` as Href<string>;

// INSTRUCTOR PAGES

// ADMIN PAGES
export const ADMIN_NAMESPACE = "(admin)";
export const ADMIN_HOME = `/${ADMIN_NAMESPACE}` as Href<string>;

export const ADMIN_USER_SETTINGS_NAMESPACE = "user_settings";
export const ADMIN_MEMBER_SETTINGS_NAMESPACE = "member";
export const ADMIN_INSTRUCTOR_SETTINGS_NAMESPACE = "instructor";
export const ADMIN_USER_SETTINGS = `${ADMIN_HOME}/${ADMIN_USER_SETTINGS_NAMESPACE}` as Href<string>;
export const ADMIN_MEMBER_SETTINGS = `${ADMIN_USER_SETTINGS}/${ADMIN_MEMBER_SETTINGS_NAMESPACE}` as Href<string>;
export const ADMIN_MEMBER_MANAGE = `${ADMIN_MEMBER_SETTINGS}/manage` as Href<string>;
export const ADMIN_INSTRUCTOR_SETTINGS = `${ADMIN_USER_SETTINGS}/${ADMIN_INSTRUCTOR_SETTINGS_NAMESPACE}` as Href<string>;
export const ADMIN_INSTRUCTOR_MANAGE = `${ADMIN_INSTRUCTOR_SETTINGS}/manage` as Href<string>;
export const ADMIN_INSTRUCTOR_REQUEST = `${ADMIN_INSTRUCTOR_SETTINGS}/request` as Href<string>;

export const ADMIN_CONTENT_SETTINGS = `${ADMIN_HOME}/content_settings` as Href<string>;
export const ADMIN_CHANNELS_MANAGE = `${ADMIN_CONTENT_SETTINGS}/channels_manage` as Href<string>;
export const ADMIN_COURSES_MANAGE = `${ADMIN_CONTENT_SETTINGS}/courses_manage` as Href<string>; 
export const ADMIN_COURSES_REQUEST = `${ADMIN_CONTENT_SETTINGS}/courses_request` as Href<string>;

export const ADMIN_PAYMENT_SETTINGS = `${ADMIN_HOME}/payment_settings` as Href<string>;
export const ADMIN_PAYMENT_CONFIGS = `${ADMIN_PAYMENT_SETTINGS}/configs` as Href<string>;
export const ADMIN_PAYMENT_TRANSACTIONS = `${ADMIN_PAYMENT_SETTINGS}/transactions` as Href<string>;

export const ADMIN_SYSTEM_SETTINGS = `${ADMIN_HOME}/system_settings` as Href<string>;
export const ADMIN_SYSTEM_INFO = `${ADMIN_SYSTEM_SETTINGS}/info` as Href<string>;
export const ADMIN_SYSTEM_POLICY = `${ADMIN_SYSTEM_SETTINGS}/policy` as Href<string>;
