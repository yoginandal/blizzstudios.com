import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ParticlesBackground from "@/components/ParticlesBackground";

export const metadata: Metadata = {
  title: "BlizzStudios",
  description: "Best Digital Marketing Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="relative min-h-screen">
        <ParticlesBackground />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
