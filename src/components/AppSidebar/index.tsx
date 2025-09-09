"use client";

import React, { useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import Image from "next/image";
import { SidebarTabs } from "@/lib/constants";
import { SidebarTab } from "@/types/common";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useSuperAdmin } from "@/app/dashboard/contexts/page";

export default function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpen } = useSidebar();
  const { logout } = useSuperAdmin(); 

  useEffect(() => {
    if (isMobile) {
      setOpen(false);
    }
  }, [pathname, isMobile, setOpen]);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center py-5 bg-white">
          <Image
            src="/assets/svgs/logo.svg"
            width={100}
            height={30}
            alt="Hostella"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarTabs.map((item: SidebarTab) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={isActive} asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-2 text-gray-500 py-3 px-4 transition-all duration-150 ease-in-out",
                          isActive &&
                            "!text-[#739C7F] border-l-[3px] border-[#739C7F] bg-gray-50"
                        )}
                        onClick={() => setOpen(false)}
                      >
                        {item.icon && <item.icon className="h-5 w-5" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              {/* ✅ Logout Button */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button
                    onClick={() => {
                      logout();
                      if (isMobile) setOpen(false);
                    }}
                    className="flex items-center gap-2 text-red-500 py-3 px-4 transition-all duration-150 ease-in-out hover:bg-red-50 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
