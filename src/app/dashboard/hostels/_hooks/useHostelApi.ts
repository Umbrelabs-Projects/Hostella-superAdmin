import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { Hostel } from "@/types/admin";
import {
  CreateHostelFormData,
  UpdateHostelFormData,
  AssignAdminFormData,
} from "../_validations/hostelSchema";

interface PaginatedHostelResponse {
  hostels: Hostel[];
  total: number;
  page: number;
  totalPages: number;
}

export function useHostelApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHostels = async (
    page = 1,
    limit = 10,
    search = ""
  ): Promise<PaginatedHostelResponse> => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });
      const data = await apiFetch<PaginatedHostelResponse>(
        `/hostels?${params.toString()}`
      );
      return data;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch hostels";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createHostel = async (data: CreateHostelFormData): Promise<Hostel> => {
    setLoading(true);
    setError(null);
    try {
      const hostel = await apiFetch<Hostel>("/hostels", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return hostel;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create hostel";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateHostel = async (
    id: string,
    data: UpdateHostelFormData
  ): Promise<Hostel> => {
    setLoading(true);
    setError(null);
    try {
      const hostel = await apiFetch<Hostel>(`/hostels/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return hostel;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update hostel";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteHostel = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await apiFetch<{ data: null }>(`/hostels/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete hostel";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const assignAdmin = async (data: AssignAdminFormData): Promise<Hostel> => {
    setLoading(true);
    setError(null);
    try {
      const hostel = await apiFetch<Hostel>("/hostels/assign-admin", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      return hostel;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to assign admin";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const unassignAdmin = async (
    hostelId: string,
    adminId: string
  ): Promise<Hostel> => {
    setLoading(true);
    setError(null);
    try {
      const hostel = await apiFetch<Hostel>(`/hostels/unassign-admin`, {
        method: "PATCH",
        body: JSON.stringify({ hostelId, adminId }),
      });
      return hostel;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to unassign admin";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadHostelImage = async (
    hostelId: string,
    imageFile: File
  ): Promise<{ hostel: Hostel; imageUrl: string }> => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      // Get token from cookie (same way as apiFetch does)
      const getAuthToken = (): string | null => {
        if (typeof document === "undefined") return null;
        const cookies = document.cookie.split("; ");
        const tokenCookie = cookies.find((c) => c.startsWith("auth-token="));
        if (tokenCookie) {
          return tokenCookie.substring("auth-token=".length);
        }
        return null;
      };

      const baseUrl = process.env.API_URL ?? "";
      const versionedEndpoint = `/api/v1/hostels/${hostelId}/upload-image`;
      const token = getAuthToken();

      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${baseUrl}${versionedEndpoint}`, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `API error: ${res.status}`);
      }

      const json = await res.json();
      // Handle response envelope
      if (
        json &&
        typeof json === "object" &&
        "success" in json &&
        "data" in json
      ) {
        return json.data as { hostel: Hostel; imageUrl: string };
      }
      return json as { hostel: Hostel; imageUrl: string };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to upload image";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchHostels,
    createHostel,
    updateHostel,
    deleteHostel,
    assignAdmin,
    unassignAdmin,
    uploadHostelImage,
  };
}
