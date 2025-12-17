"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import SideNav from "./components/layout/sidebar/sideNav";
import Header from "./components/layout/header/Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { token, initializing } = useAuthStore();

  // Protect dashboard route - redirect to home if not authenticated
  useEffect(() => {
    if (!initializing && !token) {
      router.push("/");
    }
  }, [token, initializing, router]);

  // Don't render dashboard if no token and initialization is complete
  if (!initializing && !token) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col md:flex-row bg-gray-100 ">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 md:w-[25%] bg-white shadow-lg border-r
        transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        <SideNav closeMenu={() => setIsOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex flex-col w-full">
        <Header onMenuClick={() => setIsOpen(true)} />
        <main className="grow overflow-y-auto p-4  ">{children}</main>
      </div>
    </div>
  );
}
