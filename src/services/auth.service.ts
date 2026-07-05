import { api } from "./api";
import type { User, UserRole } from "../types";

export interface AuthResponse {
  success: true;
  user: User;
  token: string;
}

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: UserRole;
}): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const fetchCurrentUser = async (): Promise<User> => {
  const res = await api.get<{ success: true; user: User }>("/auth/me");
  return res.data.user;
};
