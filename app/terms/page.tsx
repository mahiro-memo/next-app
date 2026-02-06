import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約 | Mahiro App",
  description: "Mahiro Appの利用規約について",
};

export default function Terms() {
  return (
    <article className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">利用規約</h1>
      <p className="text-sm text-gray-500 mb-8">最終更新日：2026年2月7日</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">第1条（適用）</h2>
        <p className="mb-4 leading-relaxed">
          本規約は、Mahiro App（以下「当サイト」）が提供するすべてのサービスの利用に適用されます。ユーザーは、本規約に同意した上で当サイトをご利用ください。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          第2条（サービスの内容）
        </h2>
        <p className="mb-4 leading-relaxed">
          当サイトでは、以下のWebアプリケーションおよびコンテンツを提供しています。
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>乱数作成アプリ</li>
          <li>割り勘アプリ</li>
          <li>その他、当サイトが随時提供するツールおよびコンテンツ</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">第3条（禁止事項）</h2>
        <p className="mb-4 leading-relaxed">
          ユーザーは、以下の行為を行ってはなりません。
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>法令または公序良俗に反する行為</li>
          <li>当サイトのサーバーやネットワークに過度な負荷をかける行為</li>
          <li>当サイトの運営を妨害する行為</li>
          <li>他のユーザーまたは第三者の権利を侵害する行為</li>
          <li>不正アクセスやそれに類する行為</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">第4条（免責事項）</h2>
        <p className="mb-4 leading-relaxed">
          当サイトが提供するツールの計算結果やコンテンツの正確性について、当サイトは一切保証いたしません。当サイトの利用により生じた損害について、当サイトは一切の責任を負いません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          第5条（サービスの変更・停止）
        </h2>
        <p className="mb-4 leading-relaxed">
          当サイトは、事前の通知なくサービスの内容を変更、または提供を停止することがあります。これによりユーザーに生じた損害について、当サイトは一切の責任を負いません。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">第6条（著作権）</h2>
        <p className="mb-4 leading-relaxed">
          当サイトに掲載されているコンテンツ（文章、画像、ソースコードなど）の著作権は、当サイト運営者に帰属します。無断での複製、転載、改変を禁じます。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          第7条（規約の変更）
        </h2>
        <p className="mb-4 leading-relaxed">
          当サイトは、必要に応じて本規約を変更することがあります。変更後の規約は、当ページに掲載した時点で効力を生じるものとします。
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">第8条（準拠法）</h2>
        <p className="mb-4 leading-relaxed">
          本規約の解釈は日本法に準拠するものとします。
        </p>
      </section>
    </article>
  );
}
