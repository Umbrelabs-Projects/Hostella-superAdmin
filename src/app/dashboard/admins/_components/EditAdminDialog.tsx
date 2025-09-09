"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Admin } from "@/types/common";

type Props = {
  open: boolean
  setOpen: (o: boolean) => void
  admin: Admin | null
  onSave: (form: Partial<Pick<Admin, "name" | "email" | "avatar" | "isActive">>) => Promise<Admin>
  loading: boolean
}


export function EditAdminDialog({
  open,
  setOpen,
  admin,
  onSave,
  loading,
}: Props) {
  const [form, setForm] = useState({ name: "", email: "" });

  useEffect(() => {
    if (admin) setForm({ name: admin.name, email: admin.email });
  }, [admin]);

  const handleSubmit = async () => {
    await onSave(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Admin</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
