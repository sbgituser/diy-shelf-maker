import { AMAZON_ASSOCIATE_TAG } from "@/data/products";

interface Props {
  asin?: string;
  keyword?: string;
  children: React.ReactNode;
  className?: string;
}

export default function AmazonProductLink({ asin, keyword, children, className }: Props) {
  const url = asin
    ? `https://www.amazon.co.jp/dp/${asin}?tag=${AMAZON_ASSOCIATE_TAG}`
    : `https://www.amazon.co.jp/s?k=${encodeURIComponent(keyword || "")}&tag=${AMAZON_ASSOCIATE_TAG}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className={
        className ||
        "inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium transition-colors"
      }
    >
      {children}
    </a>
  );
}
