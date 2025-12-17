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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useHostelApi } from "../_hooks/useHostelApi";
import { useAdminStore } from "@/stores/useAdminStore";
import { useAdminApi } from "../../super-admin/_hooks/useAdminApi";
import { Hostel, Admin } from "@/types/admin";
import { toast } from "sonner";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, Search, UserCheck, UserX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const selectedAdmin = availableAdmins.find((a) => a.id === selectedAdminId);

  const filteredAdmins = availableAdmins.filter((admin) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      admin.firstName.toLowerCase().includes(query) ||
      admin.lastName.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query)
    );
  });

  const toInitials = (first?: string, last?: string) =>
    `${(first?.[0] || "").toUpperCase()}${(last?.[0] || "").toUpperCase()}`;

  const prettyStatus = (status?: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "";
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
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-linear-to-br from-gray-50 to-white">
          <DialogTitle className="text-2xl font-semibold tracking-tight text-gray-900">
            {currentAdmin ? "Manage" : "Assign"} Admin
          </DialogTitle>
          <DialogDescription className="text-base text-gray-600 mt-1">
            {hostel.name}
          </DialogDescription>
          <p className="text-sm text-gray-500 mt-2">
            {currentAdmin
              ? "Change or remove the admin assigned to this hostel"
              : "Select an admin to manage this hostel"}
          </p>
        </DialogHeader>

        <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[calc(90vh-170px)]">
          {/* Current Admin Section */}
          {currentAdmin && (
            <div className="rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-600 text-white shadow-sm">
                    <UserCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">
                      Current Admin
                    </span>
                    <span className="text-xs text-gray-600">
                      Actively managing this hostel
                    </span>
                  </div>
                </div>
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 px-3 py-1 shadow-sm">
                  Active
                </Badge>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-all">
                <Avatar className="h-12 w-12 border-2 border-blue-200">
                  <AvatarImage
                    alt={`${currentAdmin.firstName} ${currentAdmin.lastName}`}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {toInitials(currentAdmin.firstName, currentAdmin.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {currentAdmin.firstName} {currentAdmin.lastName}
                  </p>
                  <p className="text-sm text-gray-700 truncate">
                    {currentAdmin.email}
                  </p>
                  <p className="text-xs text-gray-500">{currentAdmin.phone}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setUnassignOpen(true)}
                  disabled={loading}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              </div>

              {availableAdmins.length > 0 && (
                <div className="flex items-start gap-2 mt-3 text-xs text-gray-600">
                  <span className="text-blue-600">ℹ️</span>
                  <span>
                    You can change the assigned admin by selecting a new one
                    below.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Admin Selection */}
          {availableAdmins.length > 0 ? (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold text-gray-900">
                  {currentAdmin ? "Select New Admin" : "Select Admin"}
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Choose from available hostel admins
                </p>
              </div>

              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-11 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Admin Cards */}
              <ScrollArea className="h-80 rounded-xl border border-gray-200 bg-gray-50/70">
                <div className="p-3 space-y-2.5">
                  {filteredAdmins.length === 0 ? (
                    <div className="text-center py-10 px-4 text-sm text-gray-600">
                      {searchQuery
                        ? "No admins match your search"
                        : "No unassigned admins available"}
                    </div>
                  ) : (
                    filteredAdmins.map((admin) => (
                      <button
                        key={admin.id}
                        type="button"
                        onClick={() => setSelectedAdminId(admin.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          selectedAdminId === admin.id
                            ? "border-blue-500 bg-linear-to-br from-blue-50 to-indigo-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="relative">
                            <Avatar
                              className={`h-12 w-12 border-2 ${
                                selectedAdminId === admin.id
                                  ? "border-blue-400"
                                  : "border-gray-200"
                              }`}
                            >
                              <AvatarImage
                                alt={`${admin.firstName} ${admin.lastName}`}
                              />
                              <AvatarFallback
                                className={`text-xs font-semibold ${
                                  selectedAdminId === admin.id
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {toInitials(admin.firstName, admin.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            {selectedAdminId === admin.id && (
                              <div className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                <Check className="h-3 w-3" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p
                                className={`text-sm font-semibold truncate ${
                                  selectedAdminId === admin.id
                                    ? "text-blue-900"
                                    : "text-gray-900"
                                }`}
                              >
                                {admin.firstName} {admin.lastName}
                              </p>
                            </div>
                            <p className="text-xs text-gray-600 truncate mb-1.5">
                              {admin.email}
                            </p>
                            <Badge
                              variant="secondary"
                              className={`text-[10px] px-2 py-0.5 font-medium ${
                                selectedAdminId === admin.id
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {prettyStatus(admin.status)}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
              <UserX className="h-8 w-8 text-gray-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-900 mb-1">
                No Available Admins
              </p>
              <p className="text-xs text-gray-600">
                All hostel admins are currently assigned to other hostels
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="h-11 px-5 font-semibold"
          >
            Cancel
          </Button>
          {availableAdmins.length > 0 && (
            <Button
              onClick={handleAssignAdmin}
              disabled={loading || !selectedAdminId}
              className="h-11 px-6 bg-blue-600 hover:bg-blue-700 font-semibold shadow-sm disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : currentAdmin
                ? "Change Admin"
                : "Assign Admin"}
            </Button>
          )}
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
