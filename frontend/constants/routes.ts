export const VERSION = process.env.EXPO_PUBLIC_VERSION
  ? `/${process.env.EXPO_PUBLIC_VERSION}`
  : "/1.0";
export const BACKEND_BASE_URL =
  process.env.BACKEND_BASE_URL ??
  `http://${process.env.EXPO_PUBLIC_LOCAL_IP_ADDR}:8080`;

// AUTH NAMESPACE
const AUTH_NAMESPACE = "/auth";
const AUTH_BASE_URL = `${BACKEND_BASE_URL}${AUTH_NAMESPACE}${VERSION}`;

//AUTH ENDPOINTS
const AUTH_LOGIN_USER = "/user/login";
const AUTH_LOGIN_INSTRUCTOR = "/instructor/login";
const AUTH_SIGNUP_USER = "/user/signup";
const AUTH_SIGNUP_INSTRUCTOR = "/instructor/signup";

// EXPORTS
export const AUTH_USER_LOGIN_URL = `${AUTH_BASE_URL}${AUTH_LOGIN_USER}`;
export const AUTH_INSTRUCTOR_LOGIN_URL = `${AUTH_BASE_URL}${AUTH_LOGIN_INSTRUCTOR}`;

export const AUTH_USER_SIGNUP_URL = `${AUTH_BASE_URL}${AUTH_SIGNUP_USER}`;
export const AUTH_INSTRUCTOR_SIGNUP_URL = `${AUTH_BASE_URL}${AUTH_SIGNUP_INSTRUCTOR}`;
