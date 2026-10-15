import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Flow | Know where your money went",
  description: "A clear, personal monthly money tracker.",
  applicationName: "Flow",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Flow" },
};

export const viewport = {
  themeColor: "#003f35",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={manrope.variable}>{children}</body></html>;
}
