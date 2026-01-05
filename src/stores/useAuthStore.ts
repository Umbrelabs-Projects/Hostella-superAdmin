// /store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken, apiFetch } from "@/lib/api";
import { SignInFormData } from "@/app/(auth)/validations/signInSchema";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  role?: "STUDENT" | "ADMIN" | "SUPER_ADMIN";
  hostelId?: string | null;
  updatedAt?: string; // ISO timestamp of last profile update
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  initializing: boolean; // Separate state for initial session restore
  error: string | null;

  signIn: (data: SignInFormData) => Promise<void>;
  signOut: () => void;
  restoreSession: () => Promise<void>;
  fetchProfile: () => Promise<void>;

  updateProfile: (updates: FormData) => Promise<void>;
  updatePassword: (payload: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      loading: false,
      initializing: true, // Start as true, will be set to false after session check
      error: null,

      // --- Sign In ---
      signIn: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await apiFetch<{ user: User; token: string }>(
            "/auth/login",
            {
              method: "POST",
              body: JSON.stringify(data),
            }
          );

          // Check if user has SUPER_ADMIN role
          if (res.user.role !== "SUPER_ADMIN") {
            const errorMessage =
              "Access denied. Only SUPER_ADMIN users can access this application.";
            set({ error: errorMessage, loading: false });
            setAuthToken(null); // Clear any token that might have been set
            throw new Error(errorMessage);
          }

          setAuthToken(res.token);
          set({ user: res.user, token: res.token, loading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Sign in failed";
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },

      // --- Sign Out ---
      signOut: () => {
        setAuthToken(null);
        set({ user: null, token: null });
        localStorage.removeItem("auth-storage");
      },

      // --- Restore Session ---
      restoreSession: async () => {
        set({ initializing: true });
        try {
          const stored = localStorage.getItem("auth-storage");

          if (stored) {
            const parsed = JSON.parse(stored);
            const token = parsed?.state?.token;

            if (token) {
              setAuthToken(token);
              const user = await apiFetch<User>("/auth/me");

              // Check if user has SUPER_ADMIN role
              if (user.role !== "SUPER_ADMIN") {
                // Clear invalid session
                setAuthToken(null);
                set({ user: null, token: null, initializing: false });
                localStorage.removeItem("auth-storage");
                return;
              }

              set({ user, token, initializing: false });
              return;
            }
          }

          set({ initializing: false });
        } catch {
          setAuthToken(null);
          set({ user: null, token: null, initializing: false });
        }
      },

      // --- Fetch Profile ---
      fetchProfile: async () => {
        // Don't set loading state for background fetches
        set({ error: null });
        try {
          const user = await apiFetch<User>("/auth/me");
          set({ user });
          if (process.env.NODE_ENV === "development") {
            console.log("[fetchProfile] Profile synced:", user);
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch profile";
          set({ error: message });
        }
      },

      // --- Update Profile ---
      updateProfile: async (formData) => {
        set({ loading: true, error: null });
        try {
          if (process.env.NODE_ENV === "development") {
            console.log("[updateProfile] Uploading profile data...");
          }
          const updated = await apiFetch<User>("/user/profile", {
            method: "PUT",
            body: formData,
          });
          if (process.env.NODE_ENV === "development") {
            console.log("[updateProfile] Received updated user:", updated);
          }
          set({ user: updated, loading: false });
          // Refetch to ensure we have the latest data from server
          try {
            const latestUser = await apiFetch<User>("/auth/me");
            if (process.env.NODE_ENV === "development") {
              console.log(
                "[updateProfile] Refetched user from /auth/me:",
                latestUser
              );
            }
            set({ user: latestUser });
          } catch (error) {
            if (process.env.NODE_ENV === "development") {
              console.error("[updateProfile] Refetch failed:", error);
            }
            // Check if refetch failed due to 401
            if (
              error instanceof Error &&
              error.message.includes("Unauthorized")
            ) {
              // Token is invalid, trigger logout
              setAuthToken(null);
              set({ user: null, token: null, loading: false });
              localStorage.removeItem("auth-storage");
              throw new Error("Session expired. Please log in again.");
            }
            // If refetch fails, still keep the returned user data
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Profile update failed";

          // Check if error is due to 401 (Unauthorized)
          if (message.includes("Unauthorized")) {
            setAuthToken(null);
            set({ user: null, token: null, error: message, loading: false });
            localStorage.removeItem("auth-storage");
          } else {
            set({ error: message, loading: false });
          }
          throw new Error(message);
        }
      },

      // --- Update Password ---
      updatePassword: async (payload) => {
        set({ loading: true, error: null });
        try {
          await apiFetch("/user/password", {
            method: "PUT",
            body: JSON.stringify(payload),
          });
          set({ loading: false, error: null });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Password update failed";
          set({ error: message, loading: false });
          throw new Error(message);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
