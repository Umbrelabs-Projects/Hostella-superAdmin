"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useHostelApi } from "../_hooks/useHostelApi";
import { Hostel } from "@/types/admin";
import { toast } from "sonner";

interface DeleteHostelDialogProps {
  open: boolean;
  hostel: Hostel | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteHostelDialog({
  open,
  hostel,
  onClose,
  onSuccess,
}: DeleteHostelDialogProps) {
  const { deleteHostel, loading } = useHostelApi();

  const handleDelete = async () => {
    if (!hostel) return;

    try {
      await deleteHostel(hostel.id);
      toast.success("Hostel deleted successfully");
      onSuccess();
      onClose();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete hostel";
      toast.error(message);
    }
  };

  if (!hostel) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle>Delete Hostel</DialogTitle>
          </div>
          <DialogDescription className="mt-3">
            Are you sure you want to delete <strong>{hostel.name}</strong>? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
          <strong>Warning:</strong> Deletion will fail if this hostel has rooms
          assigned to it. Please ensure all rooms are removed first.
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete Hostel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
