import type { RegisterOptions } from "react-hook-form";

export interface AdminAuthStatus {
  success: boolean,
  message: string,
  user?: {
    id: number,
    username: string
  }
}

export interface LoginInfo {
  username: string;
  password: string;
};

export interface LoginValidator {
  username: RegisterOptions<LoginInfo,"username">;
  password: RegisterOptions<LoginInfo,"password">;
};

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    username: string;
  };
}
export interface LogoutResponse {
  success: boolean;
  message: string;
};

export interface ContentProps {
  location: string | undefined
};

export interface DialogProps {
  cancelLogout: () => void;
  confirmLogout: () => void;
};