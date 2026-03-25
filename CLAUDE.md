# CLAUDE.md — diy-shelf-maker プロジェクト

## プロジェクト概要

DIY突っ張り棚の設計・部材計算Webアプリ。ユーザーが天井高・柱数・棚数などを入力すると、必要な部材一覧・費用概算・設計図を自動生成する。Amazon Associatesアフィリエイト（タグ: `kurasplus-22`）で収益化。

- **本番URL**: https://diy-shelf-maker.kuras-plus.com
- **Pages URL**: https://diy-shelf-maker.pages.dev
- **GitHub**: https://github.com/sbgituser/diy-shelf-maker
- **ホスティング**: Cloudflare Pages（静的HTMLエクスポート）
- **DNS**: AWS Route 53（kuras-plus.com）

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router, SSG `output: "export"`) |
| 言語 | TypeScript 5 |
| UI | React 19, Tailwind CSS v4 |
| PDF生成 | jsPDF + jspdf-autotable（クライアントサイド、dynamic import） |
| デプロイ | Cloudflare Pages（wrangler pages deploy） |
| ブランチ | `master`（mainではない） |

## ディレクトリ構成

```
src/
├── app/                    # Next.js App Router ページ
│   ├── page.tsx            # トップページ（グリッドエディタ）
│   ├── guide/page.tsx      # 使い方ガイド
│   ├── sitemap.ts          # 動的sitemap.xml生成
│   └── layout.tsx          # ルートレイアウト
├── components/
│   ├── GridEditor.tsx       # メインのSVGグリッドエディタ（柱・棚の配置・編集）
│   ├── DesignForm.tsx       # フォーム入力UI
│   ├── PartsListTable.tsx   # 部材一覧テーブル
│   ├── ShelfDiagram.tsx     # 棚の正面図ダイアグラム
│   └── ShareButtons.tsx     # SNSシェアボタン（X, LINE, Facebook）
├── data/
│   ├── products.ts          # アジャスター・木材・棚板・金具の商品データ + Amazon URL生成
│   └── templates.ts         # プリセットテンプレート
├── lib/
│   ├── calculator.ts        # フォーム入力→部材計算ロジック
│   ├── grid-calculator.ts   # グリッドエディタ→部材計算ロジック
│   └── pdf-export.ts        # PDF生成（jsPDF, dynamic import）
└── types/
    └── index.ts             # 全型定義（GridDesign, PartItem等）
```

## 重要な設計判断

### SSG（静的サイト生成）
- `next.config.ts` で `output: "export"` を設定。全ページが静的HTML。
- サーバーサイド機能（API Routes, SSR, ISR）は使用不可。
- 画像は `unoptimized: true`（Next.js Image Optimizerなし）。
- `useClient` 系のブラウザAPI使用時は `"use client"` ディレクティブ必須。

### グリッドエディタ (GridEditor.tsx)
- SVGベースの2Dキャンバスで柱・棚をインタラクティブに配置。
- ドラッグ移動には5px SVG距離のデッドゾーン（`DRAG_THRESHOLD`）で、クリック選択とドラッグを区別。
- `toSvgCoord()` ヘルパーでスクリーン座標→SVG座標変換。
- 選択状態はSVGグローフィルター、ホバー状態はハイライト表示。

### PDF生成
- `jsPDF` と `jspdf-autotable` をクライアントサイドで使用。
- SSG互換のため `dynamic import` で遅延読み込み。
- A4サイズで設計図 + 部材表 + 見積もりを出力。

### Amazon Associates
- アフィリエイトタグ: `kurasplus-22`
- `buildAmazonUrl()` 関数（`src/data/products.ts`）でURL生成。
- 各部材にAmazonリンクを自動付与。

## ビルド & デプロイ

```bash
# 開発サーバー
npm run dev

# ビルド（静的エクスポート → out/ ディレクトリ）
npm run build

# Cloudflare Pagesへデプロイ
npx wrangler pages deploy out --project-name=diy-shelf-maker

# Lint
npm run lint
```

### wrangler.json
```json
{
  "name": "diy-shelf-maker",
  "compatibility_date": "2026-03-25",
  "pages_build_output_dir": "out"
}
```

> **注意**: `wrangler.json` に `"assets"` キーを入れるとPages deployでエラーになる。`pages_build_output_dir` のみ使用すること。

## Git運用

- ブランチ: `master`（mainではない）
- リモート: `origin` → `https://github.com/sbgituser/diy-shelf-maker.git`
- push時に403エラーが出たら: `cmdkey /delete:git:https://github.com` で認証情報をリセットしてからリトライ

## コーディング規約

- コンポーネントは関数コンポーネント + React Hooks
- 型定義は `src/types/index.ts` に集約
- 商品データ（価格・仕様）は `src/data/` 配下に分離
- 計算ロジックは `src/lib/` 配下に分離
- Tailwind CSS v4 のユーティリティクラスでスタイリング
- 日本語UIテキストはコンポーネント内にインライン記述

## 主要な型

```typescript
// グリッドエディタのデザインデータ
interface GridDesign {
  ceilingHeight: number;      // 天井高 (mm)
  pillars: GridPillar[];      // 配置された柱
  shelves: GridShelf[];       // 配置された棚板
}

// 部材計算結果
interface PartItem {
  category: "adjuster" | "lumber" | "shelf" | "bracket" | "screw";
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  amazonUrl: string;
  note?: string;
}
```

## 環境・制約

- 開発環境: Windows 11 Home
- Node.js / npm はローカルで実行（VM内ではnpmレジストリ接続不可）
- Cloudflareアカウント: Account ID `28d5e85978bb7453492b50b4c20bedd0`
- Cloudflare Pages プロジェクトタイプ: Pages（wrangler pages deploy使用）

## 未対応・今後のタスク

- Route 53にCNAMEレコード追加（`diy-shelf-maker.kuras-plus.com` → `diy-shelf-maker.pages.dev`）
- GitHub自動デプロイ（GitHub Actions + wrangler pages deploy）の設定
- SEO最適化（メタタグ、構造化データ）
- Google Search Console登録
- パフォーマンス最適化
