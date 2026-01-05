// src/types/booking.ts
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Level = "100" | "200" | "300" | "400";

// Backend room types (what API expects)
export type RoomType = "SINGLE" | "DOUBLE" | "TRIPLE";

// UI display labels for room types
export type RoomTitle = "One-in-one" | "Two-in-one" | "Three-in-one";

// Mapping between backend room types and UI labels
export const ROOM_TYPE_TO_LABEL: Record<RoomType, RoomTitle> = {
  SINGLE: "One-in-one",
  DOUBLE: "Two-in-one",
  TRIPLE: "Three-in-one",
};

// Reverse mapping for converting UI labels back to backend types
export const LABEL_TO_ROOM_TYPE: Record<RoomTitle, RoomType> = {
  "One-in-one": "SINGLE",
  "Two-in-one": "DOUBLE",
  "Three-in-one": "TRIPLE",
};

// Backend booking statuses (what API returns)
export type BookingStatus = 
  | "PENDING_PAYMENT" 
  | "PENDING_APPROVAL" 
  | "APPROVED"
  | "ROOM_ALLOCATED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "EXPIRED";

// UI display labels for booking statuses
export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  ROOM_ALLOCATED: "Room Allocated",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
};

export interface StudentBooking {
  id: string; // internal id
  bookingId?: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  level: Level;
  school: string;
  studentId: string;
  phone: string; // 10-15 digits
  admissionLetterName?: string; // filename or display text
  hostelName: string;
  roomTitle: RoomTitle; // UI label for display
  roomType?: RoomType; // Backend enum (optional for backward compatibility)
  preferredRoomType?: RoomType; // Backend field name
  price: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  relation: string;
  hasMedicalCondition: boolean;
  medicalCondition?: string;
  status: BookingStatus;
  allocatedRoomNumber?: number | null;
  date?: string; // ISO date string for booking/created date
}
