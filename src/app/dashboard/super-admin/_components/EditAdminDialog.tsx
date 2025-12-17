// src/app/dashboard/super-admin/_components/EditAdminDialog.tsx

"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminStore } from "@/stores/useAdminStore";
import {
  adminEditSchema,
  AdminEditFormData,
} from "../_validations/adminSchema";
import { useAdminApi } from "../_hooks/useAdminApi";
import { Loader2, AlertCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { useHostelApi } from "../../hostels/_hooks/useHostelApi";
import { toast } from "sonner";

interface EditAdminDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditAdminDialog({
  isOpen,
  onClose,
}: EditAdminDialogProps) {
  const { loading, error, selectedAdmin, hostels } = useAdminStore();
  const { updateAdmin, fetchHostels, fetchAdmins } = useAdminApi();
  const { unassignAdmin, loading: unassignLoading } = useHostelApi();
  const [unassignOpen, setUnassignOpen] = useState(false);

  const form = useForm<AdminEditFormData>({
    resolver: zodResolver(adminEditSchema),
    defaultValues: {
      firstName: selectedAdmin?.firstName || "",
      lastName: selectedAdmin?.lastName || "",
      email: selectedAdmin?.email || "",
      phone: selectedAdmin?.phone || "",
      role: selectedAdmin?.role || "hostel-admin",
      assignedHostelId: selectedAdmin?.assignedHostelId || "",
      status: selectedAdmin?.status || "active",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = form;
  const selectedRole = watch("role");
  const selectedHostelId = watch("assignedHostelId");

  const currentHostel = useMemo(
    () => hostels.find((h) => h.id === selectedAdmin?.assignedHostelId),
    [hostels, selectedAdmin]
  );

  // Update form when selectedAdmin changes
  useEffect(() => {
    if (selectedAdmin) {
      reset({
        firstName: selectedAdmin.firstName,
        lastName: selectedAdmin.lastName,
        email: selectedAdmin.email,
        phone: selectedAdmin.phone,
        role: selectedAdmin.role,
        assignedHostelId: selectedAdmin.assignedHostelId || "",
        status: selectedAdmin.status,
      });
    }
  }, [selectedAdmin, reset]);

  // Fetch hostels when dialog opens
  useEffect(() => {
    if (isOpen) {
      void fetchHostels();
    }
  }, [isOpen, fetchHostels]);

  const handleDialogClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<AdminEditFormData> = async (data) => {
    if (!selectedAdmin) return;

    await updateAdmin(selectedAdmin.id, data);
    handleDialogClose();
  };

  // Filter available hostels (include current hostel + those without admins)
  const availableHostels = hostels.filter(
    (h) => !h.hasAdmin || h.id === selectedAdmin?.assignedHostelId
  );

  if (!selectedAdmin) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Admin - {selectedAdmin.firstName} {selectedAdmin.lastName}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            void handleSubmit(onSubmit)(e);
          }}
          className="space-y-6"
        >
          {/* Error Alert */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="e.g., John"
                {...register("firstName")}
                disabled={loading}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="e.g., Doe"
                {...register("lastName")}
                disabled={loading}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@hostella.com"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1234567890"
                {...register("phone")}
                disabled={loading}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* Role and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Admin Role *</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setValue("role", value as "super-admin" | "hostel-admin");
                  if (value === "super-admin") {
                    setValue("assignedHostelId", "");
                  }
                }}
                disabled={loading}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select admin role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super-admin">Super Admin</SelectItem>
                  <SelectItem value="hostel-admin">Hostel Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Account Status *</Label>
              <Select
                value={watch("status")}
                onValueChange={(value) => {
                  setValue(
                    "status",
                    value as "active" | "inactive" | "suspended"
                  );
                }}
                disabled={loading}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active - Full Access</SelectItem>
                  <SelectItem value="inactive">
                    Inactive - Temporarily Disabled
                  </SelectItem>
                  <SelectItem value="suspended">
                    Suspended - Account Locked
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>

          {/* Hostel Assignment */}
          <div className="space-y-2">
            <Label htmlFor="assignedHostelId">Assigned Hostel *</Label>
            <Select
              value={selectedHostelId}
              onValueChange={(value) => {
                setValue("assignedHostelId", value);
              }}
              disabled={
                loading ||
                selectedRole === "super-admin" ||
                availableHostels.length === 0
              }
            >
              <SelectTrigger id="assignedHostelId">
                <SelectValue
                  placeholder={
                    selectedRole === "super-admin"
                      ? "Super admins cannot be assigned to a hostel"
                      : "Select a hostel"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableHostels.map((hostel) => (
                  <SelectItem key={hostel.id} value={hostel.id}>
                    {hostel.name} - {hostel.location}
                    {hostel.id === selectedAdmin.assignedHostelId &&
                      " (Current)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.assignedHostelId && (
              <p className="text-sm text-red-500">
                {errors.assignedHostelId.message}
              </p>
            )}
            <p className="text-xs text-gray-500">
              ℹ️ Each hostel can only have one admin assigned at a time
            </p>
            {selectedAdmin.assignedHostelId &&
              selectedRole !== "super-admin" && (
                <div className="mt-3 p-3 rounded-md border border-amber-200 bg-amber-50">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs text-amber-800">
                      Currently assigned to:{" "}
                      <span className="font-medium">
                        {currentHostel?.name || "(Unknown Hostel)"}
                      </span>
                    </p>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={unassignLoading}
                      onClick={() => setUnassignOpen(true)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {unassignLoading ? "Unassigning..." : "Unassign"}
                    </Button>
                  </div>
                </div>
              )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleDialogClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Admin"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
      {/* Unassign Confirmation */}
      <ConfirmDialog
        open={unassignOpen}
        onOpenChange={setUnassignOpen}
        title="Unassign Admin?"
        description={
          selectedAdmin && currentHostel
            ? `Remove ${selectedAdmin.firstName} ${selectedAdmin.lastName} from ${currentHostel.name}. They will be available for another hostel.`
            : "Remove this admin from their currently assigned hostel."
        }
        confirmLabel="Unassign"
        onConfirm={async () => {
          if (!selectedAdmin || !selectedAdmin.assignedHostelId) return;
          try {
            await unassignAdmin(
              selectedAdmin.assignedHostelId,
              selectedAdmin.id
            );
            toast.success("Admin unassigned successfully");
            setValue("assignedHostelId", "");
            await Promise.all([fetchAdmins(), fetchHostels()]);
          } catch (e) {
            toast.error(
              e instanceof Error ? e.message : "Failed to unassign admin"
            );
          }
        }}
      />
    </Dialog>
  );
}
