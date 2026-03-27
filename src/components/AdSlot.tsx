/**
 * AdSlot.tsx
 *
 * Google AdSense 広告枠コンポーネント。
 * AdSense承認後に ADSENSE_ENABLED を true に変更して有効化する。
 *
 * 使い方:
 *   <AdSlot slot="1234567890" format="auto" />
 */

// AdSense が有効化されるまで false に設定
const ADSENSE_ENABLED = false;

const ADSENSE_CLIENT = "ca-pub-8412407485609118";

interface Props {
  /** AdSense広告ユニットのスロットID */
  slot: string;
  /** 広告フォーマット: "auto" | "horizontal" | "vertical" | "rectangle" */
  format?: string;
  /** className の追加 */
  className?: string;
}

export default function AdSlot({
  slot,
  format = "auto",
  className = "",
}: Props) {
  if (!ADSENSE_ENABLED) {
    return null;
  }

  return (
    <div className={`ad-slot ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-format={format}
        data-ad-slot={slot}
        data-full-width-responsive="true"
      />
    </div>
  );
}
