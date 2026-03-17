export const isValidEmail = (s = "") => /\S+@\S+\.\S+/.test(s);
export const isValidMobileIN = (s = "") => /^[6-9]\d{9}$/.test(s);
