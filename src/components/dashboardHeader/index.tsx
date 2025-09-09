import React from "react";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import { PAGE_TITLES } from "@/lib/constants";
import { BellDot, SearchIcon, Settings2 } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function DashboardHeader() {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const dynamicTitle = PAGE_TITLES[pathname] || "Dashboard Overview";
  return (
    <div className="sticky z-10 top-0 flex gap-4 justify-between items-center w-full bg-white border-b p-3 px-3 sm:px-5">
      {/* page title  */}
      <div className="flex gap-2 items-center">
        {isMobile && <SidebarTrigger />}
        <h3 className="font-bold text-md text-[#739C7F]">{dynamicTitle}</h3>
      </div>
      {/* page title  ends*/}

      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground">
            <SearchIcon className="h-4 w-4" />
          </div>
          <Input
            id="search"
            type="search"
            placeholder="Search..."
            className=" rounded-lg bg-background pl-8"
          />
        </div>

        <Button variant={"ghost"} size={"icon"}>
          <Settings2 />
        </Button>
        <Button variant={"ghost"} size={"icon"}>
          <BellDot className="text-red-500" />
        </Button>

        {/* profile avatar  */}
        <div className="size-10 rounded-full flex-shrink-0 bg-gray-300"></div>
      </div>
    </div>
  );
}
