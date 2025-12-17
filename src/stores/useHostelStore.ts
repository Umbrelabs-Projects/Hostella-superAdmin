import { create } from "zustand";
import { Hostel, Admin } from "@/types/admin";

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
    totalPages: number,
    admins?: Admin[]
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

  setHostels: (hostels, total, page, totalPages, admins?: Admin[]) => {
    // Normalize hasAdmin based on whether an admin is actually assigned
    // This prevents inconsistencies where hasAdmin is true but no admin exists
    const normalizedHostels = hostels.map((hostel) => {
      // If admins list is provided, check if any admin is assigned to this hostel
      if (admins && Array.isArray(admins)) {
        const hasAssignedAdmin = admins.some(
          (admin) => admin.assignedHostelId === hostel.id
        );
        return {
          ...hostel,
          hasAdmin: hasAssignedAdmin,
        };
      }
      // Otherwise, trust the hasAdmin field but default to false if undefined
      return {
        ...hostel,
        hasAdmin: hostel.hasAdmin ?? false,
      };
    });
    return set({ hostels: normalizedHostels, total, page, totalPages });
  },

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
