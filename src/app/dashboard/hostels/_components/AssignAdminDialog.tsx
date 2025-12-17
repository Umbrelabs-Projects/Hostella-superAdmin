"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useHostelApi } from "../_hooks/useHostelApi";
import { useAdminStore } from "@/stores/useAdminStore";
import { Hostel, Admin } from "@/types/admin";
import { toast } from "sonner";

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
  const { assignAdmin, loading } = useHostelApi();
  const admins = useAdminStore((s) => s.admins);
  const [selectedAdminId, setSelectedAdminId] = useState("");
  const [availableAdmins, setAvailableAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    // Filter admins without hostel assignments
    const unassigned = admins.filter(
      (admin) => admin.role === "hostel-admin" && !admin.assignedHostelId
    );
    setAvailableAdmins(unassigned);
  }, [admins]);

  const selectedAdmin = availableAdmins.find((a) => a.id === selectedAdminId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hostel || !selectedAdminId) return;

    try {
      await assignAdmin({ hostelId: hostel.id, adminId: selectedAdminId });
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

  if (!hostel) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Admin to {hostel.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="admin">
              Select Admin <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedAdminId} onValueChange={setSelectedAdminId}>
              <SelectTrigger>
                <SelectValue placeholder="Select an admin" />
              </SelectTrigger>
              <SelectContent>
                {availableAdmins.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-gray-500">
                    No unassigned admins available
                  </div>
                ) : (
                  availableAdmins.map((admin) => (
                    <SelectItem key={admin.id} value={admin.id}>
                      {admin.firstName} {admin.lastName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {selectedAdmin && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 space-y-1 text-sm">
              <div>
                <span className="text-gray-600">Email:</span>
                <span className="ml-2 font-medium">{selectedAdmin.email}</span>
              </div>
              <div>
                <span className="text-gray-600">Phone:</span>
                <span className="ml-2 font-medium">{selectedAdmin.phone}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className="ml-2 font-medium capitalize">
                  {selectedAdmin.status}
                </span>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedAdminId}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Assigning..." : "Assign Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
