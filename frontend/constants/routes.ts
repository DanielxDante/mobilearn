export const VERSION = process.env.EXPO_PUBLIC_VERSION ? `/${process.env.EXPO_PUBLIC_VERSION}` : "/1.0";
export const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL ?? `http://${process.env.EXPO_PUBLIC_LOCAL_IP_ADDR}:8080`;

// AUTH NAMESPACE
const AUTH_NAMESPACE = "/auth";
const AUTH_BASE_URL = `${BACKEND_BASE_URL}${AUTH_NAMESPACE}${VERSION}`;

//AUTH ENDPOINTS
const AUTH_LOGIN = "/login";
const AUTH_SIGNUP = "/signup";

// EXPORTS
export const AUTH_LOGIN_URL = `${AUTH_BASE_URL}${AUTH_LOGIN}`;
export const AUTH_SIGNUP_URL = `${AUTH_BASE_URL}${AUTH_SIGNUP}`;
