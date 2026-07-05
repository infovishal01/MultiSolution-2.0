export type UserRole = "customer" | "worker" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

export type BookingStatus = "Pending" | "Assigned" | "Completed" | "Cancelled";

export interface Booking {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  service: string;
  address: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingFormData {
  fullName: string;
  phone: string;
  email?: string;
  service: string;
  address: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
}

export interface Worker {
  _id: string;
  user: { name: string; email?: string; phone?: string } | string;
  services: string[];
  experienceYears: number;
  bio?: string;
  city: string;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  totalRatings: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}
