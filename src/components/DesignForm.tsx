"use client";

import { Suspense } from "react";
import GridEditor from "./GridEditor";

export default function DesignForm() {
  return (
    <Suspense fallback={<div className="text-center py-10 text-gray-400">読み込み中...</div>}>
      <GridEditor />
    </Suspense>
  );
}
