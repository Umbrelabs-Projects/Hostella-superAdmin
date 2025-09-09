"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (o: boolean) => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
};

export function DeleteAdminDialog({ open, setOpen, onConfirm, loading }: Props) {
  const handleDelete = async () => {
    await onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Admin</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this admin?</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
