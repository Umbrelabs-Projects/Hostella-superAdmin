"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface AdminSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function AdminSearch({
  searchQuery,
  onSearchChange,
}: AdminSearchProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
      <Input
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 h-11 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}
