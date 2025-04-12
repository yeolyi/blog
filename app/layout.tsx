import type { Metadata } from "next";
import { IBM_Plex_Sans_KR } from "next/font/google";
import Header from "./components/Header";

import "@/app/globals.css";

import * as React from "react";

const ibmPlexSans = IBM_Plex_Sans_KR({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "개발자 성열",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable}`}>
      <body>
        {children}
        <Header />
      </body>
    </html>
  );
}
