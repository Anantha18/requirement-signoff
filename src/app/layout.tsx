import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./convex-client-provider";

const consoleSans = Manrope({
  variable: "--font-console-sans",
  subsets: ["latin"],
});

const consoleMono = IBM_Plex_Mono({
  variable: "--font-console-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Video Conferencing - Room Configurator",
  description: "Get an indicative AV bill of materials and budget band for one meeting room.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${consoleSans.variable} ${consoleMono.variable}`}
    >
      <body><ConvexClientProvider>{children}</ConvexClientProvider></body>
    </html>
  );
}
