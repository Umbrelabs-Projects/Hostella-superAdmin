import { create } from "zustand";
import { Hostel } from "@/types/admin";

interface HostelState {
  hostels: Hostel[];
  selectedHostel: Hostel | null;
  total: number;
  page: number;
  totalPages: number;
  searchQuery: string;

  setHostels: (
    hostels: Hostel[],
    total: number,
    page: number,
    totalPages: number
  ) => void;
  setSelectedHostel: (hostel: Hostel | null) => void;
  addHostel: (hostel: Hostel) => void;
  updateHostel: (id: string, updates: Partial<Hostel>) => void;
  removeHostel: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setPage: (page: number) => void;
  clearHostels: () => void;
}

export const useHostelStore = create<HostelState>((set) => ({
  hostels: [],
  selectedHostel: null,
  total: 0,
  page: 1,
  totalPages: 0,
  searchQuery: "",

  setHostels: (hostels, total, page, totalPages) =>
    set({ hostels, total, page, totalPages }),

  setSelectedHostel: (hostel) => set({ selectedHostel: hostel }),

  addHostel: (hostel) =>
    set((state) => ({
      hostels: [hostel, ...state.hostels],
      total: state.total + 1,
    })),

  updateHostel: (id, updates) =>
    set((state) => ({
      hostels: state.hostels.map((h) =>
        h.id === id ? { ...h, ...updates } : h
      ),
      selectedHostel:
        state.selectedHostel?.id === id
          ? { ...state.selectedHostel, ...updates }
          : state.selectedHostel,
    })),

  removeHostel: (id) =>
    set((state) => ({
      hostels: state.hostels.filter((h) => h.id !== id),
      total: state.total - 1,
      selectedHostel:
        state.selectedHostel?.id === id ? null : state.selectedHostel,
    })),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setPage: (page) => set({ page }),

  clearHostels: () =>
    set({
      hostels: [],
      selectedHostel: null,
      total: 0,
      page: 1,
      totalPages: 0,
      searchQuery: "",
    }),
}));
