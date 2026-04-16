"use client";

import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";
import { storage } from "@/lib/storage";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(storage.get<User | null>("sb_user", null));
  }, []);

  useEffect(() => {
    storage.set("sb_user", user);
  }, [user]);

  const login = useCallback((u: User) => setUser(u), []);

  const logout = useCallback(() => setUser(null), []);

  return { user, login, logout };
}
