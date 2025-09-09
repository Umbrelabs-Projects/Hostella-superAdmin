"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Admin, NewAdmin } from "@/types/common";

type CurrentUser = { id: string; name: string; email: string; role: "superadmin" };

type SuperAdminContextType = {
  admins: Admin[];
  loading: boolean;
  error?: string | null;
  fetchAdmins: () => Promise<void>;
  createAdmin: (payload: NewAdmin) => Promise<Admin>;
  updateAdmin: (
    id: string,
    payload: Partial<Pick<Admin, "name" | "email" | "avatar" | "isActive">>
  ) => Promise<Admin>;
  deleteAdmin: (id: string) => Promise<void>;
  currentUser: CurrentUser | null;
  setCurrentUser: (u: CurrentUser | null) => void;
  logout: () => void;
};

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export const SuperAdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const router = useRouter();

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admins");
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as Admin[];
      setAdmins(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch admins");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAdmins();
    const stored = localStorage.getItem("superAdminUser");
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored) as CurrentUser);
      } catch {}
    }
  }, [fetchAdmins]);

  const createAdmin = async (payload: NewAdmin) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, role: "admin" }),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = (await res.json()) as Admin;
      setAdmins((s) => [created, ...s]);
      return created;
    } finally {
      setLoading(false);
    }
  };

  const updateAdmin = async (
    id: string,
    payload: Partial<Pick<Admin, "name" | "email" | "avatar" | "isActive">>
  ) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admins/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const updated = (await res.json()) as Admin;
      setAdmins((s) => s.map((a) => (a.id === id ? updated : a)));
      return updated;
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admins/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      setAdmins((s) => s.filter((a) => a.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("superAdminUser");
    setCurrentUser(null);
    router.push("/signIn");
  };

  return (
    <SuperAdminContext.Provider
      value={{
        admins,
        loading,
        error,
        fetchAdmins,
        createAdmin,
        updateAdmin,
        deleteAdmin,
        currentUser,
        setCurrentUser,
        logout,
      }}
    >
      {children}
    </SuperAdminContext.Provider>
  );
};

export const useSuperAdmin = () => {
  const ctx = useContext(SuperAdminContext);
  if (!ctx) throw new Error("useSuperAdmin must be used inside SuperAdminProvider");
  return ctx;
};
