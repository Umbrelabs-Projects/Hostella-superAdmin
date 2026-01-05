import { z } from "zod";

export const createHostelSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    location: z.string().optional().nullable(),
    campus: z.string().optional().nullable(),
    phoneNumber: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => !val || val.length >= 10,
        "Phone number must be at least 10 digits"
      )
      .refine(
        (val) => !val || /^\+?[0-9\s-()]+$/.test(val),
        "Invalid phone number format"
      ),
    noOfFloors: z.string().optional().nullable(),
    totalRooms: z.number().int().positive().optional(),
    singleRooms: z.number().int().min(0).optional(),
    doubleRooms: z.number().int().min(0).optional(),
    tripleRooms: z.number().int().min(0).optional(),
    facilities: z.array(z.string()).default([]),
    description: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.totalRooms !== undefined && data.totalRooms > 0) {
        return (
          (data.singleRooms || 0) +
            (data.doubleRooms || 0) +
            (data.tripleRooms || 0) ===
          data.totalRooms
        );
      }
      return true;
    },
    {
      message: "Single + Double + Triple rooms must equal Total rooms",
      path: ["totalRooms"],
    }
  );

export const updateHostelSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    location: z.string().optional().nullable(),
    campus: z.string().optional().nullable(),
    phoneNumber: z
      .string()
      .optional()
      .nullable()
      .refine(
        (val) => !val || val.length >= 10,
        "Phone number must be at least 10 digits"
      )
      .refine(
        (val) => !val || /^\+?[0-9\s-()]+$/.test(val),
        "Invalid phone number format"
      ),
    noOfFloors: z.string().optional().nullable(),
    totalRooms: z.number().int().positive().optional(),
    singleRooms: z.number().int().min(0).optional(),
    doubleRooms: z.number().int().min(0).optional(),
    tripleRooms: z.number().int().min(0).optional(),
    facilities: z.array(z.string()).optional(),
    description: z.string().optional().nullable(),
  })
  .refine(
    (data) => {
      if (data.totalRooms !== undefined && data.totalRooms > 0) {
        return (
          (data.singleRooms || 0) +
            (data.doubleRooms || 0) +
            (data.tripleRooms || 0) ===
          data.totalRooms
        );
      }
      return true;
    },
    {
      message: "Single + Double + Triple rooms must equal Total rooms",
      path: ["totalRooms"],
    }
  );

export const assignAdminSchema = z.object({
  hostelId: z.string().min(1, "Hostel is required"),
  adminId: z.string().min(1, "Admin is required"),
});

export type CreateHostelFormData = z.infer<typeof createHostelSchema>;
export type UpdateHostelFormData = z.infer<typeof updateHostelSchema>;
export type AssignAdminFormData = z.infer<typeof assignAdminSchema>;
