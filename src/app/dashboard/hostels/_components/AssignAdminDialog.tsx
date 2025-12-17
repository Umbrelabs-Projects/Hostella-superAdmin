"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useHostelApi } from "../_hooks/useHostelApi";
import { useAdminStore } from "@/stores/useAdminStore";
import { useAdminApi } from "../../super-admin/_hooks/useAdminApi";
import { Hostel, Admin } from "@/types/admin";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import CurrentAdminSection from "./CurrentAdminSection";
import SelectAdminSection from "./SelectAdminSection";

interface AssignAdminDialogProps {
  open: boolean;
  hostel: Hostel | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AssignAdminDialog({
  open,
  hostel,
  onClose,
  onSuccess,
}: AssignAdminDialogProps) {
  const { assignAdmin, unassignAdmin, loading } = useHostelApi();
  const admins = useAdminStore((s) => s.admins);
  const { fetchAdmins } = useAdminApi();
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [availableAdmins, setAvailableAdmins] = useState<Admin[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [unassignOpen, setUnassignOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch latest hostel-admins when dialog opens
  useEffect(() => {
    if (open) {
      void fetchAdmins(1, 200, "", "hostel-admin", "all");
    }
  }, [open, fetchAdmins]);

  useEffect(() => {
    if (!hostel) {
      setCurrentAdmin(null);
      return;
    }

    // Filter admins without hostel assignments
    const unassigned = admins.filter(
      (admin) => admin.role === "hostel-admin" && !admin.assignedHostelId
    );
    setAvailableAdmins(unassigned);

    // Find the currently assigned admin to this hostel
    const assigned = admins.find(
      (admin) => admin.assignedHostelId === hostel.id
    );
    setCurrentAdmin(assigned || null);
  }, [admins, hostel]);

  const handleAssignAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostel || !selectedAdminId) return;

    try {
      await assignAdmin({ hostelId: hostel.id, adminId: selectedAdminId });
      await fetchAdmins(1, 200, "", "hostel-admin", "all");
      toast.success("Admin assigned successfully");
      onSuccess();
      onClose();
      setSelectedAdminId("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to assign admin"
      );
    }
  };

  const handleUnassignConfirm = async () => {
    if (!hostel || !currentAdmin) return;
    try {
      await unassignAdmin(hostel.id, currentAdmin.id);
      await fetchAdmins(1, 200, "", "hostel-admin", "all");
      toast.success("Admin unassigned successfully");
      onSuccess();
      onClose();
      setSelectedAdminId("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to unassign admin"
      );
    }
  };

  if (!hostel) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0 max-h-[90vh] overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b space-y-2">
          <div className="flex-col flex md:flex-row justify-between items-center md:px-2">
            <DialogTitle className="text-2xl font-semibold tracking-tight">
              {currentAdmin ? "Manage" : "Assign"} Admin
            </DialogTitle>
            <DialogDescription className="text-base">
              {hostel.name}
            </DialogDescription>
          </div>
          <p className="text-sm text-muted-foreground">
            {currentAdmin
              ? "Change or remove the admin assigned to this hostel"
              : "Select an admin to manage this hostel"}
          </p>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Current Admin Section */}
          {currentAdmin && (
            <CurrentAdminSection
              currentAdmin={currentAdmin}
              loading={loading}
              onRemove={() => setUnassignOpen(true)}
              hasAvailableAdmins={availableAdmins.length > 0}
            />
          )}

          {/* Admin Selection Section */}
          {availableAdmins.length > 0 ? (
            <SelectAdminSection
              admins={availableAdmins}
              selectedAdminId={selectedAdminId}
              onSelectAdmin={setSelectedAdminId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              currentAdmin={currentAdmin}
            />
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
              <div className="h-8 w-8 text-gray-400 mx-auto mb-3">❌</div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                No Available Admins
              </p>
              <p className="text-xs text-gray-600">
                All hostel admins are currently assigned to other hostels
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50/50 flex flex-row justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-10 px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignAdmin}
            disabled={
              loading || !selectedAdminId || availableAdmins.length === 0
            }
            className="h-10 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : currentAdmin
              ? "Change Admin"
              : "Assign Admin"}
          </Button>
        </DialogFooter>
      </DialogContent>

      <ConfirmDialog
        open={unassignOpen}
        onOpenChange={setUnassignOpen}
        title="Remove Admin Assignment"
        description={
          currentAdmin && hostel
            ? `${currentAdmin.firstName} ${currentAdmin.lastName} will be removed from ${hostel.name} and will become available for other hostel assignments.`
            : "Remove this admin from the hostel."
        }
        confirmLabel="Remove Admin"
        confirmVariant="destructive"
        onConfirm={handleUnassignConfirm}
      />
    </Dialog>
  );
}
