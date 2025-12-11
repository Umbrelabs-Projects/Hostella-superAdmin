// src/app/providers.tsx

"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export function Providers({ children }: { children: React.ReactNode }) {
  const { restoreSession } = useAuthStore();

  useEffect(() => {
    // Restore session on app load
    void restoreSession();
  }, [restoreSession]);

  return <>{children}</>;
}
