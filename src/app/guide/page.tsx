import type { Metadata } from "next";
import Link from "next/link";
import { buildAmazonUrl } from "@/data/products";

export const metadata: Metadata = {
  title: "使い方ガイド",
  description:
    "DIY棚シミュレーターの使い方を解説。ディアウォール・ラブリコの選び方、天井高の測り方、木材カットの注意点など。",
};

const ADJUSTERS = [
  {
    name: "ディアウォール",
    method: "バネ式",
    offset: "−45mm",
    load: "20kg",
    use: "初心者・軽い棚",
  },
  {
    name: "ラブリコ",
    method: "ジャッキ式",
    offset: "−95mm",
    load: "20kg",
    use: "デザイン重視",
  },
  {
    name: "ラブリコ強力",
    method: "ジャッキ式",
    offset: "−120mm",
    load: "40kg",
    use: "重い本棚",
  },
  {
    name: "ウォリスト",
    method: "ネジ式",
    offset: "−60mm",
    load: "30kg",
    use: "大型壁面収納",
  },
];

const CUT_TIPS = [
  "カット精度は±1mm程度が理想。長すぎると入らず、短すぎると突っ張りが弱くなります",
  "ディアウォールはバネ式なので、多少の誤差は吸収できます",
  "ラブリコはジャッキで微調整できるため、2〜3mm短めでも問題ありません",
  "ウォリストはネジ式のため、正確なカットが重要です",
];

const FAQ = [
  {
    q: "天井が石膏ボードでも大丈夫？",
    a: "はい、ディアウォール・ラブリコは面で圧力を分散するため、一般的な石膏ボードの天井でも使用できます。ただし、天井裏に下地（梁や根太）がある場所に設置するとより安定します。",
  },
  {
    q: "賃貸の退去時に跡は残る？",
    a: "通常は跡が残りません。ただし長期間設置すると天井や床に圧痕がつくことがあるため、当て布やフェルトシートを挟むことをおすすめします。",
  },
  {
    q: "2×4材以外は使える？",
    a: "ディアウォール・ラブリコは2×4材（38mm×89mm）専用です。2×6材対応の製品もありますが、対応製品を必ず確認してください。",
  },
];

export default function GuidePage() {
  return (
    <div className="max-w-3xl mx-auto">
      {/* ヘッダー */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          DIY棚シミュレーター 使い方ガイド
        </h1>
        <p className="mt-2 text-gray-600">
          4ステップで棚の設計が完了。初めてのDIYでも安心です。
        </p>
      </div>

      {/* ステップ1 */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">
            1
          </span>
          <h2 className="text-xl font-bold text-gray-800">天井高を測る</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-gray-700 leading-relaxed">
            設置場所の天井高をメジャーで測りましょう。日本の一般的な賃貸住宅の天井高は
            <strong className="text-amber-700">2,300mm〜2,500mm</strong>
            です。場所によって数mm異なることがあるため、設置する正確な位置で測ることが大切です。
          </p>
          <div className="mt-3 px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
            ポイント:
            天井と床の間を測る際は、メジャーを垂直に当てて正確に測定してください。
          </div>
        </div>
      </section>

      {/* ステップ2 */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">
            2
          </span>
          <h2 className="text-xl font-bold text-gray-800">
            アジャスターを選ぶ
          </h2>
        </div>
        <p className="text-gray-700 mb-4">
          4種類のアジャスターから用途に合わせて選べます。
        </p>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  製品
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  方式
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  補正値
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  耐荷重
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  おすすめ用途
                </th>
              </tr>
            </thead>
            <tbody>
              {ADJUSTERS.map((a, i) => (
                <tr
                  key={a.name}
                  className={`border-b border-gray-100 ${i % 2 === 1 ? "bg-gray-50/50" : "bg-white"}`}
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {a.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.method}</td>
                  <td className="px-4 py-3 text-amber-700 font-mono font-medium">
                    {a.offset}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.load}</td>
                  <td className="px-4 py-3 text-gray-600">{a.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ステップ3 */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">
            3
          </span>
          <h2 className="text-xl font-bold text-gray-800">
            棚のサイズを設定
          </h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-gray-700 leading-relaxed">
            テンプレートを選ぶか、手動で柱の本数・棚板の枚数・幅・奥行を指定します。
            設定を変えるとリアルタイムで設計図と部材リストが更新されます。
          </p>
          <div className="mt-3 px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
            ポイント: <Link href="/templates" className="underline font-medium">テンプレート一覧</Link>
            から用途に合った棚を選ぶと、最適な初期設定で始められます。
          </div>
        </div>
      </section>

      {/* ステップ4 */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white font-bold flex items-center justify-center">
            4
          </span>
          <h2 className="text-xl font-bold text-gray-800">部材を購入</h2>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            部材リストの各アイテムには「Amazon」ボタンがついています。
            クリックするとAmazonの該当商品ページに遷移するので、まとめて購入できます。
          </p>
          <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm font-semibold text-blue-800 mb-1">
              ホームセンターで購入する場合
            </p>
            <p className="text-sm text-blue-700 leading-relaxed">
              2×4材はホームセンターのカットサービスを利用すると正確にカットしてもらえます。
              「カット長: ○○mm」の数値をそのまま伝えてください。1カット数十円程度です。
            </p>
          </div>
        </div>
      </section>

      {/* 木材カットの注意点 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          木材カットの注意点
        </h2>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
          <ul className="space-y-3">
            {CUT_TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700 text-sm leading-relaxed">
                <span className="text-amber-500 mt-0.5 flex-shrink-0">●</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* よくある質問 */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">よくある質問</h2>
        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <h3 className="font-semibold text-gray-800 mb-2">
                <span className="text-amber-600 mr-1">Q.</span>
                {item.q}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                <span className="text-amber-600 font-semibold mr-1">A.</span>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Amazon材料リンク */}
      <section className="mb-8">
        <p className="text-sm text-gray-600 mb-3">
          棚作りに必要な材料・工具をAmazonで探す:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { keyword: "ラブリコ 2×4 アジャスター", label: "ラブリコ" },
            { keyword: "ディアウォール 2×4", label: "ディアウォール" },
            { keyword: "2×4 木材 SPF ホワイトウッド", label: "2×4材" },
            { keyword: "電動ドライバー コードレス DIY 初心者", label: "電動ドライバー" },
          ].map((item) => (
            <a
              key={item.keyword}
              href={buildAmazonUrl(item.keyword)}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg hover:bg-amber-100 transition-colors"
            >
              🛒 {item.label}
            </a>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">※ Amazonアソシエイト・プログラムのリンクです</p>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 sm:p-8 text-white text-center mb-8">
        <h2 className="text-xl font-bold mb-2">
          さっそく棚を設計してみましょう
        </h2>
        <p className="text-amber-100 mb-4">
          天井高を入力するだけ。完全無料・登録不要。
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-colors"
        >
          シミュレーターを使う →
        </Link>
      </section>
    </div>
  );
}
