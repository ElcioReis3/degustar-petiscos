"use client";

import { toast } from "sonner";

export function useNotify() {
  const success = (title: string, description?: string) =>
    toast.success(title, { description, duration: 2500 });

  const info = (title: string, description?: string) =>
    toast.info(title, { description, duration: 2000 });

  return { success, info };
}
