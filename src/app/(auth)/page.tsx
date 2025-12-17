"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import { ROUTES } from "@/lib/constants";
import LoginForm from "./_components/LoginForm";
import SidebarImage from "./_components/SidebarImage";

export default function LoginPage() {
  const router = useRouter();
  const { token, initializing } = useAuthStore();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!initializing && token) {
      router.push(ROUTES.dashboard);
    }
  }, [token, initializing, router]);

  return (
    <div className="relative flex w-full h-screen">
      {/* Left: Form */}
      <LoginForm />

      {/* Right: Image */}
      <SidebarImage />
    </div>
  );
}
