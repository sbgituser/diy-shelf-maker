import { useCallback } from "react";
import { showToast, type ToastType } from "@/components/Toast";

export function useToast() {
  const toast = useCallback((type: ToastType, message: string, duration?: number) => {
    showToast(type, message, duration);
  }, []);

  return {
    toast,
    success: (message: string, duration?: number) => showToast("success", message, duration),
    error: (message: string, duration?: number) => showToast("error", message, duration),
    warning: (message: string, duration?: number) => showToast("warning", message, duration),
    info: (message: string, duration?: number) => showToast("info", message, duration),
  };
}
