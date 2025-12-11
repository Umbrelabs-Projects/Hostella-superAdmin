// src/app/dashboard/super-admin/_hooks/useAdminApi.ts

import { useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { Admin, Hostel, AdminFormData, AdminRole, AdminStatus } from "@/types/admin";
import { useAdminStore } from "@/stores/useAdminStore";
import { toast } from "sonner";

export function useAdminApi() {
  const {
    setAdmins,
    setHostels,
    setTotalAdmins,
    setLoading,
    setError,
    setSuccess,
    updateAdmin: updateAdminInStore,
    addAdmin: addAdminToStore,
    removeAdmin: removeAdminFromStore,
  } = useAdminStore();

  const fetchAdmins = useCallback(
    async (
      page: number = 1,
      pageSize: number = 10,
      search: string = "",
      role: "all" | AdminRole = "all",
      status: "all" | AdminStatus = "all",
    ) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          pageSize: pageSize.toString(),
        });

        if (search) params.append("search", search);
        if (role !== "all") params.append("role", role);
        if (status !== "all") params.append("status", status);

        const response = await apiFetch<{
          admins: Admin[];
          total: number;
          page: number;
          pageSize: number;
        }>(`/admins?${params.toString()}`, {
          method: "GET",
        });

        setAdmins(response.admins);
        setTotalAdmins(response.total);
        setLoading(false);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to fetch admins";
        setError(message);
        toast.error(message);
        setLoading(false);
      }
    },
    [setAdmins, setError, setLoading, setTotalAdmins],
  );

  const fetchHostels = useCallback(async () => {
    try {
      const hostels = await apiFetch<Hostel[]>("/hostels", {
        method: "GET",
      });

      setHostels(hostels);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch hostels";
      setError(message);
      toast.error(message);
    }
  }, [setError, setHostels]);

  const createAdmin = useCallback(
    async (data: AdminFormData) => {
      setLoading(true);
      setError(null);
      try {
        const newAdmin = await apiFetch<Admin>("/admins", {
          method: "POST",
          body: JSON.stringify(data),
        });

        addAdminToStore(newAdmin);
        setSuccess("Admin created successfully");
        toast.success("Admin created successfully");
        setLoading(false);
        return newAdmin;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to create admin";
        setError(message);
        toast.error(message);
        setLoading(false);
        throw error;
      }
    },
    [addAdminToStore, setError, setLoading, setSuccess],
  );

  const updateAdmin = useCallback(
    async (adminId: string, data: Partial<AdminFormData>) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await apiFetch<Admin>(`/admins/${adminId}`, {
          method: "PUT",
          body: JSON.stringify(data),
        });

        updateAdminInStore(updated);
        setSuccess("Admin updated successfully");
        toast.success("Admin updated successfully");
        setLoading(false);
        return updated;
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to update admin";
        setError(message);
        toast.error(message);
        setLoading(false);
        throw error;
      }
    },
    [setError, setLoading, setSuccess, updateAdminInStore],
  );

  const deleteAdmin = useCallback(
    async (adminId: string) => {
      setLoading(true);
      setError(null);
      try {
        await apiFetch(`/admins/${adminId}`, {
          method: "DELETE",
        });

        removeAdminFromStore(adminId);
        setSuccess("Admin deleted successfully");
        toast.success("Admin deleted successfully");
        setLoading(false);
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Failed to delete admin";
        setError(message);
        toast.error(message);
        setLoading(false);
        throw error;
      }
    },
    [removeAdminFromStore, setError, setLoading, setSuccess],
  );

  return {
    fetchAdmins,
    fetchHostels,
    createAdmin,
    updateAdmin,
    deleteAdmin,
  };
}
