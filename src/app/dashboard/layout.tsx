"use client";

import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/dashboardHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { SuperAdminProvider } from "./contexts/SuperAdminContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SuperAdminProvider>
      <SidebarProvider>
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
