import type { Metadata } from "next";
import { IBM_Plex_Sans_KR } from "next/font/google";
import Header from "./components/Header";

// 두 개 순서가 뭐가 맞음????
import "@pigment-css/react/styles.css";
import "./globalCss";

import * as React from "react";
import StyledComponentsRegistry from "@/utils/registry";

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
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        <Header />
      </body>
    </html>
  );
}
