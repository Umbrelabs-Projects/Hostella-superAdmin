"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  BookIcon,
  MessageCircleMoreIcon,
  Settings,
  Shield,
  Building2,
} from "lucide-react";
import SideNavHeader from "./SideNavHeader";
import SideNavLink from "./SideNavLink";
import SideNavFooter from "./SideNavFooter";

interface SideNavProps {
  closeMenu: () => void;
}

export default function SideNav({ closeMenu }: SideNavProps) {
  const pathname = usePathname();

  const navItems = [
    { title: "Home", icon: BookIcon, url: "/dashboard" },
    { title: "Super Admin", icon: Shield, url: "/dashboard/super-admin" },
    {
      title: "Hostels",
      icon: Building2,
      url: "/dashboard/hostels",
    },
    {
      title: "Broadcast Message",
      icon: MessageCircleMoreIcon,
      url: "/dashboard/broadcast",
    },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-full flex-col py- bg-white">
      {/* Header */}
      <SideNavHeader closeMenu={closeMenu} />

      {/* Links */}
      <div className="flex flex-col grow gap-1 mt-4">
        {navItems.map(({ title, icon, url }) => (
          <SideNavLink
            key={title}
            title={title}
            icon={icon}
            url={url}
            isActive={pathname === url}
          />
        ))}
      </div>

      {/* Footer (Sign out) */}
      <SideNavFooter />
    </div>
  );
}
