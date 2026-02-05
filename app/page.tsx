// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>トップページ</h1>
      <Link href="/random">乱数作成アプリへ</Link>
      <Link href="/warikan">割り勘アプリへ</Link>
    </main>
  );
}
