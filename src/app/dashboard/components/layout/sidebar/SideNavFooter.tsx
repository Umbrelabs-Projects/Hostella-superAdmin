"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SideNavFooter() {
  const router = useRouter();
  const signOut = useAuthStore((s) => s.signOut);

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="px-4 mb-4">
      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="flex cursor-pointer w-full items-center justify-start gap-3 rounded-md p-3 text-sm font-medium text-red-600 
                   bg-transparent hover:bg-red-50 hover:text-red-600 focus:bg-red-50 active:bg-red-100 transition-all"
      >
        <LogOut className="w-5 h-5" />
        Sign Out
      </Button>
    </div>
  );
}
