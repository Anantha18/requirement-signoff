import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./convex-client-provider";

const pbDisplay = Archivo({
  variable: "--font-pb-display",
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
});

const pbSans = IBM_Plex_Sans({
  variable: "--font-pb-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pbMono = IBM_Plex_Mono({
  variable: "--font-pb-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "AV Room Configurator",
  description: "Get an indicative AV bill of materials and budget band for one meeting room.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${pbDisplay.variable} ${pbSans.variable} ${pbMono.variable}`}
    >
      <body><ConvexClientProvider>{children}</ConvexClientProvider></body>
    </html>
  );
}
