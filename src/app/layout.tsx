import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";

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
  title: "Requirement Sign-off",
  description:
    "Agree on meeting-room requirements before AV equipment selection begins.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${consoleSans.variable} ${consoleMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
