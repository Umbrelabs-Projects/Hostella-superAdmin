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

export type Admin = {
  id: string;
  name: string;
  email: string;
  role: "admin";     
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type NewAdmin = {
  name: string;
  email: string;
  password: string; 
};
