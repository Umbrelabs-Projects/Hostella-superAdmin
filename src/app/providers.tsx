"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const { restoreSession, fetchProfile, token, initializing, signOut } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Restore session on app load
    void restoreSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - run only once on mount

  // Redirect to login if no token and trying to access protected route
  useEffect(() => {
    if (initializing) return; // Wait for session restoration

    const isProtectedRoute =
      pathname?.startsWith("/dashboard") ||
      pathname?.startsWith("/super-admin");
    const isLoginPage = pathname === "/";

    if (isProtectedRoute && !token) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "[Providers] No token and accessing protected route, redirecting to login"
        );
      }
      router.push("/");
    }

    // If on login page and has token, let them proceed
    // (middleware will handle redirect to dashboard)
  }, [token, initializing, pathname, router]);

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

  return <>{children}</>;
}
