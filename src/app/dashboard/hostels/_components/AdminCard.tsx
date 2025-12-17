"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Admin } from "@/types/admin";

interface AdminCardProps {
  admin: Admin;
  isSelected: boolean;
  onSelect: (adminId: string) => void;
}

export default function AdminCard({
  admin,
  isSelected,
  onSelect,
}: AdminCardProps) {
  const toInitials = (first?: string, last?: string) =>
    `${(first?.[0] || "").toUpperCase()}${(last?.[0] || "").toUpperCase()}`;

  const prettyStatus = (status?: string) =>
    status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  return (
    <button
      type="button"
      onClick={() => onSelect(admin.id)}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar
            className={`h-10 w-10 border-2 ${
              isSelected ? "border-blue-400" : "border-gray-200"
            }`}
          >
            <AvatarImage alt={`${admin.firstName} ${admin.lastName}`} />
            <AvatarFallback
              className={`text-xs font-semibold ${
                isSelected
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {toInitials(admin.firstName, admin.lastName)}
            </AvatarFallback>
          </Avatar>
          {isSelected && (
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
              <Check className="h-2.5 w-2.5" />
            </div>
          )}
        </div>

        {/* Name and Email */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-semibold truncate ${
              isSelected ? "text-blue-900" : "text-gray-900"
            }`}
          >
            {admin.firstName} {admin.lastName}
          </p>
          <p className="text-xs text-gray-600 truncate">{admin.email}</p>
        </div>

        {/* Status Badge */}
        <div className="flex-shrink-0">
          <Badge
            variant="secondary"
            className={`text-[10px] px-2 py-0.5 font-medium ${
              isSelected
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {prettyStatus(admin.status)}
          </Badge>
        </div>
      </div>
    </button>
  );
}
