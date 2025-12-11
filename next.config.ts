import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 
     Next.js 16 Configuration
     
     Note: Middleware file convention deprecated in Next.js 16.
     Migration: Authentication is now handled via:
     - Client-side Zustand store (useAuthStore)
     - Route-level protection in layout files
     - API route handlers for token validation
     
     See src/middleware.ts and BACKEND_HANDOFF.md for details.
  */
};

export default nextConfig;
