import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TabBar from "@/components/tab-bar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Carrot Market",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-stone-900 text-white`}>
        {children}
      </body>
    </html>
  );
}
