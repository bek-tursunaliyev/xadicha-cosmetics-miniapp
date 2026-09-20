"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { initTelegramWebApp } from "@/lib/telegramClient";
import { apiFetch } from "@/lib/apiClient";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshUser = useCallback(async () => {
    const data = await apiFetch("/api/me");
    setUser(data.user);
    setIsAdmin(data.isAdmin);
    return data;
  }, []);

  useEffect(() => {
    initTelegramWebApp();
    refreshUser()
      .then(() => setStatus("ready"))
      .catch(() => setStatus("error"));
  }, [refreshUser]);

  return (
    <AppContext.Provider value={{ status, user, isAdmin, refreshUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
