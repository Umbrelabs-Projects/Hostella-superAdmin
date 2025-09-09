"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Admin } from "@/types/common";

type Props = {
  admins: Admin[];
  loading: boolean;
  search: string;
  setSearch: (s: string) => void;
  onEdit: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
};

export function AdminTable({
  admins,
  loading,
  search,
  setSearch,
  onEdit,
  onDelete,
}: Props) {
  const filtered = admins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <Input
          placeholder="Search admins..."
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading && (
          <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
        )}
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No admins found
                </td>
              </tr>
            )}
            {filtered.map((admin) => (
              <tr key={admin.id} className="border-t">
                <td className="px-4 py-2">{admin.name}</td>
                <td className="px-4 py-2">{admin.email}</td>
                <td
                  className={cn(
                    "px-4 py-2 font-medium",
                    admin.isActive ? "text-green-600" : "text-red-500"
                  )}
                >
                  {admin.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-2 flex gap-2 justify-end">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(admin)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(admin)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
