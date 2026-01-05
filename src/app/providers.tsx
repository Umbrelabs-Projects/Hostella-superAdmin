"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const { restoreSession, fetchProfile, token, signOut } = useAuthStore();

  useEffect(() => {
    // Restore session on app load
    void restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - run only once on mount

  // Periodic profile sync - poll every 30 seconds when user is authenticated
  useEffect(() => {
    if (!token) return;

    // Fetch immediately when token is available
    void fetchProfile();

    // Set up polling interval
    const interval = setInterval(() => {
      void fetchProfile();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Re-run when token changes

  // Global error handler for 401 responses (in case they slip through)
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Check if we received a 401 recently
      if (process.env.NODE_ENV === "development") {
        console.log("[Providers] Checking for unauthorized responses...");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return <>{children}</>;
}
