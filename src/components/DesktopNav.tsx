"use client";

import { useState, useRef, useEffect } from "react";

const MAIN_LINKS = [
  { href: "/", label: "設計ツール" },
  { href: "/templates", label: "テンプレート" },
  { href: "/howto", label: "作り方ガイド" },
  { href: "/parts", label: "パーツ辞典" },
  { href: "/guide", label: "使い方ガイド" },
];

const TOOL_LINKS = [
  { href: "/tools/shelf-load-calc", label: "📐 耐荷重計算" },
  { href: "/tools/material-cost-estimator", label: "💰 費用見積もり" },
  { href: "/tools/support-system-picker", label: "🔧 支柱比較" },
  { href: "/tools/shelf-planner-quiz", label: "🧩 棚診断" },
];

export default function DesktopNav() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <nav className="hidden md:flex items-center gap-4 text-sm" aria-label="メインナビゲーション">
      {MAIN_LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-gray-600 hover:text-amber-600 transition-colors"
        >
          {link.label}
        </a>
      ))}

      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-haspopup="true"
          className="text-gray-600 hover:text-amber-600 transition-colors flex items-center gap-1"
        >
          ツール
          <svg
            className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-50"
          >
            {TOOL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
