import { useState, useEffect, useCallback } from "react";
import type { Booking } from "../types/booking";

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/booking/`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const data: Booking[] = await res.json();
      setBookings(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

export function useDeleteBooking() {
  const [deleting, setDeleting] = useState(false);

  const deleteBooking = useCallback(async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/booking/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete booking");
    } finally {
      setDeleting(false);
    }
  }, []);

  return { deleteBooking, deleting };
}
