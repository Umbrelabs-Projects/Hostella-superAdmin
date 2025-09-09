import { SidebarTab } from "@/types/common";
import {HomeIcon, Settings2, User } from "lucide-react";

export const SidebarTabs: SidebarTab[] = [
  { title: "Overview", url: "/dashboard/dashboard-overview", icon: HomeIcon },
  { title: "Admins", url: "/dashboard/admins", icon: User },
  { title: "Settings", url: "/dashboard/settings", icon: Settings2 },
];

export const PAGE_TITLES: Record<string, string> = {
  "/dashboard/dashboard-overview": "Overview",
  "/dashboard/admins": "Admins",
  "/dashboard/settings": "Settings",
};
