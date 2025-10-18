import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next"
import "./globals.css";

export const metadata: Metadata = {
  title: "PhotoApp - AI Profile Generator",
  description: "Generate creative AI profile images with Canadian city presets",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          modalBackdrop: "backdrop-blur-sm",
        },
      }}
    >
      <html lang="en" className="h-full">
        <body className="antialiased h-full bg-[#0f0a0a] overflow-hidden">
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
