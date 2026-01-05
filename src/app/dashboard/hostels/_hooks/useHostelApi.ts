import { useState, useCallback } from "react";
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

  const fetchHostels = useCallback(
    async (
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
        
        // Debug: Check what backend actually sends
        if (process.env.NODE_ENV === "development" && data.hostels.length > 0) {
          console.log("[HostelAPI] Backend response sample:", {
            hostel: data.hostels[0].name,
            hasRoomCounts: {
              singleRooms: data.hostels[0].singleRooms,
              doubleRooms: data.hostels[0].doubleRooms,
              tripleRooms: data.hostels[0].tripleRooms,
              totalRooms: data.hostels[0].totalRooms,
            },
            allFields: Object.keys(data.hostels[0]),
          });
        }
        
        return data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch hostels";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchHostelById = useCallback(async (id: string): Promise<Hostel> => {
    setLoading(true);
    setError(null);
    try {
      // The API returns { success: true, data: { hostel: ... } }
      // apiFetch assumes the response is the data key if it exists, or the whole response
      // We might need to adjust based on how apiFetch is implemented, but typically:
      // If apiFetch returns T, we expect T to match the response structure.
      // Based on fetchHostels, it returns PaginatedHostelResponse directly.
      // Based on the user guide: GET /api/v1/hostels/{id} returns { success: true, data: { hostel: ... } }

      const response = await apiFetch<{ hostel: Hostel }>(`/hostels/${id}`);
      return response.hostel;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch hostel details";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const enrichHostelsWithDetails = useCallback(
    async (hostels: Hostel[]): Promise<Hostel[]> => {
      try {
        // Fetch detailed info for all hostels in parallel
        const detailedHostels = await Promise.all(
          hostels.map(async (hostel) => {
            try {
              const detailed = await fetchHostelById(hostel.id);
              return detailed;
            } catch (err) {
              // If enrichment fails, return original with logging
              console.warn(`Failed to enrich hostel ${hostel.id}:`, err);
              return hostel;
            }
          })
        );
        return detailedHostels;
      } catch (err) {
        console.error("Failed to enrich hostels:", err);
        return hostels; // Return original if enrichment completely fails
      }
    },
    [fetchHostelById]
  );

  const createHostel = async (data: CreateHostelFormData): Promise<Hostel> => {
    setLoading(true);
    setError(null);
    try {
      // Map form data to API format (field names already match API expectations)
      const apiData: Record<string, unknown> = {
        name: data.name,
        location: data.location ?? null,
        campus: data.campus ?? null,
        phoneNumber: data.phoneNumber ?? null,
        noOfFloors: data.noOfFloors ?? null,
        facilities: data.facilities ?? [],
        description: data.description ?? null,
      };

      // Include room fields if provided (totalRooms must be > 0, singleRooms/doubleRooms/tripleRooms can be 0)
      if (data.totalRooms !== undefined && data.totalRooms > 0) {
        apiData.totalRooms = data.totalRooms;
        // If totalRooms is provided, also include singleRooms, doubleRooms, tripleRooms
        if (data.singleRooms !== undefined)
          apiData.singleRooms = data.singleRooms;
        if (data.doubleRooms !== undefined)
          apiData.doubleRooms = data.doubleRooms;
        if (data.tripleRooms !== undefined)
          apiData.tripleRooms = data.tripleRooms;
      }

      const hostel = await apiFetch<Hostel>("/hostels", {
        method: "POST",
        body: JSON.stringify(apiData),
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
      // Map form data to API format, only include defined fields
      const apiData: Record<string, unknown> = {};
      if (data.name !== undefined) apiData.name = data.name;
      if (data.location !== undefined) apiData.location = data.location ?? null;
      if (data.campus !== undefined) apiData.campus = data.campus ?? null;
      if (data.phoneNumber !== undefined)
        apiData.phoneNumber = data.phoneNumber ?? null;
      if (data.noOfFloors !== undefined)
        apiData.noOfFloors = data.noOfFloors ?? null;
      // Include room fields if provided (totalRooms must be > 0)
      if (data.totalRooms !== undefined && data.totalRooms > 0) {
        apiData.totalRooms = data.totalRooms;
        if (data.singleRooms !== undefined)
          apiData.singleRooms = data.singleRooms;
        if (data.doubleRooms !== undefined)
          apiData.doubleRooms = data.doubleRooms;
        if (data.tripleRooms !== undefined)
          apiData.tripleRooms = data.tripleRooms;
      }
      if (data.facilities !== undefined) apiData.facilities = data.facilities;
      if (data.description !== undefined)
        apiData.description = data.description ?? null;

      const hostel = await apiFetch<Hostel>(`/hostels/${id}`, {
        method: "PATCH",
        body: JSON.stringify(apiData),
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
    fetchHostelById,
    enrichHostelsWithDetails,
    createHostel,
    updateHostel,
    deleteHostel,
    assignAdmin,
    unassignAdmin,
    uploadHostelImage,
  };
}
