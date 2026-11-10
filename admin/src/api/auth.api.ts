import apiRequest from "../lib/api";
import { type LogoutResponse, type LoginInfo, type LoginResponse, type AdminAuthStatus } from "../types";

export const loginUser = (data: LoginInfo) => {
  return apiRequest<LoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
};

export const logoutUser = () => {
  return apiRequest<LogoutResponse>("/admin/logout",{
    method: "POST"
  });
};

export const getAdmin = () => {
  return apiRequest<AdminAuthStatus>("/admin/auth/me");
}