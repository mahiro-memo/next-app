// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <p>
        <Link href="/random">乱数作成アプリ</Link>
      </p>
      <p>
        <Link href="/warikan">割り勘アプリ</Link>
      </p>
    </main>
  );
}
