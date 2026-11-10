import { ApiError } from "./apiError";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || "An error occurred"
    );
  }

  return data as T;
};

export default apiRequest;