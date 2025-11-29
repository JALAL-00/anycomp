// src/app/layout.tsx (UPDATED)

import type { Metadata } from "next";
import "../styles/globals.css";
import { Providers } from "./providers"; // Will create this component

// Set required metadata
export const metadata: Metadata = {
  title: "Anycomp - Fullstack Developer Project",
  description: "Company Registration and Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}