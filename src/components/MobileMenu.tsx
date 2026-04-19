"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const MAIN_LINKS = [
  { href: "/", label: "設計ツール" },
  { href: "/templates", label: "テンプレート" },
  { href: "/howto", label: "作り方ガイド" },
  { href: "/guide", label: "使い方ガイド" },
  { href: "/parts", label: "パーツ辞典" },
  { href: "/faq", label: "よくある質問" },
];

const TOOL_LINKS = [
  { href: "/tools/shelf-load-calc", label: "📐 耐荷重計算" },
  { href: "/tools/material-cost-estimator", label: "💰 費用見積もり" },
  { href: "/tools/support-system-picker", label: "🔧 支柱比較" },
  { href: "/tools/shelf-planner-quiz", label: "🧩 棚診断" },
  { href: "/tools/wood-cut-calculator", label: "🪚 木材カット計算" },
  { href: "/tools/material-calculator", label: "📋 材料計算" },
  { href: "/tools/strength-checker", label: "💪 棚板強度チェック" },
  { href: "/tools/projects", label: "📂 プロジェクトDB" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "メニューを閉じる" : "メニューを開く"}
        className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
      >
        {open ? (
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={close} />
          <nav
            id="mobile-menu"
            ref={menuRef}
            role="menu"
            aria-label="モバイルナビゲーション"
            className="fixed top-14 right-0 w-72 max-h-[calc(100vh-3.5rem)] overflow-y-auto bg-white border-l border-gray-200 shadow-xl z-50 animate-slide-in"
          >
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">メイン</div>
              {MAIN_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={close}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="my-2 border-t border-gray-100" />
              <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase">ツール</div>
              {TOOL_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  role="menuitem"
                  onClick={close}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
