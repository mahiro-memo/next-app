"use client";

import { useState } from "react";

// ============================================================
// 型定義
// ============================================================

type Player = {
  id: number;
  name: string;
  group: "A" | "B" | null;
  playCount: number;
  restCount: number;
  lastStatus: "play" | "rest";
};

type FixedPair = {
  player1: number;
  player2: number;
  group: "A" | "B" | null;
};

type CourtConfig = {
  singles: number;
  doubles: number;
};

type Match = {
  courtIndex: number;
  type: "singles" | "doubles";
  players: number[];
};

type Round = {
  roundIndex: number;
  matches: Match[];
  rests: number[];
};

type Pattern = "random" | "separate" | "mixed";

// ============================================================
// ペナルティ計算
// ============================================================

function calculatePenalty(
  playerIds: number[],
  type: "singles" | "doubles",
  allPlayers: Player[],
  pastRounds: Round[],
  pattern: Pattern,
): number {
  let penalty = 0;

  // 1. 同じペア再登場: +10点
  if (type === "doubles") {
    const pairs: [number, number][] = [];
    for (let i = 0; i < playerIds.length; i += 2) {
      pairs.push([playerIds[i], playerIds[i + 1]]);
    }
    for (const round of pastRounds) {
      for (const match of round.matches) {
        if (match.type === "doubles") {
          const pastPairs: [number, number][] = [];
          for (let i = 0; i < match.players.length; i += 2) {
            pastPairs.push([match.players[i], match.players[i + 1]]);
          }
          for (const pair of pairs) {
            for (const pastPair of pastPairs) {
              if (
                (pair[0] === pastPair[0] && pair[1] === pastPair[1]) ||
                (pair[0] === pastPair[1] && pair[1] === pastPair[0])
              ) {
                penalty += 10;
              }
            }
          }
        }
      }
    }
  }

  // 2. 同じ対戦再登場: +8点
  for (const round of pastRounds) {
    for (const match of round.matches) {
      const pastSet = new Set(match.players);
      const currentSet = new Set(playerIds);
      if (
        pastSet.size === currentSet.size &&
        [...pastSet].every((p) => currentSet.has(p))
      ) {
        penalty += 8;
      }
    }
  }

  // 3. 休憩連続: +5点
  for (const pid of playerIds) {
    const player = allPlayers.find((p) => p.id === pid);
    if (player && player.lastStatus === "rest") {
      penalty += 5;
    }
  }

  // 4. 参加回数の偏り: +3点/回
  const counts = playerIds.map(
    (pid) => allPlayers.find((p) => p.id === pid)?.playCount ?? 0,
  );
  if (counts.length > 0) {
    const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
    for (const c of counts) {
      penalty += Math.abs(c - avg) * 3;
    }
  }

  // 5. グループ違反: +15点
  const getGroup = (pid: number) =>
    allPlayers.find((p) => p.id === pid)?.group ?? null;

  if (pattern === "separate") {
    const groups = playerIds.map(getGroup).filter((g) => g !== null);
    const uniqueGroups = new Set(groups);
    if (uniqueGroups.size > 1) {
      penalty += 15;
    }
  }

  if (pattern === "mixed") {
    if (type === "singles") {
      const g1 = getGroup(playerIds[0]);
      const g2 = getGroup(playerIds[1]);
      if (g1 && g2 && g1 === g2) {
        penalty += 15;
      }
    } else if (type === "doubles") {
      const team1Groups = [getGroup(playerIds[0]), getGroup(playerIds[1])];
      const team2Groups = [getGroup(playerIds[2]), getGroup(playerIds[3])];
      const team1Mixed =
        team1Groups[0] !== team1Groups[1] &&
        team1Groups[0] !== null &&
        team1Groups[1] !== null;
      const team2Mixed =
        team2Groups[0] !== team2Groups[1] &&
        team2Groups[0] !== null &&
        team2Groups[1] !== null;
      if (!team1Mixed || !team2Mixed) {
        penalty += 15;
      }
    }
  }

  // 6. Aグループ以外がシングルスに配置: +12点
  if (type === "singles") {
    for (const pid of playerIds) {
      const group = getGroup(pid);
      if (group === "B") {
        penalty += 12;
      }
    }
  }

  return penalty;
}

// ============================================================
// プレイヤー状態更新
// ============================================================

function updatePlayerStates(playerStates: Player[], round: Round): void {
  const playingIds = round.matches.flatMap((m) => m.players);
  for (const player of playerStates) {
    if (playingIds.includes(player.id)) {
      player.playCount++;
      player.lastStatus = "play";
    } else {
      player.restCount++;
      player.lastStatus = "rest";
    }
  }
}

// ============================================================
// 組み合わせシャッフル
// ============================================================

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ============================================================
// ラウンド生成
// ============================================================

function generateSingleRound(
  playerStates: Player[],
  courtConfig: CourtConfig,
  pattern: Pattern,
  fixedPairs: FixedPair[],
  pastRounds: Round[],
  roundIndex: number,
): Round {
  const requiredPlayers = courtConfig.singles * 2 + courtConfig.doubles * 4;
  const allIds = playerStates.map((p) => p.id);

  let bestRound: Round | null = null;
  let bestPenalty = Infinity;

  const maxAttempts = 100;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Aグループを優先的にシングルスに配置するため、
    // Aグループを先頭に持ってきてからシャッフル
    const groupA = shuffle(
      allIds.filter((id) => {
        const p = playerStates.find((pl) => pl.id === id);
        return p?.group === "A";
      }),
    );
    const groupB = shuffle(
      allIds.filter((id) => {
        const p = playerStates.find((pl) => pl.id === id);
        return p?.group === "B";
      }),
    );
    const groupNone = shuffle(
      allIds.filter((id) => {
        const p = playerStates.find((pl) => pl.id === id);
        return p?.group === null;
      }),
    );

    // Aグループ優先でシングルスに配置、残りをダブルスへ
    const prioritized = [...groupA, ...groupNone, ...groupB];
    const singlesPlayers = prioritized.slice(
      0,
      Math.min(courtConfig.singles * 2, prioritized.length),
    );
    const remaining = prioritized.slice(singlesPlayers.length);
    const doublesPlayers = remaining.slice(
      0,
      Math.min(courtConfig.doubles * 4, remaining.length),
    );
    const playing = [...singlesPlayers, ...doublesPlayers];
    const resting = prioritized.slice(playing.length);

    const matches: Match[] = [];
    let idx = 0;

    // シングルスのマッチ生成
    for (let i = 0; i < courtConfig.singles; i++) {
      if (idx + 2 <= playing.length) {
        matches.push({
          courtIndex: i + 1,
          type: "singles",
          players: [playing[idx], playing[idx + 1]],
        });
        idx += 2;
      }
    }

    // ダブルスのマッチ生成（固定ペアを考慮）
    for (let i = 0; i < courtConfig.doubles; i++) {
      if (idx + 4 <= playing.length) {
        let matchPlayers = [
          playing[idx],
          playing[idx + 1],
          playing[idx + 2],
          playing[idx + 3],
        ];

        for (const fp of fixedPairs) {
          const p1InMatch = matchPlayers.includes(fp.player1);
          const p2InMatch = matchPlayers.includes(fp.player2);
          if (p1InMatch && p2InMatch) {
            const others = matchPlayers.filter(
              (p) => p !== fp.player1 && p !== fp.player2,
            );
            matchPlayers = [fp.player1, fp.player2, ...others];
          }
        }

        matches.push({
          courtIndex: i + 1 + courtConfig.singles,
          type: "doubles",
          players: matchPlayers,
        });
        idx += 4;
      }
    }

    // ペナルティ計算
    let totalPenalty = 0;
    for (const match of matches) {
      totalPenalty += calculatePenalty(
        match.players,
        match.type,
        playerStates,
        pastRounds,
        pattern,
      );
    }

    for (const restId of resting) {
      const player = playerStates.find((p) => p.id === restId);
      if (player && player.lastStatus === "rest") {
        totalPenalty += 5;
      }
    }

    const round: Round = { roundIndex, matches, rests: resting };

    if (totalPenalty < bestPenalty) {
      bestPenalty = totalPenalty;
      bestRound = round;
    }

    if (totalPenalty === 0) break;
  }

  return bestRound || { roundIndex, matches: [], rests: allIds };
}

function generateAllRounds(
  players: Player[],
  courtConfig: CourtConfig,
  pattern: Pattern,
  fixedPairs: FixedPair[],
  startIndex: number = 1,
): Round[] {
  const allRounds: Round[] = [];
  const playerStates = players.map((p) => ({ ...p }));

  for (let i = 0; i < 3; i++) {
    const round = generateSingleRound(
      playerStates,
      courtConfig,
      pattern,
      fixedPairs,
      allRounds,
      startIndex + i,
    );
    allRounds.push(round);
    updatePlayerStates(playerStates, round);
  }

  return allRounds;
}

// ============================================================
// クリップボード保存
// ============================================================

function formatRoundsText(rounds: Round[], players: Player[]): string {
  let text = "";
  const getName = (id: number) =>
    players.find((p) => p.id === id)?.name ?? `P${id}`;

  rounds.forEach((round) => {
    text += `Round ${round.roundIndex}\n`;
    round.matches.forEach((match) => {
      if (match.type === "singles") {
        text += `  Court ${match.courtIndex} (Singles): ${getName(match.players[0])} vs ${getName(match.players[1])}\n`;
      } else {
        text += `  Court ${match.courtIndex} (Doubles): ${getName(match.players[0])}/${getName(match.players[1])} vs ${getName(match.players[2])}/${getName(match.players[3])}\n`;
      }
    });
    text += `  Rest: ${round.rests.map((id) => getName(id)).join(", ") || "none"}\n\n`;
  });

  return text;
}

// ============================================================
// メインコンポーネント
// ============================================================

export default function TennisApp() {
  // ステップ管理
  const [step, setStep] = useState(1);

  // ステップ1: 人数入力
  const [playerCount, setPlayerCount] = useState(4);

  // ステップ2: グループ分け
  const [hasGroups, setHasGroups] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);

  // ステップ3: コート構成
  const [courtConfig, setCourtConfig] = useState<CourtConfig>({
    singles: 0,
    doubles: 1,
  });

  // ステップ4: パターン選択
  const [pattern, setPattern] = useState<Pattern>("random");

  // ステップ5: 固定ペア
  const [fixedPairs, setFixedPairs] = useState<FixedPair[]>([]);
  const [fp1, setFp1] = useState(0);
  const [fp2, setFp2] = useState(0);

  // ステップ6: 結果
  const [rounds, setRounds] = useState<Round[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  // エラー
  const [error, setError] = useState("");

  // ----------------------------------------------------------
  // ステップ1 → 2
  // ----------------------------------------------------------
  const goToStep2 = () => {
    if (playerCount < 2 || playerCount > 50) {
      setError("2〜50人の範囲で入力してください");
      return;
    }
    setError("");
    const newPlayers: Player[] = Array.from({ length: playerCount }, (_, i) => ({
      id: i + 1,
      name: `P${i + 1}`,
      group: null,
      playCount: 0,
      restCount: 0,
      lastStatus: "rest" as const,
    }));
    setPlayers(newPlayers);
    setStep(2);
  };

  // ----------------------------------------------------------
  // ステップ2 → 3
  // ----------------------------------------------------------
  const goToStep3 = () => {
    setError("");
    setStep(3);
  };

  // ----------------------------------------------------------
  // ステップ3 → 4
  // ----------------------------------------------------------
  const goToStep4 = () => {
    const { singles, doubles } = courtConfig;
    if (singles + doubles === 0) {
      setError("少なくとも1面以上必要です");
      return;
    }
    if (singles + doubles > 5) {
      setError("合計5面以下にしてください");
      return;
    }
    const requiredPlayers = singles * 2 + doubles * 4;
    if (requiredPlayers > playerCount) {
      setError("人数が足りません");
      return;
    }
    setError("");
    setStep(4);
  };

  // ----------------------------------------------------------
  // ステップ4 → 5 or 6
  // ----------------------------------------------------------
  const goToStep5or6 = () => {
    setError("");
    if (courtConfig.doubles > 0) {
      setStep(5);
    } else {
      const result = generateAllRounds(players, courtConfig, pattern, []);
      setRounds(result);
      setStep(6);
    }
  };

  // ----------------------------------------------------------
  // ステップ5 → 6
  // ----------------------------------------------------------
  const goToStep6 = () => {
    setError("");
    const result = generateAllRounds(players, courtConfig, pattern, fixedPairs);
    setRounds(result);
    setStep(6);
  };

  // ----------------------------------------------------------
  // 次の3ラウンドを追加生成
  // ----------------------------------------------------------
  const generateNextRounds = () => {
    const lastRoundIndex =
      rounds.length > 0 ? rounds[rounds.length - 1].roundIndex : 0;

    // 過去のラウンド結果から最新のプレイヤー状態を復元
    const updatedPlayers = players.map((p) => ({ ...p }));
    for (const round of rounds) {
      updatePlayerStates(updatedPlayers, round);
    }

    const newRounds = generateAllRounds(
      updatedPlayers,
      courtConfig,
      pattern,
      fixedPairs,
      lastRoundIndex + 1,
    );
    setRounds([...rounds, ...newRounds]);
  };

  // ----------------------------------------------------------
  // 固定ペア追加
  // ----------------------------------------------------------
  const addFixedPair = () => {
    if (fp1 === 0 || fp2 === 0 || fp1 === fp2) {
      setError("異なるプレイヤーを選択してください");
      return;
    }
    const used = fixedPairs.flatMap((fp) => [fp.player1, fp.player2]);
    if (used.includes(fp1) || used.includes(fp2)) {
      setError("既に他の固定ペアに含まれているプレイヤーです");
      return;
    }
    if (fixedPairs.length >= courtConfig.doubles) {
      setError("固定ペアが多すぎます");
      return;
    }
    setError("");
    setFixedPairs([...fixedPairs, { player1: fp1, player2: fp2, group: null }]);
    setFp1(0);
    setFp2(0);
  };

  const removeFixedPair = (index: number) => {
    setFixedPairs(fixedPairs.filter((_, i) => i !== index));
  };

  // ----------------------------------------------------------
  // グループ設定
  // ----------------------------------------------------------
  const setPlayerGroup = (playerId: number, group: "A" | "B" | null) => {
    setPlayers(
      players.map((p) => (p.id === playerId ? { ...p, group } : p)),
    );
  };

  // ----------------------------------------------------------
  // クリップボードコピー
  // ----------------------------------------------------------
  const copyToClipboard = async () => {
    const text = formatRoundsText(rounds, players);
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert("コピーに失敗しました");
    }
  };

  // ----------------------------------------------------------
  // リセット
  // ----------------------------------------------------------
  const resetAll = () => {
    setStep(1);
    setPlayerCount(4);
    setHasGroups(false);
    setPlayers([]);
    setCourtConfig({ singles: 0, doubles: 1 });
    setPattern("random");
    setFixedPairs([]);
    setRounds([]);
    setError("");
    setCopySuccess(false);
  };

  // ----------------------------------------------------------
  // 共通ボタンスタイル
  // ----------------------------------------------------------
  const btnPrimary =
    "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg transition";
  const btnSecondary =
    "bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-lg transition";
  const btnDanger = "text-red-400 hover:text-red-300 text-sm transition";

  // ============================================================
  // レンダリング
  // ============================================================

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#1a1a1a]">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            テニス乱数表アプリ
          </h1>
          <p className="text-gray-300 text-center text-sm">
            自動で試合の組み合わせを生成します
          </p>
        </header>

        {/* ステッププログレス */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  s === step
                    ? "bg-blue-600 text-white"
                    : s < step
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-400"
                }`}
              >
                {s < step ? "\u2713" : s}
              </div>
              {s < 6 && (
                <div
                  className={`w-6 h-0.5 ${
                    s < step ? "bg-green-600" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* エラー表示 */}
        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-700 rounded-lg px-4 py-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* ========================================== */}
        {/* ステップ1: 人数入力 */}
        {/* ========================================== */}
        {step === 1 && (
          <div className="bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              Step 1: 人数を入力
            </h2>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                プレイヤー人数（2〜50人）
              </label>
              <input
                type="number"
                inputMode="numeric"
                min={2}
                max={50}
                value={playerCount}
                onChange={(e) => setPlayerCount(parseInt(e.target.value) || 0)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToStep2();
                }}
                className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex justify-end">
              <button onClick={goToStep2} className={btnPrimary}>
                次へ
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ステップ2: グループ分け */}
        {/* ========================================== */}
        {step === 2 && (
          <div className="bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              Step 2: グループ分け
            </h2>

            <div className="mb-4 bg-[#1a1a1a] rounded-lg border border-gray-700 px-4 py-3">
              <p className="text-gray-400 text-sm leading-relaxed">
                ミックスやレベル別の対戦に活用できます。
                <br />
                Aグループのプレイヤーが優先的にシングルスに配置されます。
              </p>
            </div>

            <div className="mb-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasGroups}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setHasGroups(checked);
                    if (checked) {
                      // チェックON → 全員をAグループに設定
                      setPlayers(
                        players.map((p) => ({ ...p, group: "A" as const })),
                      );
                    } else {
                      // チェックOFF → 全員をなしに設定
                      setPlayers(
                        players.map((p) => ({ ...p, group: null })),
                      );
                    }
                  }}
                  className="w-5 h-5 rounded border-gray-600 bg-[#1a1a1a] text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-300 font-semibold">
                  グループ分けをする
                </span>
              </label>
            </div>

            {hasGroups && (
              <div className="mb-6 space-y-2 max-h-80 overflow-y-auto">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg px-4 py-2 border border-gray-700"
                  >
                    <span className="text-white font-semibold w-12">
                      {p.name}
                    </span>
                    <div className="flex gap-2">
                      {(["A", "B", null] as const).map((g) => (
                        <button
                          key={g ?? "none"}
                          onClick={() =>
                            setPlayerGroup(p.id, g as "A" | "B" | null)
                          }
                          className={`px-3 py-1 rounded text-sm font-semibold transition ${
                            p.group === g
                              ? g === "A"
                                ? "bg-blue-600 text-white"
                                : g === "B"
                                  ? "bg-orange-600 text-white"
                                  : "bg-gray-500 text-white"
                              : "bg-[#2d2d2d] border border-gray-600 text-gray-400 hover:bg-gray-700"
                          }`}
                        >
                          {g ?? "なし"}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className={btnSecondary}>
                戻る
              </button>
              <button onClick={goToStep3} className={btnPrimary}>
                次へ
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ステップ3: コート構成 */}
        {/* ========================================== */}
        {step === 3 && (
          <div className="bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              Step 3: コート構成
            </h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  シングルス面数（0〜5）
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={5}
                  value={courtConfig.singles}
                  onChange={(e) =>
                    setCourtConfig({
                      ...courtConfig,
                      singles: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  ダブルス面数（0〜5）
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={5}
                  value={courtConfig.doubles}
                  onChange={(e) =>
                    setCourtConfig({
                      ...courtConfig,
                      doubles: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 px-4 py-3">
                <div className="text-sm text-gray-400">
                  合計面数:{" "}
                  <span className="text-white font-bold">
                    {courtConfig.singles + courtConfig.doubles}面
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  必要人数:{" "}
                  <span className="text-white font-bold">
                    {courtConfig.singles * 2 + courtConfig.doubles * 4}人
                  </span>
                  <span className="text-gray-500 ml-2">
                    （参加者: {playerCount}人）
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className={btnSecondary}>
                戻る
              </button>
              <button onClick={goToStep4} className={btnPrimary}>
                次へ
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ステップ4: パターン選択 */}
        {/* ========================================== */}
        {step === 4 && (
          <div className="bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              Step 4: パターン選択
            </h2>

            <div className="space-y-3 mb-6">
              {(
                [
                  {
                    value: "random" as Pattern,
                    label: "完全ランダム",
                    desc: "グループに関係なくランダムに組み合わせ",
                    always: true,
                  },
                  {
                    value: "separate" as Pattern,
                    label: "別々",
                    desc: "A同士・B同士のみで対戦",
                    always: false,
                  },
                  {
                    value: "mixed" as Pattern,
                    label: "混合",
                    desc: "A vs B の対戦を優先",
                    always: false,
                  },
                ] as const
              ).map((opt) => {
                const disabled = !opt.always && !hasGroups;
                return (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      pattern === opt.value
                        ? "border-blue-500 bg-blue-900/20"
                        : disabled
                          ? "border-gray-700 bg-[#1a1a1a] opacity-50 cursor-not-allowed"
                          : "border-gray-700 bg-[#1a1a1a] hover:border-gray-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="pattern"
                      value={opt.value}
                      checked={pattern === opt.value}
                      onChange={() => !disabled && setPattern(opt.value)}
                      disabled={disabled}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-white font-semibold">
                        {opt.label}
                      </div>
                      <div className="text-gray-400 text-sm">{opt.desc}</div>
                      {disabled && (
                        <div className="text-yellow-500 text-xs mt-1">
                          グループ分けが必要です
                        </div>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(3)} className={btnSecondary}>
                戻る
              </button>
              <button onClick={goToStep5or6} className={btnPrimary}>
                {courtConfig.doubles > 0 ? "次へ" : "3ラウンド生成"}
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ステップ5: 固定ペア設定 */}
        {/* ========================================== */}
        {step === 5 && (
          <div className="bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              Step 5: 固定ペア設定（ダブルスのみ）
            </h2>

            <div className="mb-6">
              <div className="flex gap-2 items-end mb-4">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    プレイヤー1
                  </label>
                  <select
                    value={fp1}
                    onChange={(e) => setFp1(parseInt(e.target.value))}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>選択...</option>
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">
                    プレイヤー2
                  </label>
                  <select
                    value={fp2}
                    onChange={(e) => setFp2(parseInt(e.target.value))}
                    className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>選択...</option>
                    {players.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={addFixedPair}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                >
                  追加
                </button>
              </div>

              {fixedPairs.length > 0 && (
                <div className="space-y-2">
                  {fixedPairs.map((fp, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-[#1a1a1a] rounded-lg px-4 py-2 border border-gray-700"
                    >
                      <span className="text-white">
                        {players.find((p) => p.id === fp.player1)?.name} &{" "}
                        {players.find((p) => p.id === fp.player2)?.name}
                      </span>
                      <button
                        onClick={() => removeFixedPair(i)}
                        className={btnDanger}
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {fixedPairs.length === 0 && (
                <p className="text-gray-500 text-sm">
                  固定ペアなしでも生成できます
                </p>
              )}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(4)} className={btnSecondary}>
                戻る
              </button>
              <button onClick={goToStep6} className={btnPrimary}>
                3ラウンド生成
              </button>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* ステップ6: 結果表示（全ラウンド縦並び） */}
        {/* ========================================== */}
        {step === 6 && rounds.length > 0 && (
          <div className="bg-[#2d2d2d] rounded-lg shadow-2xl p-6 md:p-8 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                試合結果（{rounds.length}ラウンド）
              </h2>
              <button
                onClick={copyToClipboard}
                className={`text-xs px-3 py-1.5 rounded transition flex items-center gap-1 ${
                  copySuccess
                    ? "bg-green-600 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {copySuccess ? "コピーしました！" : "結果を保存"}
                </span>
              </button>
            </div>

            {/* 全ラウンドを縦に並べて表示 */}
            <div className="space-y-6 mb-6">
              {rounds.map((round) => (
                <div
                  key={round.roundIndex}
                  className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-4"
                >
                  <h3 className="text-lg font-bold text-blue-400 mb-3">
                    Round {round.roundIndex}
                  </h3>
                  <div className="space-y-2">
                    {round.matches.map((match, i) => (
                      <div
                        key={i}
                        className="bg-[#252525] rounded-lg px-4 py-3"
                      >
                        <div className="text-xs text-gray-500 mb-1">
                          Court {match.courtIndex} (
                          {match.type === "singles" ? "Singles" : "Doubles"})
                        </div>
                        {match.type === "singles" ? (
                          <div className="flex items-center justify-center gap-4">
                            <span className="text-white font-bold text-lg">
                              {
                                players.find(
                                  (p) => p.id === match.players[0],
                                )?.name
                              }
                            </span>
                            <span className="text-gray-500 font-bold">vs</span>
                            <span className="text-white font-bold text-lg">
                              {
                                players.find(
                                  (p) => p.id === match.players[1],
                                )?.name
                              }
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-4">
                            <div className="text-center">
                              <span className="text-white font-bold">
                                {
                                  players.find(
                                    (p) => p.id === match.players[0],
                                  )?.name
                                }
                              </span>
                              <span className="text-gray-400"> / </span>
                              <span className="text-white font-bold">
                                {
                                  players.find(
                                    (p) => p.id === match.players[1],
                                  )?.name
                                }
                              </span>
                            </div>
                            <span className="text-gray-500 font-bold">vs</span>
                            <div className="text-center">
                              <span className="text-white font-bold">
                                {
                                  players.find(
                                    (p) => p.id === match.players[2],
                                  )?.name
                                }
                              </span>
                              <span className="text-gray-400"> / </span>
                              <span className="text-white font-bold">
                                {
                                  players.find(
                                    (p) => p.id === match.players[3],
                                  )?.name
                                }
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* 休憩者 */}
                    {round.rests.length > 0 && (
                      <div className="bg-[#252525] rounded-lg px-4 py-3">
                        <div className="text-xs text-gray-500 mb-1">Rest</div>
                        <div className="text-gray-300 text-sm">
                          {round.rests
                            .map(
                              (id) =>
                                players.find((p) => p.id === id)?.name ??
                                `P${id}`,
                            )
                            .join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 参加サマリー */}
            {(() => {
              const summary = players.map((p) => {
                let playCount = 0;
                let restCount = 0;
                for (const round of rounds) {
                  const playingIds = round.matches.flatMap((m) => m.players);
                  if (playingIds.includes(p.id)) {
                    playCount++;
                  } else {
                    restCount++;
                  }
                }
                const rate =
                  rounds.length > 0
                    ? Math.round((playCount / rounds.length) * 100)
                    : 0;
                return { ...p, playCount, restCount, rate };
              });

              return (
                <div className="bg-[#1a1a1a] rounded-lg border border-gray-700 p-4 mb-6">
                  <h3 className="text-lg font-bold text-white mb-3">
                    参加サマリー
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left text-gray-400 py-2 px-2">
                            名前
                          </th>
                          <th className="text-center text-gray-400 py-2 px-2">
                            参加
                          </th>
                          <th className="text-center text-gray-400 py-2 px-2">
                            休憩
                          </th>
                          <th className="text-right text-gray-400 py-2 px-2">
                            参加率
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.map((s) => (
                          <tr
                            key={s.id}
                            className="border-b border-gray-800"
                          >
                            <td className="text-white font-semibold py-2 px-2">
                              {s.name}
                            </td>
                            <td className="text-center text-gray-300 py-2 px-2">
                              {s.playCount}回
                            </td>
                            <td className="text-center text-gray-300 py-2 px-2">
                              {s.restCount}回
                            </td>
                            <td className="py-2 px-2">
                              <div className="flex items-center gap-2 justify-end">
                                <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${s.rate}%` }}
                                  />
                                </div>
                                <span className="text-gray-300 text-xs w-8 text-right">
                                  {s.rate}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {/* 次の3ラウンド生成 & リセット */}
            <div className="flex justify-center gap-4">
              <button onClick={generateNextRounds} className={btnPrimary}>
                次の3ラウンドを生成
              </button>
              <button onClick={resetAll} className={btnSecondary}>
                最初に戻る
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
