import type { Metadata } from "next";
import { Comfortaa, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hostella Super Admin",
  description: "Super admin dashboard for managing hostels, admins, bookings, and communications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <div
            style={{
              fontFamily: `${poppins.style.fontFamily}, ${comfortaa.style.fontFamily}`,
            }}
          >
            {children}
          </div>
        </Providers>

        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
