"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { storage } from "@/lib/storage";

const STORAGE_KEY = "sb_user";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setUser(storage.get<User | null>(STORAGE_KEY, null));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      storage.set(STORAGE_KEY, user);
    }
  }, [user, hydrated]);

  const login = useCallback((u: User) => setUser(u), []);

  const logout = useCallback(() => setUser(null), []);

  return { user, hydrated, login, logout };
}
