"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserX } from "lucide-react";
import AdminCard from "./AdminCard";
import AdminSearch from "./AdminSearch";
import { Admin } from "@/types/admin";

interface SelectAdminSectionProps {
  admins: Admin[];
  selectedAdminId: string;
  onSelectAdmin: (adminId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentAdmin?: Admin | null;
}

export default function SelectAdminSection({
  admins,
  selectedAdminId,
  onSelectAdmin,
  searchQuery,
  onSearchChange,
  currentAdmin,
}: SelectAdminSectionProps) {
  const filteredAdmins = admins.filter((admin) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      admin.firstName.toLowerCase().includes(query) ||
      admin.lastName.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query)
    );
  });

  if (admins.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
        <UserX className="h-8 w-8 text-gray-400 mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-900 mb-1">
          No Available Admins
        </p>
        <p className="text-xs text-gray-600">
          All hostel admins are currently assigned to other hostels
        </p>
      </div>
    );
  }

  return (
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
      <AdminSearch searchQuery={searchQuery} onSearchChange={onSearchChange} />

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
              <AdminCard
                key={admin.id}
                admin={admin}
                isSelected={selectedAdminId === admin.id}
                onSelect={onSelectAdmin}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
