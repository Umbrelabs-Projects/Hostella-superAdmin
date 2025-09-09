import { Sidebar } from "lucide-react";
import React from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import Image from "next/image";
import { SidebarTabs } from "@/lib/constants";
import { SidebarTab } from "@/types/common";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AppSidebar() {
  const pathname = usePathname();
  const tabTransition = "transition-all duration-150 ease-in-out";
  return (
    <Sidebar>
      <SidebarHeader className="px-8 p-5 h-15 bg-white">
        <Image
          src={"/assets/svgs/logo.svg"}
          width={80}
          height={25}
          alt="Hostella"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {SidebarTabs.map((item: SidebarTab) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} asChild>
                    <Link
                      href={item.url}
                      className={cn(
                        "text-gray-500 py-5 border-transparent rounded-l-none",
                        { tabTransition },
                        {
                          "!text-[#739C7F] border-l-[3px] border-[#739C7F]":
                            pathname === item.url,
                        }
                      )}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
