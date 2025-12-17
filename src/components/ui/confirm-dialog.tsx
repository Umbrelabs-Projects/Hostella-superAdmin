"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: "default" | "destructive";
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = "Confirm",
  description,
  confirmLabel = "OK",
  onConfirm,
  confirmVariant = "destructive",
}: ConfirmDialogProps) {
  const handleConfirm = React.useCallback(() => {
    onConfirm?.();
    onOpenChange(false);
  }, [onConfirm, onOpenChange]);

  const handleCancel = React.useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {description || "Please confirm this action."}
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant={confirmVariant} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
