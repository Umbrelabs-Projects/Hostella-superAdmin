// src/stores/useBookingStore.ts

import { create } from "zustand";
import { StudentBooking, BookingStatus } from "@/types/booking";

export interface BookingState {
  // Data
  bookings: StudentBooking[];
  selectedBooking: StudentBooking | null;

  // UI States
  loading: boolean;
  error: string | null;
  success: string | null;
  currentPage: number;
  pageSize: number;
  totalBookings: number;
  searchQuery: string;
  statusFilter: "all" | BookingStatus;

  // Booking actions
  setBookings: (bookings: StudentBooking[]) => void;
  setSelectedBooking: (booking: StudentBooking | null) => void;
  addBooking: (booking: StudentBooking) => void;
  updateBooking: (booking: StudentBooking) => void;
  removeBooking: (id: string) => void;

  // Pagination actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setTotalBookings: (total: number) => void;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: "all" | BookingStatus) => void;

  // API state actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

const INITIAL_STATE = {
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
  success: null,
  currentPage: 1,
  pageSize: 10,
  totalBookings: 0,
  searchQuery: "",
  statusFilter: "all" as const,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...INITIAL_STATE,

  setBookings: (bookings) => set({ bookings }),
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBooking: (booking) =>
    set((state) => ({
      bookings: state.bookings.map((b) => (b.id === booking.id ? booking : b)),
    })),
  removeBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((b) => b.id !== id),
    })),

  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),
  setTotalBookings: (total) => set({ totalBookings: total }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSuccess: (success) => set({ success }),
}));
