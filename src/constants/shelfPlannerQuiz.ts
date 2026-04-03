// ── DIY棚プランナー診断 定数データ ──

export interface QuizQuestion {
  id: string;
  question: string;
  description: string;
  options: QuizOption[];
}

export interface QuizOption {
  label: string;
  icon: string;
  description: string;
  scores: Record<string, number>;
}

export interface ShelfPlanResult {
  id: string;
  title: string;
  description: string;
  icon: string;
  accentColor: string;
  difficulty: 1 | 2 | 3;
  estimatedTime: string;
  estimatedCost: [number, number];
  materials: { name: string; quantity: string; amazonKeyword: string }[];
  tools: string[];
  steps: string[];
  relatedTemplate: string | null;
  relatedParts: string[];
  shareText: string;
}

// ── 質問5問 ──

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "location",
    question: "棚を置きたい場所は？",
    description: "設置場所によって最適な棚のタイプが変わります",
    options: [
      {
        label: "リビング",
        icon: "🛋️",
        description: "本や雑貨のディスプレイに",
        scores: {
          diawall_bookshelf: 3,
          labrico_wall: 3,
          floating_shelf: 2,
          sunoko_rack: 1,
          kitchen_rack: 0,
          open_shelf_2x4: 3,
          osb_industrial: 2,
          modular_unit: 2,
        },
      },
      {
        label: "寝室",
        icon: "🛏️",
        description: "衣類や小物の整理に",
        scores: {
          diawall_bookshelf: 2,
          labrico_wall: 3,
          floating_shelf: 2,
          sunoko_rack: 1,
          kitchen_rack: 0,
          open_shelf_2x4: 2,
          osb_industrial: 1,
          modular_unit: 3,
        },
      },
      {
        label: "キッチン",
        icon: "🍳",
        description: "調味料や食器の収納に",
        scores: {
          diawall_bookshelf: 0,
          labrico_wall: 1,
          floating_shelf: 1,
          sunoko_rack: 2,
          kitchen_rack: 3,
          open_shelf_2x4: 1,
          osb_industrial: 0,
          modular_unit: 2,
        },
      },
      {
        label: "洗面所・脱衣所",
        icon: "🚿",
        description: "タオルや洗剤の収納に",
        scores: {
          diawall_bookshelf: 0,
          labrico_wall: 2,
          floating_shelf: 1,
          sunoko_rack: 2,
          kitchen_rack: 2,
          open_shelf_2x4: 1,
          osb_industrial: 0,
          modular_unit: 3,
        },
      },
      {
        label: "玄関",
        icon: "🚪",
        description: "靴や鍵の整理に",
        scores: {
          diawall_bookshelf: 1,
          labrico_wall: 2,
          floating_shelf: 2,
          sunoko_rack: 2,
          kitchen_rack: 0,
          open_shelf_2x4: 1,
          osb_industrial: 1,
          modular_unit: 2,
        },
      },
    ],
  },
  {
    id: "items",
    question: "何を収納しますか？",
    description: "収納物の重さや大きさで棚の強度が決まります",
    options: [
      {
        label: "本・雑誌",
        icon: "📚",
        description: "漫画・文庫から図鑑まで",
        scores: {
          diawall_bookshelf: 3,
          labrico_wall: 2,
          floating_shelf: 0,
          sunoko_rack: 0,
          kitchen_rack: 0,
          open_shelf_2x4: 3,
          osb_industrial: 2,
          modular_unit: 2,
        },
      },
      {
        label: "キッチン用品・食器",
        icon: "🍽️",
        description: "調味料・食器・調理器具",
        scores: {
          diawall_bookshelf: 0,
          labrico_wall: 1,
          floating_shelf: 1,
          sunoko_rack: 2,
          kitchen_rack: 3,
          open_shelf_2x4: 1,
          osb_industrial: 0,
          modular_unit: 2,
        },
      },
      {
        label: "洋服・タオル",
        icon: "👕",
        description: "たたんだ衣類やリネン類",
        scores: {
          diawall_bookshelf: 0,
          labrico_wall: 3,
          floating_shelf: 1,
          sunoko_rack: 1,
          kitchen_rack: 1,
          open_shelf_2x4: 2,
          osb_industrial: 0,
          modular_unit: 3,
        },
      },
      {
        label: "インテリア小物",
        icon: "🪴",
        description: "観葉植物・写真立て・雑貨",
        scores: {
          diawall_bookshelf: 1,
          labrico_wall: 2,
          floating_shelf: 3,
          sunoko_rack: 3,
          kitchen_rack: 0,
          open_shelf_2x4: 1,
          osb_industrial: 3,
          modular_unit: 1,
        },
      },
      {
        label: "工具・DIY用品",
        icon: "🔧",
        description: "電動工具・ネジ・塗料など",
        scores: {
          diawall_bookshelf: 1,
          labrico_wall: 2,
          floating_shelf: 0,
          sunoko_rack: 0,
          kitchen_rack: 0,
          open_shelf_2x4: 3,
          osb_industrial: 2,
          modular_unit: 3,
        },
      },
    ],
  },
  {
    id: "housing",
    question: "お住まいのタイプは？",
    description: "壁への穴あけ可否で使える部材が変わります",
    options: [
      {
        label: "賃貸（壁に穴NG）",
        icon: "🏢",
        description: "原状回復が必要",
        scores: {
          diawall_bookshelf: 3,
          labrico_wall: 3,
          floating_shelf: 0,
          sunoko_rack: 3,
          kitchen_rack: 3,
          open_shelf_2x4: 2,
          osb_industrial: 0,
          modular_unit: 3,
        },
      },
      {
        label: "持ち家（壁に穴OK）",
        icon: "🏠",
        description: "自由に加工可能",
        scores: {
          diawall_bookshelf: 1,
          labrico_wall: 2,
          floating_shelf: 3,
          sunoko_rack: 1,
          kitchen_rack: 1,
          open_shelf_2x4: 3,
          osb_industrial: 3,
          modular_unit: 2,
        },
      },
    ],
  },
  {
    id: "budget",
    question: "予算はどのくらい？",
    description: "使う材料やパーツのグレードに影響します",
    options: [
      {
        label: "〜3,000円",
        icon: "💰",
        description: "最小限の材料でコスパ重視",
        scores: {
          diawall_bookshelf: 0,
          labrico_wall: 0,
          floating_shelf: 0,
          sunoko_rack: 3,
          kitchen_rack: 2,
          open_shelf_2x4: 0,
          osb_industrial: 0,
          modular_unit: 0,
        },
      },
      {
        label: "3,000〜8,000円",
        icon: "💰💰",
        description: "基本パーツを揃えて制作",
        scores: {
          diawall_bookshelf: 3,
          labrico_wall: 2,
          floating_shelf: 2,
          sunoko_rack: 1,
          kitchen_rack: 3,
          open_shelf_2x4: 2,
          osb_industrial: 0,
          modular_unit: 1,
        },
      },
      {
        label: "8,000〜15,000円",
        icon: "💰💰💰",
        description: "しっかりした棚を制作",
        scores: {
          diawall_bookshelf: 2,
          labrico_wall: 3,
          floating_shelf: 3,
          sunoko_rack: 0,
          kitchen_rack: 1,
          open_shelf_2x4: 3,
          osb_industrial: 2,
          modular_unit: 3,
        },
      },
      {
        label: "15,000円以上",
        icon: "💎",
        description: "こだわりの材料・デザインで",
        scores: {
          diawall_bookshelf: 1,
          labrico_wall: 2,
          floating_shelf: 2,
          sunoko_rack: 0,
          kitchen_rack: 0,
          open_shelf_2x4: 2,
          osb_industrial: 3,
          modular_unit: 3,
        },
      },
    ],
  },
  {
    id: "experience",
    question: "DIYの経験は？",
    description: "スキルレベルに合った棚をご提案します",
    options: [
      {
        label: "初めて",
        icon: "🔰",
        description: "工具を触ったことがない",
        scores: {
          diawall_bookshelf: 3,
          labrico_wall: 1,
          floating_shelf: 0,
          sunoko_rack: 3,
          kitchen_rack: 3,
          open_shelf_2x4: 0,
          osb_industrial: 0,
          modular_unit: 1,
        },
      },
      {
        label: "少しある",
        icon: "🔨",
        description: "簡単な組み立てはできる",
        scores: {
          diawall_bookshelf: 2,
          labrico_wall: 3,
          floating_shelf: 2,
          sunoko_rack: 1,
          kitchen_rack: 2,
          open_shelf_2x4: 3,
          osb_industrial: 1,
          modular_unit: 3,
        },
      },
      {
        label: "かなりある",
        icon: "⚙️",
        description: "電動工具も使いこなせる",
        scores: {
          diawall_bookshelf: 1,
          labrico_wall: 2,
          floating_shelf: 3,
          sunoko_rack: 0,
          kitchen_rack: 1,
          open_shelf_2x4: 2,
          osb_industrial: 3,
          modular_unit: 2,
        },
      },
    ],
  },
];

// ── 診断結果8タイプ ──

export const SHELF_PLAN_RESULTS: ShelfPlanResult[] = [
  {
    id: "diawall_bookshelf",
    title: "ディアウォール本棚",
    description:
      "バネ式のディアウォールで柱を立て、棚板を渡すだけの簡単本棚。賃貸でも壁を傷つけず、初心者でも2時間ほどで完成します。漫画や文庫本の収納にぴったり。",
    icon: "📖",
    accentColor: "amber",
    difficulty: 1,
    estimatedTime: "約2時間",
    estimatedCost: [4000, 7000],
    materials: [
      { name: "ディアウォール 2×4アジャスター", quantity: "2セット", amazonKeyword: "ディアウォール 2×4 アジャスター" },
      { name: "2×4材 8フィート", quantity: "2本", amazonKeyword: "2×4 木材 8フィート SPF" },
      { name: "棚板（パイン集成材 600×200mm）", quantity: "4〜5枚", amazonKeyword: "パイン集成材 600 200 棚板" },
      { name: "L字金具", quantity: "8〜10個", amazonKeyword: "L字金具 棚受け 2×4" },
      { name: "木ネジ", quantity: "1箱", amazonKeyword: "木ネジ 3.8×32 DIY" },
    ],
    tools: ["電動ドライバー", "メジャー", "水平器"],
    steps: [
      "天井高を測り、2×4材をカット寸法に合わせてホームセンターでカット依頼",
      "ディアウォールを2×4材の上下に取り付ける",
      "柱を設置位置に立て、垂直を水平器で確認",
      "棚板の取り付け位置を鉛筆でマーキング",
      "L字金具を柱にネジ止め",
      "棚板をL字金具に載せてネジ止め",
      "全体の水平・安定性を最終確認",
    ],
    relatedTemplate: "/templates/diawall-bookshelf",
    relatedParts: ["diawall", "spf_2x4", "pine_board", "l_bracket", "wood_screw"],
    shareText:
      "DIY棚プランナー診断で「ディアウォール本棚」がおすすめされました！初心者でも約2時間で作れる賃貸OKの本棚です📖\n\n#DIY棚プランナー #DIY棚シミュレーター",
  },
  {
    id: "labrico_wall",
    title: "ラブリコ壁面収納",
    description:
      "ラブリコのジャッキ式アジャスターで安定した壁面収納を実現。リビングから寝室まで、多用途に使える中級者向けの棚。3本柱で大容量も可能。",
    icon: "🏠",
    accentColor: "emerald",
    difficulty: 2,
    estimatedTime: "約3〜4時間",
    estimatedCost: [6000, 12000],
    materials: [
      { name: "ラブリコ 2×4アジャスター", quantity: "3セット", amazonKeyword: "ラブリコ 2×4 アジャスター" },
      { name: "2×4材 8フィート", quantity: "3本", amazonKeyword: "2×4 木材 8フィート SPF" },
      { name: "棚板（パイン集成材 900×250mm）", quantity: "5枚", amazonKeyword: "パイン集成材 900 250 棚板" },
      { name: "ラブリコ棚受けシングル", quantity: "10個", amazonKeyword: "ラブリコ 棚受け シングル" },
      { name: "木ネジ", quantity: "1箱", amazonKeyword: "木ネジ 3.8×32 DIY" },
      { name: "ワトコオイル", quantity: "1缶", amazonKeyword: "ワトコオイル ダークウォルナット" },
    ],
    tools: ["電動ドライバー", "メジャー", "水平器", "サンドペーパー"],
    steps: [
      "天井高を測定し、2×4材のカット寸法を算出",
      "棚板をサンドペーパーで研磨し、ワトコオイルで塗装",
      "ラブリコを2×4材に取り付け、3本の柱を設置",
      "棚受けの位置をマーキングし、水平を確認",
      "棚受けを柱にネジ止め",
      "棚板を棚受けに載せて固定",
      "全体の安定性と水平を最終チェック",
    ],
    relatedTemplate: "/templates/labrico-wall-storage",
    relatedParts: ["labrico", "spf_2x4", "pine_board", "labrico_shelf_single", "watco_oil"],
    shareText:
      "DIY棚プランナー診断で「ラブリコ壁面収納」がおすすめされました！壁一面を有効活用できる本格収納🏠\n\n#DIY棚プランナー #DIY棚シミュレーター",
  },
  {
    id: "floating_shelf",
    title: "壁掛けフローティングシェルフ",
    description:
      "壁に直接取り付ける浮遊感のあるおしゃれな棚。支柱が見えないスッキリしたデザインで、インテリア小物のディスプレイに最適。持ち家向け。",
    icon: "✨",
    accentColor: "violet",
    difficulty: 2,
    estimatedTime: "約2〜3時間",
    estimatedCost: [5000, 10000],
    materials: [
      { name: "フローティングシェルフ金具", quantity: "2〜3セット", amazonKeyword: "フローティングシェルフ 金具 壁掛け" },
      { name: "棚板（パイン集成材 600×200mm）", quantity: "2〜3枚", amazonKeyword: "パイン集成材 600 200 棚板" },
      { name: "アンカーボルト", quantity: "1セット", amazonKeyword: "石膏ボード アンカー 棚" },
      { name: "木ネジ", quantity: "1箱", amazonKeyword: "木ネジ 3.8×32 DIY" },
      { name: "ワトコオイルまたは水性塗料", quantity: "1缶", amazonKeyword: "ワトコオイル ナチュラル" },
    ],
    tools: ["電動ドライバー", "メジャー", "水平器", "下地センサー"],
    steps: [
      "壁の下地位置を下地センサーで確認",
      "棚板をサンドペーパーで研磨し塗装",
      "金具の取り付け位置を水平器でマーキング",
      "下地がある位置にネジで金具を固定（ない場合はアンカー使用）",
      "棚板を金具にスライドして固定",
      "水平を最終確認",
    ],
    relatedTemplate: "/templates/wall-shelf",
    relatedParts: ["iron_bracket", "pine_board", "wood_screw", "watco_oil"],
    shareText:
      "DIY棚プランナー診断で「壁掛けフローティングシェルフ」がおすすめされました！浮遊感のあるおしゃれな棚✨\n\n#DIY棚プランナー #DIY棚シミュレーター",
  },
  {
    id: "sunoko_rack",
    title: "すのこラック",
    description:
      "100均やホームセンターのすのこを組み合わせるだけのお手軽棚。低予算・初心者でもOK。軽い小物やインテリアグリーンの飾り棚にぴったり。",
    icon: "☕",
    accentColor: "orange",
    difficulty: 1,
    estimatedTime: "約1〜2時間",
    estimatedCost: [1000, 3000],
    materials: [
      { name: "桐すのこ（45×20cm程度）", quantity: "4〜6枚", amazonKeyword: "すのこ 桐 DIY 棚" },
      { name: "木工用ボンド", quantity: "1本", amazonKeyword: "木工用ボンド 速乾" },
      { name: "釘またはネジ", quantity: "適量", amazonKeyword: "木ネジ 2.4×16 小" },
      { name: "水性塗料（お好みで）", quantity: "1缶", amazonKeyword: "水性塗料 DIY ミルクペイント" },
    ],
    tools: ["ドライバー", "メジャー", "サンドペーパー"],
    steps: [
      "すのこのバリをサンドペーパーで処理",
      "お好みで塗装して乾燥させる",
      "すのこの脚部分が棚受けになるよう組み合わせを確認",
      "木工用ボンドですのこ同士を接着",
      "補強が必要な箇所をネジまたは釘で固定",
      "安定性を確認して設置",
    ],
    relatedTemplate: "/templates/sunoko-shelf",
    relatedParts: ["kiri_board", "wood_screw", "water_paint", "sandpaper"],
    shareText:
      "DIY棚プランナー診断で「すのこラック」がおすすめされました！1,000円から作れるお手軽DIY☕\n\n#DIY棚プランナー #DIY棚シミュレーター",
  },
  {
    id: "kitchen_rack",
    title: "突っ張りキッチンラック",
    description:
      "突っ張り棒とワイヤーネットを組み合わせたキッチン収納。賃貸のキッチンでも壁を傷つけず、調味料やキッチンツールをすっきり整理できます。",
    icon: "🍳",
    accentColor: "teal",
    difficulty: 1,
    estimatedTime: "約1〜2時間",
    estimatedCost: [2000, 5000],
    materials: [
      { name: "突っ張り棒（強力タイプ）", quantity: "2本", amazonKeyword: "突っ張り棒 強力 キッチン" },
      { name: "ワイヤーネット", quantity: "2〜3枚", amazonKeyword: "ワイヤーネット 棚 キッチン" },
      { name: "結束バンド", quantity: "1袋", amazonKeyword: "結束バンド 耐候性" },
      { name: "S字フック", quantity: "5〜10個", amazonKeyword: "S字フック ステンレス キッチン" },
      { name: "ワイヤーバスケット", quantity: "2〜3個", amazonKeyword: "ワイヤーバスケット キッチン 収納" },
    ],
    tools: ["メジャー"],
    steps: [
      "設置スペースの幅と高さを測定",
      "突っ張り棒を上下2本、水平に設置",
      "ワイヤーネットを結束バンドで突っ張り棒に固定",
      "S字フックでキッチンツールを吊り下げ",
      "ワイヤーバスケットを取り付けて調味料を収納",
      "全体のバランスと安定性を確認",
    ],
    relatedTemplate: "/templates/rental-kitchen-rack",
    relatedParts: ["s_hook", "wire_basket"],
    shareText:
      "DIY棚プランナー診断で「突っ張りキッチンラック」がおすすめされました！賃貸キッチンをすっきり整理🍳\n\n#DIY棚プランナー #DIY棚シミュレーター",
  },
  {
    id: "open_shelf_2x4",
    title: "2×4材オープンシェルフ",
    description:
      "2×4材をフレームにした本格的なオープンシェルフ。大容量で耐荷重も十分。本から工具まで何でも収納でき、拡張性も高い中級者向けの棚。",
    icon: "🪵",
    accentColor: "sky",
    difficulty: 2,
    estimatedTime: "約4〜5時間",
    estimatedCost: [8000, 15000],
    materials: [
      { name: "2×4材 8フィート", quantity: "4本", amazonKeyword: "2×4 木材 8フィート SPF" },
      { name: "2×4材 6フィート（横材用）", quantity: "6本", amazonKeyword: "2×4 木材 6フィート SPF" },
      { name: "棚板（合板 900×300mm）", quantity: "4〜5枚", amazonKeyword: "合板 900 300 棚板 DIY" },
      { name: "コーススレッド 75mm", quantity: "1箱", amazonKeyword: "コーススレッド 75mm" },
      { name: "L字金具（補強用）", quantity: "8個", amazonKeyword: "L字金具 大型 棚 補強" },
      { name: "ワトコオイル", quantity: "1缶", amazonKeyword: "ワトコオイル ミディアムウォルナット" },
    ],
    tools: ["電動ドライバー", "のこぎり", "メジャー", "直角定規", "クランプ"],
    steps: [
      "設計図を元に2×4材のカット寸法を算出",
      "ホームセンターでカット依頼（または自分でカット）",
      "全ての木材をサンドペーパーで研磨",
      "フレームを組み立て（コーススレッドで接合）",
      "L字金具で各接合部を補強",
      "棚板を取り付け",
      "ワトコオイルで仕上げ塗装",
    ],
    relatedTemplate: "/templates/2x4-basic-shelf",
    relatedParts: ["spf_2x4", "plywood", "course_thread", "l_bracket", "watco_oil"],
    shareText:
      "DIY棚プランナー診断で「2×4材オープンシェルフ」がおすすめされました！大容量の本格DIY棚🪵\n\n#DIY棚プランナー #DIY棚シミュレーター",
  },
  {
    id: "osb_industrial",
    title: "OSB材インダストリアル棚",
    description:
      "OSB合板とアイアン金具で作る無骨でカッコいいインダストリアルスタイルの棚。持ち家で本格DIYを楽しみたい上級者向け。デザイン性抜群。",
    icon: "🏭",
    accentColor: "rose",
    difficulty: 3,
    estimatedTime: "約6〜8時間",
    estimatedCost: [12000, 25000],
    materials: [
      { name: "OSB合板 900×300×12mm", quantity: "5枚", amazonKeyword: "OSB合板 棚板 DIY" },
      { name: "アイアンブラケット", quantity: "10個", amazonKeyword: "アイアン ブラケット 棚受け インダストリアル" },
      { name: "2×4材 8フィート", quantity: "2本", amazonKeyword: "2×4 木材 8フィート SPF" },
      { name: "アンカーボルト", quantity: "1セット", amazonKeyword: "石膏ボード アンカー 強力" },
      { name: "ワトコオイル（ダークウォルナット）", quantity: "1缶", amazonKeyword: "ワトコオイル ダークウォルナット" },
      { name: "鉄部用塗料（つや消し黒）", quantity: "1缶", amazonKeyword: "アイアンペイント つや消し黒" },
    ],
    tools: ["電動ドライバー", "丸のこ", "メジャー", "下地センサー", "クランプ", "サンドペーパー"],
    steps: [
      "設計図を作成し、OSB合板のカット寸法を決定",
      "OSB合板と2×4材をカット",
      "アイアンブラケットをつや消し黒で塗装",
      "木材をワトコオイルで塗装・乾燥",
      "壁の下地を確認し、ブラケットを固定",
      "OSB棚板をブラケットに載せてネジ止め",
      "2×4材フレームで全体を補強",
      "最終仕上げと安定性確認",
    ],
    relatedTemplate: null,
    relatedParts: ["plywood", "iron_bracket", "spf_2x4", "watco_oil", "electric_drill"],
    shareText:
      "DIY棚プランナー診断で「OSB材インダストリアル棚」がおすすめされました！無骨でカッコいい本格DIY🏭\n\n#DIY棚プランナー #DIY棚シミュレーター",
  },
  {
    id: "modular_unit",
    title: "モジュラー収納ユニット",
    description:
      "同じサイズのボックスを組み合わせて自由にレイアウトできるモジュラー棚。ライフスタイルの変化に合わせて拡張・組み替えが可能。多用途に使えます。",
    icon: "🧩",
    accentColor: "indigo",
    difficulty: 2,
    estimatedTime: "約3〜5時間",
    estimatedCost: [8000, 18000],
    materials: [
      { name: "1×4材 6フィート", quantity: "10本", amazonKeyword: "1×4 木材 6フィート SPF" },
      { name: "合板 300×300×12mm", quantity: "6〜8枚", amazonKeyword: "合板 300 300 DIY" },
      { name: "木工用ボンド", quantity: "1本", amazonKeyword: "木工用ボンド 速乾" },
      { name: "木ネジ", quantity: "1箱", amazonKeyword: "木ネジ 3.3×25 DIY" },
      { name: "ダボ", quantity: "1袋", amazonKeyword: "木ダボ 8mm DIY" },
      { name: "水性ウレタンニス", quantity: "1缶", amazonKeyword: "水性ウレタンニス DIY" },
    ],
    tools: ["電動ドライバー", "のこぎり", "メジャー", "直角定規", "クランプ", "サンドペーパー"],
    steps: [
      "モジュールのサイズを決定（例: 300×300×300mm）",
      "1×4材と合板をカット",
      "サンドペーパーで全ての材料を研磨",
      "木工用ボンドとネジでボックスを組み立て",
      "各ボックスをダボで連結",
      "水性ウレタンニスで仕上げ塗装",
      "自由にレイアウトして設置",
    ],
    relatedTemplate: null,
    relatedParts: ["spf_1x4", "plywood", "dowel", "wood_screw", "water_urethane"],
    shareText:
      "DIY棚プランナー診断で「モジュラー収納ユニット」がおすすめされました！自由に組み替えできる万能棚🧩\n\n#DIY棚プランナー #DIY棚シミュレーター",
  },
];
