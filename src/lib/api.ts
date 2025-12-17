let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  // Mirror token in a browser cookie for middleware checks
  if (typeof document !== "undefined") {
    if (token) {
      // Set cookie with 7-day expiry (matches JWT expiry)
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      document.cookie = `auth-token=${token}; path=/; SameSite=Lax; expires=${expiryDate.toUTCString()}`;
    } else {
      // Expire the cookie to clear it
      document.cookie =
        "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
  }
};

// Helper to get token from storage or memory
const getAuthToken = (): string | null => {
  // First check if token is in memory (most reliable during session)
  if (authToken) return authToken;

  // Fallback to reading from cookie if memory is empty
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split("; ");
    const tokenCookie = cookies.find((c) => c.startsWith("auth-token="));
    if (tokenCookie) {
      const token = tokenCookie.substring("auth-token=".length);
      authToken = token; // Cache it in memory
      return token;
    }
  }

  return null;
};

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  // Default to relative paths (same origin) when no API URL is configured.
  // This lets the app call local API routes during development without extra env setup.
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
  // Add /api/v1 prefix to all endpoints
  const versionedEndpoint = endpoint.startsWith("/api/v1")
    ? endpoint
    : `/api/v1${endpoint}`;

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string> | undefined),
  };

  // Get token from memory or cookie
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (process.env.NODE_ENV === "development") {
    console.warn(
      `[apiFetch] No auth token found for endpoint: ${versionedEndpoint}`
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[apiFetch] ${options.method || "GET"} ${versionedEndpoint}`, {
      hasToken: !!token,
      hasAuth: !!headers["Authorization"],
    });
  }

  const res = await fetch(`${baseUrl}${versionedEndpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `API error: ${res.status}`);
  }

  try {
    const json = await res.json();
    // Handle response envelope { success: true, data: ... }
    if (
      json &&
      typeof json === "object" &&
      "success" in json &&
      "data" in json
    ) {
      return json.data as T;
    }
    // Fallback for responses without envelope
    return json as T;
  } catch {
    throw new Error("Failed to parse JSON response");
  }
}
