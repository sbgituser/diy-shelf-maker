"use client";

import { Suspense } from "react";
import GridEditor from "./GridEditor";
import { GridEditorSkeleton } from "./Skeleton";

export default function DesignForm() {
  return (
    <Suspense fallback={<GridEditorSkeleton />}>
      <GridEditor />
    </Suspense>
  );
}
