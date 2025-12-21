import { z } from "zod";

export const createHostelSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    location: z.string().min(3, "Location must be at least 3 characters"),
    campus: z.string().min(1, "Campus is required"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .regex(/^\+?[0-9\s-()]+$/, "Invalid phone number format"),
    floors: z.number().min(1, "Must have at least 1 floor").int(),
    totalRooms: z.number().min(1, "Must have at least 1 room").int(),
    singleRooms: z.number().min(0, "Cannot be negative").int(),
    doubleRooms: z.number().min(0, "Cannot be negative").int(),
    facilities: z.array(z.string()).min(1, "Select at least one facility"),
    description: z.string().optional(), // Optional description field
  })
  .refine((data) => data.singleRooms + data.doubleRooms === data.totalRooms, {
    message: "Single rooms + Double rooms must equal Total rooms",
    path: ["totalRooms"],
  });

export const updateHostelSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    location: z.string().min(3, "Location must be at least 3 characters"),
    campus: z.string().min(1, "Campus is required"),
    totalRooms: z.number().min(1, "Must have at least 1 room").int(),
    singleRooms: z.number().min(0, "Cannot be negative").int(),
    doubleRooms: z.number().min(0, "Cannot be negative").int(),
    facilities: z.array(z.string()).min(1, "Select at least one facility"),
    description: z.string().optional(), // Optional description field
  })
  .refine((data) => data.singleRooms + data.doubleRooms === data.totalRooms, {
    message: "Single rooms + Double rooms must equal Total rooms",
    path: ["totalRooms"],
  });

export const assignAdminSchema = z.object({
  hostelId: z.string().min(1, "Hostel is required"),
  adminId: z.string().min(1, "Admin is required"),
});

export type CreateHostelFormData = z.infer<typeof createHostelSchema>;
export type UpdateHostelFormData = z.infer<typeof updateHostelSchema>;
export type AssignAdminFormData = z.infer<typeof assignAdminSchema>;
