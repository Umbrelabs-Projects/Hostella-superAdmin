import { SidebarTab } from "@/types/common";
import { HomeIcon } from "lucide-react";

export const SidebarTabs: SidebarTab[]=[
    {title:"Overview",url:"/dashboard/dashboard-overview",icon: HomeIcon},
    {title:"Admins",url:"/dashboard/admins",icon: HomeIcon},
    {title:"Settings",url:"/dashboard/settings",icon: HomeIcon},
]

export const PAGE_TITLES : Record<string,string> = {
    "/dashboard/dashboard-overview":"Overview",
    "/dashboard/admins":"Admins",
    "/dashboard/settings":"Settings",
}