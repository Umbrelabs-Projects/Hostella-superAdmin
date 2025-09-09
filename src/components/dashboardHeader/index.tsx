"use client";

import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { PAGE_TITLES } from "@/lib/constants";
import { BellDot, SearchIcon, Settings2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSuperAdmin } from "@/app/dashboard/contexts/page";

export default function DashboardHeader() {
  const { currentUser } = useSuperAdmin(); // ✅ get user if needed
  const pathname = usePathname();
  const dynamicTitle = PAGE_TITLES[pathname] || "Dashboard Overview";

  return (
    <div className="sticky z-10 top-0 flex gap-4 justify-between items-center w-full bg-white border-b px-4 py-3">
      {/* Page title */}
      <div className="flex gap-2 items-center">
        <SidebarTrigger />
        <h3 className="font-bold text-lg text-[#739C7F]">{dynamicTitle}</h3>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            id="search"
            type="search"
            placeholder="Search..."
            className="rounded-lg bg-background pl-8"
          />
        </div>
        <Button variant="ghost" size="icon">
          <Settings2 />
        </Button>
        <Button variant="ghost" size="icon">
          <BellDot className="text-red-500" />
        </Button>

        {/* profile avatar (pulled from context later if available) */}
        <div className="size-10 rounded-full flex-shrink-0 bg-gray-300"></div>
      </div>
    </div>
  );
}
