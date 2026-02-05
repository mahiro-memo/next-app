import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '割り勘アプリ',
  description: '負担割合別の割り勘計算ツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
