"use client";

import { useState } from "react";
import Link from "next/link";

function assignRandomNumbers(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i + 1);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function RandomAssign() {
  const [count, setCount] = useState<number | "">("");
  const [result, setResult] = useState<number[]>([]);

  const handleClick = () => {
    if (!count || count <= 0) {
      setResult([]);
      return;
    }
    setResult(assignRandomNumbers(count));
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>人数から乱数を割り振り</h1>
      <input
        type="number"
        min={1}
        value={count}
        onChange={(e) => setCount(e.target.value === "" ? "" : Number(e.target.value))}
        placeholder="人数を入力"
      />
      <button onClick={handleClick} style={{ marginLeft: 8 }}>
        実行
      </button>
      <div style={{ marginTop: 16 }}>
        {result.length > 0 && <p>結果: {result.join(", ")}</p>}
      </div>
      <Link href="/random">乱数作成アプリへ</Link>
    </div>
  );
}
