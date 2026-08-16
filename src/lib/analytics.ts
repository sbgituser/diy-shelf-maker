/**
 * GA4カスタムイベント送信ユーティリティ
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function sendEvent(eventName: string, params?: Record<string, string>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

/** GWコンテンツの閲覧イベント */
export function trackGwContentView(slug: string) {
  sendEvent("gw_content_view", { article_slug: slug });
}

/** GW記事内のAmazonリンククリックイベント */
export function trackGwAmazonClick(slug: string, label: string) {
  sendEvent("gw_amazon_click", { article_slug: slug, product_label: label });
}

/** サイト内の任意のAmazonリンククリックイベント(AmazonClickTrackerから使用) */
export function trackAmazonLinkClick(linkUrl: string, linkText: string, pagePath: string) {
  sendEvent("amazon_link_click", { link_url: linkUrl, link_text: linkText, page_path: pagePath });
}
