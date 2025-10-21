// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { BisonProvider } from "@/app/lib/BisonContext";
import { AdvertProvider } from "@/app/lib/AdvertContext";

export const metadata: Metadata = {
  title: "WisentMatch - Bison Management System",
  description: "Professional bison breeding management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <BisonProvider>
          <AdvertProvider>{children}</AdvertProvider>
        </BisonProvider>
      </body>
    </html>
  );
}