import { api } from "./api";
import type { Booking, BookingFormData, BookingStatus } from "../types";

export const createBooking = async (
  bookingData: BookingFormData
): Promise<Booking> => {
  const res = await api.post<{ success: true; booking: Booking }>(
    "/bookings",
    bookingData
  );
  return res.data.booking;
};

export const getMyBookings = async (): Promise<Booking[]> => {
  const res = await api.get<{ success: true; bookings: Booking[] }>(
    "/bookings/mine"
  );
  return res.data.bookings;
};

export const getAllBookings = async (
  status?: BookingStatus
): Promise<Booking[]> => {
  const res = await api.get<{ success: true; bookings: Booking[] }>(
    "/bookings",
    { params: status ? { status } : undefined }
  );
  return res.data.bookings;
};

export const updateBookingStatus = async (
  id: string,
  status: BookingStatus
): Promise<Booking> => {
  const res = await api.patch<{ success: true; booking: Booking }>(
    `/bookings/${id}/status`,
    { status }
  );
  return res.data.booking;
};

export const cancelBooking = async (id: string): Promise<Booking> => {
  const res = await api.delete<{ success: true; booking: Booking }>(
    `/bookings/${id}`
  );
  return res.data.booking;
};
