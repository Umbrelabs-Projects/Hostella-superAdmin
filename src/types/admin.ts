// src/types/admin.ts

export type AdminRole = "super-admin" | "hostel-admin";
export type AdminStatus = "active" | "inactive" | "suspended";

export interface HostelImage {
  id: string;
  url: string;
}

export interface Hostel {
  id: string;
  name: string;
  location: string | null;
  campus: string | null;
  phoneNumber: string | null; // API field name
  noOfFloors: string | null; // API field name (stored as string)
  totalRooms: number;
  singleRooms: number;
  doubleRooms: number;
  tripleRooms: number; // NEW: triple room support
  facilities: string[]; // e.g., ["Wi-Fi", "Laundry", "Gym", "Study Room"]
  description?: string | null; // Optional hostel description
  images?: HostelImage[]; // Optional hostel images
  hasAdmin: boolean; // False by default when created, true when admin is assigned
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility (if backend still returns them)
  phone?: string;
  floors?: number;
}

export interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: AdminRole;
  status: AdminStatus;
  assignedHostelId: string | null; // One-to-one mapping: one admin per hostel
  assignedHostelName?: string; // Denormalized for display
  createdAt: string; // ISO date string
  updatedAt: string;
  lastLogin?: string;
}

export interface AdminFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: AdminRole;
  assignedHostelId: string;
}

export interface AdminAPIResponse {
  success: boolean;
  message: string;
  data?: Admin;
}

export interface AdminListAPIResponse {
  success: boolean;
  admins: Admin[];
  total: number;
  page: number;
  pageSize: number;
}
