import type { Metadata } from "next";
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
    <html lang="en">
      <body
        <header
          style={{
            padding: "10px 20px",
            background: "#f0f0f0",
            borderBottom: "1px solid #ccc",
          }}
        >
          <nav style={{ display: "flex", gap: "20px" }}>
            <Link href="/">トップ</Link>
            <Link href="/random">乱数作成</Link>
          </nav>
        </header>

        <main style={{ padding: "20px" }}>{children}</main>
      </body>
    </html>
  );
}
