import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mahiro App",
  description: "next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header
          className="header-nav"
          style={{
            padding: "10px 20px",
          }}
        >
          <nav style={{ display: "flex", gap: "20px" }}>
            <Link href="/">Mahiro App</Link>
          </nav>
        </header>

        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
