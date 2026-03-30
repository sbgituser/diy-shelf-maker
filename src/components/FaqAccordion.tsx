"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <button
            type="button"
            className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            aria-expanded={openIndex === i}
          >
            <span className="font-semibold text-gray-800 text-sm leading-relaxed">
              <span className="text-amber-600 mr-1">Q.</span>
              {item.question}
            </span>
            <span
              className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                openIndex === i ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="text-amber-600 font-semibold mr-1">A.</span>
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
