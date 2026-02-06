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
  description:
    "日常生活で役立つ便利なWebアプリを提供。乱数作成アプリや割り勘アプリなど、シンプルで使いやすいツールをお届けします。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="header-nav px-5 py-3">
          <nav className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="text-lg font-bold">
              Mahiro App
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/random">乱数作成</Link>
              <Link href="/warikan">割り勘</Link>
              <Link href="/about">運営者情報</Link>
            </div>
          </nav>
        </header>

        <main style={{ padding: "20px" }}>{children}</main>

        <footer className="footer-nav mt-12 py-8 px-5">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-6 justify-center text-sm mb-6">
              <Link href="/about">運営者情報</Link>
              <Link href="/privacy">プライバシーポリシー</Link>
              <Link href="/terms">利用規約</Link>
              <Link href="/contact">お問い合わせ</Link>
            </div>
            <p className="text-center text-xs text-gray-500">
              &copy; 2026 Mahiro App. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
