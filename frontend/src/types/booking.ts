export type BookingStatus = "active" | "upcoming" | "completed";

export interface BookingUser {
  id: string;
  name: string;
  role: string;
}

export interface Booking {
  id: string;
  userId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  user: BookingUser;
}
