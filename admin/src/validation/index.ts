import type { LoginValidator } from "../types";

export const LoginValidation: LoginValidator = {
  username: {
    required: {
      value: true,
      message: "Username is required",
    },
    minLength: {
      value: 1,
      message: "Username be atleast 1 character",
    },
    maxLength: {
      value: 30,
      message: "Username cannot be more than 30 characters",
    },
    pattern: {
      value: /^[a-zA-Z0-9_-]+$/,
      message:
        "Username can only contain letters, numbers, underscores, and hyphens",
    },
    validate: (value) =>
      /[a-zA-Z]/.test(value) || "Username cannot be only numbers",
  },
  password: {
    required: {
      value: true,
      message: "Password is required",
    },
    minLength: {
      value: 4,
      message: "Password must be atleast 4 characters",
    },
    validate: {
      lowercase: (value) =>
        /[a-z]/.test(value) ||
        "Password must contain at least one lowercase letter",

      uppercase: (value) =>
        /[A-Z]/.test(value) ||
        "Password must contain at least one uppercase letter",

      number: (value) =>
        /\d/.test(value) || "Password must contain at least one number",

      specialCharacter: (value) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
        "Password must contain at least one special character",
    },
  },
};
