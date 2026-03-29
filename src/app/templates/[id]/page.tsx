import { SHELF_TEMPLATES } from "@/data/templates";
import { buildAmazonUrl } from "@/data/products";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";

// SSGで全テンプレートページを事前生成
export function generateStaticParams() {
  return SHELF_TEMPLATES.map((t) => ({ id: t.id }));
}

// 動的メタデータ生成
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const template = SHELF_TEMPLATES.find((t) => t.id === id);
  if (!template) return {};

  const title = `${template.name}の設計図・材料リスト`;
  const description = `${template.name}をDIYで作る方法。${template.description} 天井高を入力するだけで木材カット寸法・必要な部材リスト・設計図を自動生成。無料の棚設計ツール。`;

  return {
    title,
    description,
    keywords: template.keywords,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ja_JP",
      url: `https://diy-shelf-maker.kuras-plus.com/templates/${template.id}`,
      siteName: "DIY棚シミュレーター by kuras-plus",
      images: [{ url: `/ogp/templates/${template.id}.png`, width: 1200, height: 630 }],
    },
    alternates: {
      canonical: `https://diy-shelf-maker.kuras-plus.com/templates/${template.id}`,
    },
  };
}

// テンプレート詳細情報（各テンプレートIDに応じたコンテンツ）
const TEMPLATE_DETAILS: Record<
  string,
  { steps: string[]; tips: string[]; materials: string[] }
> = {
  bookshelf: {
    steps: [
      "設置場所の天井高を測定します（メジャーで正確に）",
      "2×4材を2本用意し、計算されたカット寸法でカットします",
      "ラブリコを2×4材の上下に取り付けます",
      "柱を壁際に立て、ジャッキで固定します",
      "棚板を棚受け金具で取り付けます（下段から順に）",
    ],
    tips: [
      "漫画の収納には棚間隔200mmが最適です",
      "文庫本なら棚間隔180mmで段数を増やせます",
      "A5判・B6判を混在させる場合は220mmを推奨",
      "重い本は下段に集中させると安定します",
    ],
    materials: [
      "2×4材（SPF材）× 2本",
      "ラブリコ アジャスター × 2セット",
      "2×4材 棚板 × 5枚",
      "棚受け金具 × 5組",
      "ビス（木ネジ）",
    ],
  },
  "wall-shelf": {
    steps: [
      "天井高を測定し、設置位置を決めます",
      "2×4材を2本カットして準備します",
      "ラブリコで柱を固定します",
      "ブラケットで棚板を手前に張り出すように取り付けます",
      "水平器で棚板の水平を確認します",
    ],
    tips: [
      "長辺を壁側にするとスリムな見た目になります",
      "ブラケットの耐荷重を確認して重いものは避けましょう",
      "飾り棚として使う場合は棚間隔を広めに取ると見栄えが良いです",
      "L字ブラケットよりアイアンブラケットがおしゃれです",
    ],
    materials: [
      "2×4材（SPF材）× 2本",
      "ラブリコ アジャスター × 2セット",
      "2×4材 棚板 × 4枚",
      "アイアンブラケット × 4組",
      "ビス（木ネジ）",
    ],
  },
  "labrico-wall-storage": {
    steps: [
      "壁面の幅と天井高を測定します",
      "柱3本分の2×4材をカットします",
      "3本の柱を等間隔に配置し、ラブリコで固定します",
      "柱間に棚板を渡して固定します",
      "全体の安定性を確認し、必要に応じて補強します",
    ],
    tips: [
      "柱3本で2スパンにすると幅広の壁面収納になります",
      "柱の間隔は600mm程度が棚板の強度的に最適です",
      "最上段と最下段の棚は柱を連結する補強にもなります",
      "地震対策として、重い物は必ず下段に配置してください",
    ],
    materials: [
      "2×4材（SPF材）× 3本",
      "ラブリコ アジャスター × 3セット",
      "2×4材 棚板 × 5枚",
      "棚受け金具 × 10組",
      "ビス（木ネジ）",
    ],
  },
  "diawall-bookshelf": {
    steps: [
      "設置場所の天井高を測定します",
      "2×4材を「天井高 − 45mm」でカットします",
      "ディアウォールのパッドを上下に装着します",
      "上側のバネを縮めながら柱を立てます",
      "棚板を棚受け金具で取り付けます",
    ],
    tips: [
      "ディアウォールはバネ式なので工具不要で取り付け簡単です",
      "カット寸法は天井高 − 45mm（ラブリコより10mm長い）",
      "バネの力で固定するため、滑りやすい床では注意が必要です",
      "設置後に手で揺すって安定性を確認してください",
    ],
    materials: [
      "2×4材（SPF材）× 2本",
      "ディアウォール アジャスター × 2セット",
      "2×4材 棚板 × 5枚",
      "棚受け金具 × 5組",
      "ビス（木ネジ）",
    ],
  },
  "2x4-basic-shelf": {
    steps: [
      "ホームセンターで2×4材を必要な本数購入します",
      "カットサービスで計算寸法にカットしてもらいます",
      "アジャスターを取り付けて柱を設置します",
      "棚板を好みの高さに取り付けます",
      "全体の水平と安定を確認して完成です",
    ],
    tips: [
      "2×4材は6フィート（約1,820mm）が標準。天井高2,400mmなら8フィートが必要です",
      "SPF材は柔らかくてビス打ちが楽。価格も1本300〜500円程度です",
      "カットサービスは1カット30〜50円。正確にカットしてもらえます",
      "反りのない真っ直ぐな材を選びましょう（端から覗いて確認）",
    ],
    materials: [
      "2×4材（SPF材）6ft or 8ft × 2本",
      "アジャスター × 2セット",
      "棚板（2×4材 or 1×4材）",
      "棚受け金具 × 必要組数",
      "ビス（木ネジ）",
    ],
  },
  "rental-kitchen-rack": {
    steps: [
      "キッチンの設置スペースの天井高と幅を測ります",
      "2×4材をカットし、ラブリコで柱を設置します",
      "棚板を4段取り付けます（調味料・食器に合わせた間隔で）",
      "下段は重い鍋類、上段は軽い調味料用に配置します",
      "必要に応じてフックやバーを追加します",
    ],
    tips: [
      "キッチンは湿気が多いため、塗装やオイル仕上げで木材を保護しましょう",
      "調味料棚は間隔150〜180mmがちょうどいいサイズです",
      "コンロ付近は避け、水回りから少し離れた場所がベストです",
      "奥行200mmあれば一般的な調味料ボトルが収まります",
    ],
    materials: [
      "2×4材（SPF材）× 2本",
      "ラブリコ アジャスター × 2セット",
      "2×4材 棚板 × 4枚",
      "棚受け金具 × 4組",
      "ビス（木ネジ）・ワトコオイル（保護用）",
    ],
  },
  "shoe-rack": {
    steps: [
      "玄関の天井高と設置可能な幅を測定します",
      "2×4材をカットしてラブリコで柱を固定します",
      "靴のサイズに合わせて棚間隔を設定します",
      "6段の棚板を取り付けます",
      "ブーツ用に1〜2段は間隔を広げると便利です",
    ],
    tips: [
      "靴の高さに合わせて棚間隔は150〜200mmが基本です",
      "ブーツは300mm以上の間隔が必要です",
      "奥行250mmあればメンズの靴（27cm）も収まります",
      "通気性のため棚板にスノコ状の穴あきボードもおすすめです",
      "1段あたり3〜4足収納可能。6段で最大24足",
    ],
    materials: [
      "2×4材（SPF材）× 2本",
      "ラブリコ アジャスター × 2セット",
      "棚板 × 6枚",
      "棚受け金具 × 6組",
      "ビス（木ネジ）",
    ],
  },
  "desk-shelf": {
    steps: [
      "デスク上の天井高を測定します",
      "2×4材をカットしてデスク奥に柱を設置します",
      "モニター上の高さに1段目の棚を設置します",
      "残り2段を好みの間隔で取り付けます",
      "ケーブル整理用のフックやクリップを追加するのも便利です",
    ],
    tips: [
      "モニター上のスペースを有効活用するのがポイント",
      "柱をデスク奥に設置するとデスク上のスペースを圧迫しません",
      "棚板の奥行200mmで小物やフィギュアのディスプレイに最適",
      "LED間接照明を仕込むとおしゃれなデスク環境になります",
    ],
    materials: [
      "2×4材（SPF材）× 2本",
      "ラブリコ アジャスター × 2セット",
      "2×4材 棚板 × 3枚",
      "棚受け金具 × 3組",
      "ビス（木ネジ）",
    ],
  },
  "wallist-heavy-shelf": {
    steps: [
      "設置場所の天井高を測定します",
      "2×4材を3本カットします（天井高 − 60mm）",
      "ウォリストの金具を柱の上下に取り付けます",
      "ネジ式で天井と床にしっかり固定します",
      "棚板を取り付け、重い物も安心して配置します",
    ],
    tips: [
      "ウォリストはネジ式で最も固定力が高いアジャスターです",
      "耐荷重は柱1本あたり30kgと高耐荷重",
      "図鑑や大型書籍の収納にも適しています",
      "3本柱2スパン構成で壁面一杯の大型収納が可能",
      "ネジ式のため、カット寸法の精度が重要です（±1mm以内推奨）",
    ],
    materials: [
      "2×4材（SPF材）× 3本",
      "ウォリスト アジャスター × 3セット",
      "2×4材 棚板 × 4枚",
      "棚受け金具 × 8組",
      "ビス（木ネジ）",
    ],
  },
  "sunoko-shelf": {
    steps: [
      "設置場所の天井高を測定します",
      "2×4材を長辺を壁側にして柱を立てます",
      "ブラケットで棚板を手前に張り出すように取り付けます",
      "3段の棚を等間隔に配置します",
      "観葉植物や雑貨をディスプレイして完成",
    ],
    tips: [
      "すのこテイストにするには、棚板に無塗装のパイン材がおすすめ",
      "長辺壁側で柱をスリムに見せるのがカフェ風のコツ",
      "棚間隔を広め（350mm以上）にすると植物が映えます",
      "アイアンブラケットを使うとカフェ感がアップします",
      "塗装するならブライワックスやワトコオイルがおすすめ",
    ],
    materials: [
      "2×4材（SPF材）× 2本",
      "ラブリコ アジャスター × 2セット",
      "2×4材 or すのこ板 × 3枚",
      "アイアンブラケット × 3組",
      "ビス（木ネジ）・ブライワックス（塗装用）",
    ],
  },
  "closet-shelf": {
    steps: [
      "押入れ/クローゼット内部の高さと幅を測定します",
      "2×4材をカットし、ラブリコ強力タイプで柱を固定します",
      "棚板を3段取り付けます",
      "衣類ケースやボックスのサイズに合わせて間隔を調整します",
      "上段に季節外の衣類、下段に日常の衣類を配置します",
    ],
    tips: [
      "押入れ内部は天井高が低い（1,700〜1,800mm程度）のでfullHeightはオフに",
      "ラブリコ強力タイプなら耐荷重40kgで重い衣類ケースも安心",
      "奥行300mmあれば衣類ケースがちょうど収まります",
      "中段に突っ張り棒を渡してハンガーラックとしても使えます",
    ],
    materials: [
      "2×4材（SPF材）× 2本",
      "ラブリコ強力タイプ アジャスター × 2セット",
      "2×4材 棚板 × 3枚",
      "棚受け金具 × 3組",
      "ビス（木ネジ）",
    ],
  },
  "laundry-shelf": {
    steps: [
      "洗濯機上の天井高と幅を測定します",
      "洗濯機の幅に合わせて柱の設置位置を決めます",
      "2×4材をカットしてラブリコで柱を固定します",
      "洗濯機の上方に3段の棚を取り付けます",
      "洗剤、タオル、ランドリーバスケットなどを配置します",
    ],
    tips: [
      "洗濯機の上方500mm以上の位置から棚を設置するのが目安",
      "奥行250mmで洗剤ボトルがちょうど収まります",
      "湿気が多い場所なので防水塗装がおすすめです",
      "タオルバーを柱間に渡すとタオル掛けにもなります",
      "洗濯機の振動が伝わりにくいよう、柱は洗濯機に触れない位置に",
    ],
    materials: [
      "2×4材（SPF材）× 2本",
      "ラブリコ アジャスター × 2セット",
      "2×4材 棚板 × 3枚",
      "棚受け金具 × 3組",
      "ビス（木ネジ）・防水塗料",
    ],
  },
};

const TEMPLATE_FAQ: Record<string, { q: string; a: string }[]> = {
  bookshelf: [
    { q: "本棚の棚間隔はどのくらいが最適ですか？", a: "漫画は200mm、文庫は180mm、A5判は220mmが目安です。当シミュレーターで棚の高さを自動計算できます。" },
    { q: "2×4材の本棚は何冊くらい収納できますか？", a: "柱2本・棚5段の標準構成で、漫画なら約150冊、文庫なら約200冊収納できます。" },
    { q: "本の重さに2×4材の棚は耐えられますか？", a: "ラブリコの耐荷重は棚1段あたり約5kg。漫画なら1段30冊程度まで安心です。重い本はラブリコ強力タイプ（耐荷重40kg）を推奨します。" },
  ],
  "wall-shelf": [
    { q: "壁掛け棚と通常の棚の違いは何ですか？", a: "壁掛け棚は柱の長辺を壁側にしてスリムに設置し、ブラケットで棚板を手前に張り出す構成です。圧迫感が少なくディスプレイ向きです。" },
    { q: "壁掛け棚の耐荷重は？", a: "アイアンブラケットで棚1枚あたり約5kg。軽い雑貨やフォトフレームに最適ですが、重い本には通常の本棚タイプを推奨します。" },
    { q: "ブラケットの種類はどれを選べばいい？", a: "デザイン重視ならアイアンブラケット、コスパ重視ならL字金具がおすすめです。当シミュレーターで金具も自動見積もりされます。" },
  ],
  "labrico-wall-storage": [
    { q: "ラブリコの壁面棚は柱何本必要ですか？", a: "標準は3本（2スパン）です。幅1,200mm程度の壁面収納になります。柱間隔は600mm程度が棚板の強度的に最適です。" },
    { q: "壁面棚の地震対策は？", a: "重い物は下段に配置し、最上段・最下段の棚板で柱を連結すると横揺れに強くなります。転倒防止ワイヤーの併用も推奨します。" },
    { q: "壁一面の棚はいくらくらいかかりますか？", a: "柱3本+棚5段の標準構成で約15,000〜20,000円が目安です。当シミュレーターで正確な費用を自動計算できます。" },
  ],
  "diawall-bookshelf": [
    { q: "ディアウォールとラブリコどちらが初心者向き？", a: "ディアウォールはバネ式で工具不要、一人で設置可能。手軽さではディアウォールが初心者向きです。詳しい比較は作り方ガイドをご覧ください。" },
    { q: "ディアウォールのカット寸法は？", a: "天井高から45mm引いた長さです。ラブリコ（-95mm）より長くカットします。当シミュレーターで自動計算されます。" },
    { q: "ディアウォールで2段以上の柱は作れますか？", a: "1本の柱は天井まで通しが基本です。中間ジョイントもありますが、強度面では1本通しを推奨します。" },
  ],
  "2x4-basic-shelf": [
    { q: "2×4材はどこで買えますか？", a: "ホームセンター（カインズ、コーナン、コメリ等）で1本300〜600円程度で購入できます。Amazonでも配送可能です。" },
    { q: "2×4材のカットは自分でできますか？", a: "ホームセンターのカットサービス（1カット30〜50円）が正確でおすすめです。ノコギリでも可能ですが精度が落ちます。" },
    { q: "SPF材とは何ですか？", a: "Spruce（トウヒ）・Pine（松）・Fir（モミ）の頭文字で、北米産の安価な針葉樹材です。柔らかくDIY向きですが、屋外使用には不向きです。" },
  ],
  "rental-kitchen-rack": [
    { q: "キッチンの湿気で木材は傷みませんか？", a: "無塗装のまま使うとカビの原因になります。ワトコオイルやウレタン塗装で木材を保護しましょう。防水性の高い塗料がおすすめです。" },
    { q: "コンロの近くに設置しても大丈夫？", a: "火気の近くは避けてください。コンロから最低50cm以上離れた場所に設置し、油はねがかからない位置を選びましょう。" },
    { q: "調味料棚の棚間隔はどのくらい？", a: "一般的な調味料ボトルは高さ150〜200mm。棚間隔は180mmがちょうどいいサイズです。" },
  ],
  "shoe-rack": [
    { q: "靴棚に何足くらい収納できますか？", a: "6段構成で最大24足（1段あたり3〜4足）収納可能です。ブーツ用に1〜2段は間隔を広げると便利です。" },
    { q: "玄関の靴棚に通気性は必要？", a: "はい。湿気がこもるとカビや臭いの原因になります。棚板にスノコ状の穴あきボードを使うと通気性が確保できます。" },
    { q: "奥行はどのくらい必要？", a: "メンズ27cmの靴で奥行250mm必要です。レディースなら200mmでも収まります。当シミュレーターで奥行も設定可能です。" },
  ],
  "desk-shelf": [
    { q: "デスク上の棚は地震で倒れませんか？", a: "ラブリコで天井固定するため、通常の置き棚より安定しています。ただしモニターなど重い物は下段に配置してください。" },
    { q: "モニターの上に棚板を設置できますか？", a: "はい。柱をデスク奥に配置し、モニター上方500mm以上の高さから棚板を設置するのがおすすめです。" },
    { q: "デスク上棚の費用はいくら？", a: "柱2本+棚3段で約8,000〜12,000円が目安です。当シミュレーターで正確な費用を算出できます。" },
  ],
  "wallist-heavy-shelf": [
    { q: "ウォリストの耐荷重はどのくらいですか？", a: "柱1本あたり30kgで、ラブリコ（20kg）より高耐荷重です。図鑑や大型書籍の収納に適しています。" },
    { q: "ウォリストの設置にはどんな工具が必要？", a: "電動ドライバーが必須です。ネジ式のため、カット精度も±1mm以内が推奨されます。" },
    { q: "ウォリストとラブリコの違いは？", a: "ウォリストはネジ式で固定力最強、ラブリコはジャッキ式で微調整が容易です。重い物を載せるならウォリスト、手軽さならラブリコです。" },
  ],
  "sunoko-shelf": [
    { q: "すのこ風のカフェ棚にするコツは？", a: "長辺を壁側にしてスリムな柱にし、アイアンブラケットで棚板を張り出すのがカフェ風のポイントです。ブライワックスで塗装するとさらにおしゃれになります。" },
    { q: "観葉植物を棚に置く際の注意点は？", a: "水やりで木材が濡れないよう、鉢の下に受け皿を敷いてください。棚間隔は350mm以上あると植物が映えます。" },
    { q: "すのこ板はどこで手に入りますか？", a: "100均（ダイソー、セリア）のすのこ板が手軽です。ホームセンターではパイン材の板がカフェ風に合います。" },
  ],
  "closet-shelf": [
    { q: "押入れの天井高が低いのですが対応できますか？", a: "はい。押入れ内部は通常1,700〜1,800mm程度です。「フル高さ」をオフにして実際の高さを入力してください。" },
    { q: "ラブリコ強力タイプを使う理由は？", a: "押入れ内は衣類ケースなど重い物を置くため、耐荷重40kgの強力タイプが安心です。通常タイプでは荷重不足になる可能性があります。" },
    { q: "衣類ケースのサイズに合わせた棚間隔は？", a: "一般的な衣類ケースは高さ200〜300mm。棚間隔は350mm程度に設定すると出し入れしやすくなります。" },
  ],
  "laundry-shelf": [
    { q: "洗濯機の振動は棚に影響しますか？", a: "柱は洗濯機に直接触れない位置に設置してください。振動で緩みが生じた場合はラブリコのジャッキを増し締めしましょう。" },
    { q: "洗面所の湿気対策は？", a: "木材に防水塗料を塗ることをおすすめします。ウレタンニスや油性ニスが効果的です。無塗装のまま使うとカビの原因になります。" },
    { q: "洗濯機の上の棚はどの高さから設置？", a: "洗濯機の蓋が完全に開く高さ+100mm以上が目安です。一般的には洗濯機上方500mm以上の位置から棚を設置します。" },
  ],
};

export default async function TemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const template = SHELF_TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();

  const details = TEMPLATE_DETAILS[template.id];

  // 材料名からAmazon検索キーワードへのマッピング
  const materialKeywords: Record<string, string> = {
    "2×4材": "2×4 木材 SPF ホワイトウッド",
    "ラブリコ": "ラブリコ 2×4 アジャスター",
    "ラブリコ強力": "ラブリコ 2×4 強力 アジャスター",
    "ディアウォール": "ディアウォール 2×4 アジャスター",
    "ウォリスト": "ウォリスト 2×4 アジャスター",
    "2×4材 棚板": "2×4 木材 SPF ホワイトウッド",
    "棚受け金具": "2×4 棚受け 金具 ラブリコ",
    "アイアンブラケット": "アイアンブラケット 棚受け DIY",
    "ビス": "木ネジ DIY 棚 セット",
    "ワトコオイル": "ワトコオイル 木材 塗装 DIY",
    "ブライワックス": "ブライワックス 木材 塗装",
    "防水塗料": "防水塗料 木材 DIY",
    "すのこ": "すのこ 棚板 DIY",
  };
  function getAmazonKeyword(material: string): string | null {
    for (const [key, keyword] of Object.entries(materialKeywords)) {
      if (material.includes(key)) return keyword;
    }
    return null;
  }

  // テンプレートページ用JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${template.name}の作り方 - DIY設計ガイド`,
    description: `${template.name}をDIYで作る方法。${template.description}`,
    step: details?.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
    tool: [
      { "@type": "HowToTool", name: "メジャー" },
      { "@type": "HowToTool", name: "電動ドライバー" },
      { "@type": "HowToTool", name: "水平器" },
    ],
    supply: details?.materials.map((m) => ({
      "@type": "HowToSupply",
      name: m,
    })),
  };

  const faqJsonLd = TEMPLATE_FAQ[template.id] ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: TEMPLATE_FAQ[template.id].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <article className="max-w-3xl mx-auto">
        {/* パンくずリスト */}
        <Breadcrumb
          items={[
            { name: "ホーム", href: "/" },
            { name: "テンプレート一覧", href: "/templates" },
            { name: `${template.name}の設計図・材料リスト` },
          ]}
        />

        {/* ヘッダー */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 sm:p-8 border border-amber-100 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{template.icon}</span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                {template.name}の設計図・材料リスト
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                DIY棚シミュレーターで自動計算
              </p>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mt-4">
            {template.description}{" "}
            天井高を入力するだけで木材カット寸法・必要な部材リスト・設計図を自動生成します。
          </p>
          <div className="mt-4">
            <Link
              href={`/?template=${template.id}`}
              className="inline-flex items-center px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
            >
              このテンプレートでシミュレーションする →
            </Link>
          </div>
        </div>

        {/* 必要な材料 */}
        {details && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {template.name}に必要な材料
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <ul className="space-y-3">
                {details.materials.map((m, i) => {
                  const keyword = getAmazonKeyword(m);
                  return (
                    <li key={i} className="flex items-center justify-between gap-2 text-gray-700">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-500 mt-0.5">●</span>
                        <span>{m}</span>
                      </div>
                      {keyword && (
                        <a
                          href={buildAmazonUrl(keyword)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs font-medium hover:bg-amber-200 transition-colors flex-shrink-0"
                        >
                          Amazon
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* 作り方の手順 */}
        {details && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {template.name}の作り方
            </h2>
            <div className="space-y-4">
              {details.steps.map((step, i) => (
                <div
                  key={i}
                  className="flex gap-4 bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
                    {i + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed pt-1">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* コツ・注意点 */}
        {details && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {template.name}のコツ・ポイント
            </h2>
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-5">
              <ul className="space-y-2">
                {details.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-700">
                    <span className="text-amber-600 mt-0.5">💡</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* よくある質問 */}
        {details && TEMPLATE_FAQ[template.id] && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {template.name}のよくある質問
            </h2>
            <div className="space-y-4">
              {TEMPLATE_FAQ[template.id].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
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
        )}

        {/* CTA */}
        <section className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 sm:p-8 text-white text-center mb-8">
          <h2 className="text-xl font-bold mb-2">
            {template.name}を今すぐ設計する
          </h2>
          <p className="text-amber-100 mb-4">
            天井高を入力するだけ。完全無料・登録不要。
          </p>
          <Link
            href={`/?template=${template.id}`}
            className="inline-flex items-center px-6 py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-colors"
          >
            シミュレーターを使う →
          </Link>
        </section>

        {/* 関連テンプレートへの内部リンク */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            他の棚テンプレート
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SHELF_TEMPLATES.filter((t) => t.id !== template.id)
              .slice(0, 6)
              .map((t) => (
                <Link
                  key={t.id}
                  href={`/templates/${t.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-amber-300 hover:shadow-sm transition-all"
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="font-medium text-gray-800 text-sm">
                    {t.name}
                  </div>
                </Link>
              ))}
          </div>
        </section>
      </article>
    </>
  );
}
