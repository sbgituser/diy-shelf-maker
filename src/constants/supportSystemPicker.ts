// ── 支柱システム比較ツール 定数データ ──

export interface SupportSystem {
  id: string;
  name: string;
  brand: string;
  mechanism: string;
  maxLoad: number;
  priceRange: [number, number];
  installDifficulty: 1 | 2 | 3 | 4 | 5;
  rentalFriendly: boolean;
  wallDamage: "なし" | "微小" | "あり";
  adjustable: boolean;
  appearance: 1 | 2 | 3 | 4 | 5;
  stability: 1 | 2 | 3 | 4 | 5;
  requiredWood: string;
  amazonKeyword: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  imageDescription: string;
}

export interface PickerQuestion {
  id: string;
  question: string;
  options: { label: string; scores: Record<string, number> }[];
}

export const SUPPORT_SYSTEMS: SupportSystem[] = [
  {
    id: "diawall",
    name: "ディアウォール",
    brand: "若井産業",
    mechanism: "バネ式（上パッドにバネ内蔵、押し上げて固定）",
    maxLoad: 20,
    priceRange: [800, 1200],
    installDifficulty: 2,
    rentalFriendly: true,
    wallDamage: "なし",
    adjustable: false,
    appearance: 4,
    stability: 3,
    requiredWood: "2×4材（38×89mm）",
    amazonKeyword: "ディアウォール 2×4 アジャスター",
    pros: [
      "工具不要で設置が簡単",
      "賃貸でも安心して使える",
      "見た目がすっきり",
      "カラーバリエーション豊富",
    ],
    cons: [
      "耐荷重がやや低い（20kg/本）",
      "バネ式のため経年で緩みやすい",
      "高さの微調整が難しい",
      "横方向の力に弱い",
    ],
    bestFor: ["軽い小物の飾り棚", "賃貸の壁面収納", "初めてのDIY"],
    imageDescription: "バネ式上下パッドで天井・床に突っ張る支柱",
  },
  {
    id: "labrico",
    name: "ラブリコ",
    brand: "平安伸銅工業",
    mechanism: "ネジ式アジャスター（上部のネジを回して突っ張り固定）",
    maxLoad: 40,
    priceRange: [900, 1300],
    installDifficulty: 2,
    rentalFriendly: true,
    wallDamage: "なし",
    adjustable: true,
    appearance: 4,
    stability: 4,
    requiredWood: "2×4材（38×89mm）",
    amazonKeyword: "ラブリコ 2×4 アジャスター",
    pros: [
      "ネジ式で突っ張り力の調整が簡単",
      "耐荷重がディアウォールより高い",
      "高さの微調整が可能",
      "デザイン性が高い",
    ],
    cons: [
      "定期的な増し締めが必要",
      "ディアウォールよりやや高価",
      "重い物を載せすぎると天井に負荷",
    ],
    bestFor: ["本棚", "見せる収納", "賃貸のメイン収納", "キッチン収納"],
    imageDescription: "ネジ式アジャスターで天井に突っ張る支柱",
  },
  {
    id: "walist",
    name: "ウォリスト",
    brand: "和気産業",
    mechanism: "金属フレーム＋突っ張りジャッキ（束ねて使用可）",
    maxLoad: 60,
    priceRange: [1500, 2500],
    installDifficulty: 3,
    rentalFriendly: true,
    wallDamage: "なし",
    adjustable: true,
    appearance: 3,
    stability: 5,
    requiredWood: "2×4材（38×89mm）を2本束ね",
    amazonKeyword: "ウォリスト 2×4 突っ張り",
    pros: [
      "圧倒的な耐荷重（60kg/本）",
      "2本束ねでさらに強固",
      "棚柱レール対応で棚板の高さ変更自在",
      "本格的な壁面収納が作れる",
    ],
    cons: [
      "価格がやや高い",
      "金属パーツの見た目がやや無骨",
      "設置にやや手間がかかる",
      "2本束ねだと場所を取る",
    ],
    bestFor: ["重量物の収納", "工具棚", "本格壁面収納", "ガレージ収納"],
    imageDescription: "金属フレームで2×4材を束ねる強固な支柱",
  },
  {
    id: "tension-rod",
    name: "突っ張り棒",
    brand: "各社（平安伸銅・アイリスオーヤマ等）",
    mechanism: "テンション式（バネまたはネジで横方向に突っ張り）",
    maxLoad: 20,
    priceRange: [500, 2000],
    installDifficulty: 1,
    rentalFriendly: true,
    wallDamage: "なし",
    adjustable: true,
    appearance: 2,
    stability: 2,
    requiredWood: "不要（単体で使用）",
    amazonKeyword: "突っ張り棒 強力 棚",
    pros: [
      "木材カット不要ですぐ使える",
      "最も手軽で安価",
      "設置・撤去が一瞬",
      "水回りにも使いやすい",
    ],
    cons: [
      "耐荷重が低め",
      "見た目がシンプルすぎる",
      "長いスパンだとたわみやすい",
      "落下リスクがある",
    ],
    bestFor: ["洗面所・トイレの収納", "クローゼット内", "軽い物の一時置き", "キッチン小物"],
    imageDescription: "テンション式で壁間に突っ張る棒",
  },
  {
    id: "l-bracket",
    name: "壁付けL字金具",
    brand: "各社（IKEA・カインズ等）",
    mechanism: "ネジで壁に直接固定（壁の下地に打ち込み）",
    maxLoad: 50,
    priceRange: [200, 500],
    installDifficulty: 3,
    rentalFriendly: false,
    wallDamage: "あり",
    adjustable: false,
    appearance: 3,
    stability: 5,
    requiredWood: "任意の棚板",
    amazonKeyword: "棚受け L字金具 アイアン",
    pros: [
      "最もシンプルで確実な固定方法",
      "コストが圧倒的に安い",
      "耐荷重が高い",
      "デザインバリエーション豊富",
    ],
    cons: [
      "壁にネジ穴が開く（賃貸NG）",
      "壁の下地（柱・間柱）の位置確認が必要",
      "一度付けると位置変更が大変",
      "石膏ボードだけでは強度不足",
    ],
    bestFor: ["持ち家の壁面収納", "キッチンの飾り棚", "重い物を載せたい場合"],
    imageDescription: "L字型の金具で壁に棚板を固定",
  },
];

export const SUPPORT_SYSTEMS_MAP = new Map(
  SUPPORT_SYSTEMS.map((s) => [s.id, s])
);

export const PICKER_QUESTIONS: PickerQuestion[] = [
  {
    id: "housing",
    question: "お住まいのタイプは？",
    options: [
      {
        label: "賃貸（壁に穴を開けたくない）",
        scores: { diawall: 3, labrico: 3, walist: 3, "tension-rod": 3, "l-bracket": 0 },
      },
      {
        label: "持ち家（壁への固定OK）",
        scores: { diawall: 2, labrico: 2, walist: 2, "tension-rod": 1, "l-bracket": 3 },
      },
    ],
  },
  {
    id: "load",
    question: "棚に載せるものは？",
    options: [
      {
        label: "軽い小物・雑貨（〜5kg程度）",
        scores: { diawall: 3, labrico: 3, walist: 2, "tension-rod": 3, "l-bracket": 2 },
      },
      {
        label: "本・食器（5〜20kg程度）",
        scores: { diawall: 2, labrico: 3, walist: 3, "tension-rod": 1, "l-bracket": 3 },
      },
      {
        label: "重い工具・家電（20kg以上）",
        scores: { diawall: 0, labrico: 1, walist: 3, "tension-rod": 0, "l-bracket": 3 },
      },
    ],
  },
  {
    id: "budget",
    question: "支柱1本あたりの予算は？",
    options: [
      {
        label: "〜1,000円（できるだけ安く）",
        scores: { diawall: 2, labrico: 1, walist: 0, "tension-rod": 3, "l-bracket": 3 },
      },
      {
        label: "1,000〜2,000円",
        scores: { diawall: 3, labrico: 3, walist: 2, "tension-rod": 2, "l-bracket": 2 },
      },
      {
        label: "2,000円以上（性能重視）",
        scores: { diawall: 2, labrico: 2, walist: 3, "tension-rod": 1, "l-bracket": 2 },
      },
    ],
  },
  {
    id: "appearance",
    question: "見た目の重要度は？",
    options: [
      {
        label: "重視する（インテリアに馴染ませたい）",
        scores: { diawall: 3, labrico: 3, walist: 1, "tension-rod": 0, "l-bracket": 2 },
      },
      {
        label: "普通（そこそこ見えれば良い）",
        scores: { diawall: 2, labrico: 2, walist: 2, "tension-rod": 2, "l-bracket": 2 },
      },
      {
        label: "気にしない（機能優先）",
        scores: { diawall: 1, labrico: 1, walist: 3, "tension-rod": 3, "l-bracket": 3 },
      },
    ],
  },
  {
    id: "location",
    question: "設置場所は？",
    options: [
      {
        label: "リビング・寝室の壁際",
        scores: { diawall: 3, labrico: 3, walist: 2, "tension-rod": 1, "l-bracket": 3 },
      },
      {
        label: "部屋の間仕切り・パーティション",
        scores: { diawall: 2, labrico: 3, walist: 3, "tension-rod": 0, "l-bracket": 0 },
      },
      {
        label: "洗面所・トイレ・ランドリー",
        scores: { diawall: 1, labrico: 2, walist: 1, "tension-rod": 3, "l-bracket": 2 },
      },
      {
        label: "キッチン",
        scores: { diawall: 2, labrico: 3, walist: 2, "tension-rod": 2, "l-bracket": 2 },
      },
      {
        label: "ガレージ・倉庫",
        scores: { diawall: 0, labrico: 1, walist: 3, "tension-rod": 1, "l-bracket": 3 },
      },
    ],
  },
];
