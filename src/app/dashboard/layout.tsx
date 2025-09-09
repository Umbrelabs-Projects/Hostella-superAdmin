"use client";

import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/dashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"; // ✅ import SidebarProvider
import React from "react";
import { SuperAdminProvider } from "./contexts/page";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SuperAdminProvider>
      <SidebarProvider> {/* ✅ wrap here */}
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="mx-4 sm:mx-6 mt-4 h-full overflow-y-auto rounded-md bg-white p-4 shadow-sm">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </SuperAdminProvider>
  );
}
