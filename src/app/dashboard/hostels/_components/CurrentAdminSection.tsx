"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserCheck, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Admin } from "@/types/admin";

interface CurrentAdminSectionProps {
  currentAdmin: Admin;
  loading: boolean;
  onRemove: () => void;
  hasAvailableAdmins: boolean;
}

export default function CurrentAdminSection({
  currentAdmin,
  loading,
  onRemove,
  hasAvailableAdmins,
}: CurrentAdminSectionProps) {
  const toInitials = (first?: string, last?: string) =>
    `${(first?.[0] || "").toUpperCase()}${(last?.[0] || "").toUpperCase()}`;

  return (
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
          <p className="text-sm text-gray-700 truncate">{currentAdmin.email}</p>
          <p className="text-xs text-gray-500">{currentAdmin.phone}</p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={loading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <UserX className="h-4 w-4 mr-1" />
          Remove
        </Button>
      </div>

      {hasAvailableAdmins && (
        <div className="flex items-start gap-2 mt-3 text-xs text-gray-600">
          <span className="text-blue-600">ℹ️</span>
          <span>
            You can change the assigned admin by selecting a new one below.
          </span>
        </div>
      )}
    </div>
  );
}
