// src/app/dashboard/components/_hooks/useBookingApi.ts

import { apiFetch } from "@/lib/api";
import { useBookingStore } from "@/stores/useBookingStore";
import { StudentBooking, BookingStatus } from "@/types/booking";

export function useBookingApi() {
  const {
    setBookings,
    setTotalBookings,
    setLoading,
    setError,
    setSuccess,
    updateBooking: updateBookingInStore,
  } = useBookingStore();

  const fetchBookings = async (
    page: number = 1,
    pageSize: number = 10,
    search: string = "",
    status: "all" | BookingStatus = "all"
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (search) params.append("search", search);
      if (status !== "all") params.append("status", status);

      const response = await apiFetch<{
        bookings: StudentBooking[];
        total: number;
        page: number;
        pageSize: number;
      }>(`/bookings?${params.toString()}`, {
        method: "GET",
      });

      setBookings(response.bookings);
      setTotalBookings(response.total);
      setLoading(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch bookings";
      setError(message);
      setLoading(false);
    }
  };

  const updateBooking = async (bookingId: string, updates: Partial<StudentBooking>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await apiFetch<StudentBooking>(`/bookings/${bookingId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });

      updateBookingInStore(updated);
      setSuccess("Booking updated successfully");
      setLoading(false);
      return updated;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update booking";
      setError(message);
      setLoading(false);
      throw error;
    }
  };

  const approveBooking = async (bookingId: string) => {
    return updateBooking(bookingId, { status: "approved" });
  };

  const deleteBooking = async (bookingId: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch(`/bookings/${bookingId}`, {
        method: "DELETE",
      });

      setSuccess("Booking deleted successfully");
      setLoading(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete booking";
      setError(message);
      setLoading(false);
      throw error;
    }
  };

  return {
    fetchBookings,
    updateBooking,
    approveBooking,
    deleteBooking,
  };
}
