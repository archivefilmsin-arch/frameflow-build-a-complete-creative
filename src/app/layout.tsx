import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Courier_Prime } from "next/font/google";
import { FrameFlowShell } from "@/components/layout/FrameFlowShell";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const serifDisplay = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FrameFlow — Creative Operating System",
  description: "Every idea deserves to become a story. The all-in-one Creative Operating System for filmmakers, photographers, screenwriters, and documentary storytellers.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${serifDisplay.variable} ${courierPrime.variable} dark`}
      suppressHydrationWarning
    >
      <body className="bg-[#090A0D] text-[#F4F4F6] min-h-screen selection:bg-[#E5A93C]/25 selection:text-[#FFF] antialiased">
        <FrameFlowShell>{children}</FrameFlowShell>
      </body>
    </html>
  );
}
