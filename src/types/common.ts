import { LucideIcon } from "lucide-react";

export interface SidebarTab {
    title: string;
    url: string;
    icon:LucideIcon;
}

export interface socialIcons {
    icon: LucideIcon;
    url: string;
}

export interface NavLink {
    url: string;
    title: string;
}