"use client";

import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHostelStore } from "@/stores/useHostelStore";
import { useHostelApi } from "./_hooks/useHostelApi";
import { useAdminApi } from "../super-admin/_hooks/useAdminApi";
import HostelList from "./_components/HostelList";
import EditHostelDialog from "./_components/EditHostelDialog";
import DeleteHostelDialog from "./_components/DeleteHostelDialog";
import AssignAdminDialog from "./_components/AssignAdminDialog";
import { Hostel } from "@/types/admin";
import TableSkeleton from "@/components/_reusable_components/TableSkeleton";
import Pagination from "@/components/ui/pagination";
import CreateHostelDialog from "./_components/CreateHostelDialog";

export default function HostelsPage() {
  const { fetchHostels, enrichHostelsWithDetails, loading } = useHostelApi();
  const { fetchAdmins } = useAdminApi();
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
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Keep admin list fresh (hostel-admins only) on mount and when tab becomes visible
  useEffect(() => {
    const loadAdmins = async () => {
      if (document.visibilityState !== "visible") return;
      await fetchAdmins(1, 200, "", "hostel-admin", "all");
    };

    void loadAdmins();

    const onVisibility = () => {
      if (document.visibilityState === "visible") void loadAdmins();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAdmins]);

  // Revalidate hostels when tab becomes visible to catch external changes
  useEffect(() => {
    const refreshHostels = async () => {
      if (document.visibilityState !== "visible") return;
      try {
        const data = await fetchHostels(page, 10, searchQuery);
        const enriched = await enrichHostelsWithDetails(data.hostels);
        setHostels(enriched, data.total, data.page, data.totalPages);
      } catch (error) {
        console.error("Failed to refresh hostels on visibility:", error);
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") void refreshHostels();
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery, fetchHostels, enrichHostelsWithDetails, setHostels]);

  // Initial and on-change fetch
  useEffect(() => {
    const loadHostels = async () => {
      try {
        const data = await fetchHostels(page, 10, searchQuery);
        // Enrich with detailed info to get room counts
        const enriched = await enrichHostelsWithDetails(data.hostels);
        setHostels(enriched, data.total, data.page, data.totalPages);
      } catch (error) {
        console.error("Failed to load hostels:", error);
      }
    };

    loadHostels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  // Debounce search input updates to reduce fetch frequency
  useEffect(() => {
    const id = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

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

  const handleSuccess = async () => {
    setPage(1);
    try {
      const [hostelsData] = await Promise.all([
        fetchHostels(1, 10, searchQuery),
        fetchAdmins(1, 200, "", "hostel-admin", "all"),
      ]);

      setHostels(
        hostelsData.hostels,
        hostelsData.total,
        1,
        hostelsData.totalPages
      );
    } catch (error) {
      console.error("Failed to reload hostels:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Stats */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search hostels..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-lg font-semibold text-gray-900">
            Total: <span className="text-blue-600">{hostels.length}</span>
          </div>
        </div>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Hostel
        </Button>
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
      {/* Removed triple room count summary as requested */}

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
