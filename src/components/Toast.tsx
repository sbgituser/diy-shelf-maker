"use client";

import { useState, useEffect, useCallback } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
  removing: boolean;
}

let addToastFn: ((type: ToastType, message: string, duration?: number) => void) | null = null;

export function showToast(type: ToastType, message: string, duration?: number) {
  addToastFn?.(type, message, duration);
}

let nextToastId = 0;

const TOAST_STYLES: Record<ToastType, string> = {
  success: "bg-green-600 text-white",
  error: "bg-red-600 text-white",
  warning: "bg-yellow-500 text-white",
  info: "bg-blue-600 text-white",
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, removing: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 3000) => {
    const id = nextToastId++;
    setToasts((prev) => [...prev, { id, type, message, removing: false }]);
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  useEffect(() => {
    addToastFn = addToast;
    return () => { addToastFn = null; };
  }, [addToast]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          aria-live="polite"
          className={`px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm ${
            toast.removing ? "animate-slide-out" : "animate-fade-in"
          } ${TOAST_STYLES[toast.type]}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
