// src/app/dashboard/super-admin/_validations/adminSchema.ts

import { z } from "zod";

const baseAdminSchema = {
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "First name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s'-]+$/,
      "Last name can only contain letters, spaces, hyphens, and apostrophes"
    ),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase(),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\s()+-]+$/,
      "Phone number can only contain digits, spaces, and symbols like +, -, (, )"
    )
    .min(10, "Phone number must be at least 10 characters")
    .max(20, "Phone number must be less than 20 characters"),

  role: z.enum(["super-admin", "hostel-admin"], {
    message: "Please select a valid role",
  }),

  // Empty string means no assignment
  assignedHostelId: z.string(),
};

export const adminFormSchema = z
  .object(baseAdminSchema)
  .superRefine((val, ctx) => {
    const isHostelAdmin = val.role === "hostel-admin";
    const hasAssignment = (val.assignedHostelId || "").trim().length > 0;
    if (isHostelAdmin && !hasAssignment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["assignedHostelId"],
        message: "Assigned hostel is required for hostel admins",
      });
    }
    if (!isHostelAdmin && hasAssignment) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["assignedHostelId"],
        message: "Super admins cannot be assigned to a hostel",
      });
    }
  });

// Transform to ensure assignedHostelId is always a string for form purposes
export const adminFormSchemaForForm = adminFormSchema.transform((data) => ({
  ...data,
  assignedHostelId: data.assignedHostelId || "",
}));

export type AdminFormData = z.infer<typeof adminFormSchema>;

// Edit schema allows optional hostel assignment for super-admins
export const adminEditSchema = adminFormSchema.safeExtend({
  status: z.enum(["active", "inactive", "suspended"], {
    message: "Please select a valid status",
  }),
});

export type AdminEditFormData = z.infer<typeof adminEditSchema>;
