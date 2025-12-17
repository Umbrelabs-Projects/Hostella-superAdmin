"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHostelStore } from "@/stores/useHostelStore";
import { useHostelApi } from "./_hooks/useHostelApi";
import HostelList from "./_components/HostelList";
import EditHostelDialog from "./_components/EditHostelDialog";
import DeleteHostelDialog from "./_components/DeleteHostelDialog";
import AssignAdminDialog from "./_components/AssignAdminDialog";
import { Hostel } from "@/types/admin";
import TableSkeleton from "@/components/_reusable_components/TableSkeleton";
import Pagination from "@/components/ui/pagination";
import CreateHostelDialog from "./_components/CreateHostelDialog";

export default function HostelsPage() {
  const { fetchHostels, loading } = useHostelApi();
  const {
    hostels,
    total,
    page,
    totalPages,
    searchQuery,
    setHostels,
    setSearchQuery,
    setPage,
    setSelectedHostel,
  } = useHostelStore();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignAdminDialogOpen, setAssignAdminDialogOpen] = useState(false);
  const [selectedHostel, setLocalSelectedHostel] = useState<Hostel | null>(
    null
  );

  const loadHostels = async () => {
    try {
      const data = await fetchHostels(page, 10, searchQuery);
      setHostels(data.hostels, data.total, data.page, data.totalPages);
    } catch (error) {
      console.error("Failed to load hostels:", error);
    }
  };

  useEffect(() => {
    loadHostels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const handleEdit = (hostel: Hostel) => {
    setLocalSelectedHostel(hostel);
    setSelectedHostel(hostel);
    setEditDialogOpen(true);
  };

  const handleDelete = (hostel: Hostel) => {
    setLocalSelectedHostel(hostel);
    setDeleteDialogOpen(true);
  };

  const handleAssignAdmin = (hostel: Hostel) => {
    setLocalSelectedHostel(hostel);
    setAssignAdminDialogOpen(true);
  };

  const handleSuccess = () => {
    loadHostels();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hostel Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage hostels, assign admins, and track capacity
          </p>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Hostel
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search hostels..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          Total Hostels: <span className="font-semibold">{total}</span>
        </div>
      </div>

      {/* Hostel List */}
      {loading ? (
        <TableSkeleton rows={5} />
      ) : (
        <HostelList
          hostels={hostels}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAssignAdmin={handleAssignAdmin}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            current={page}
            total={totalPages}
            onChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}

      {/* Dialogs */}
      <CreateHostelDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleSuccess}
      />

      <EditHostelDialog
        open={editDialogOpen}
        hostel={selectedHostel}
        onClose={() => {
          setEditDialogOpen(false);
          setLocalSelectedHostel(null);
        }}
        onSuccess={handleSuccess}
      />

      <DeleteHostelDialog
        open={deleteDialogOpen}
        hostel={selectedHostel}
        onClose={() => {
          setDeleteDialogOpen(false);
          setLocalSelectedHostel(null);
        }}
        onSuccess={handleSuccess}
      />

      <AssignAdminDialog
        open={assignAdminDialogOpen}
        hostel={selectedHostel}
        onClose={() => {
          setAssignAdminDialogOpen(false);
          setLocalSelectedHostel(null);
        }}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
