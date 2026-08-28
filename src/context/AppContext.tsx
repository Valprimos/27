import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppSettings, DailyEntry, Goal, WeekDay } from "@/types";
import {
  loadEntries,
  loadGoals,
  loadSettings,
  saveEntries,
  saveGoals,
  saveSettings,
} from "@/storage";
import { todayISODate } from "@/utils/dates";

interface AppContextValue {
  ready: boolean;
  goals: Goal[];
  entries: DailyEntry[];
  settings: AppSettings;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "active">) => Promise<Goal>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  setEntryForToday: (goalId: string, patch: Partial<DailyEntry>) => Promise<void>;
  getEntry: (goalId: string, date: string) => DailyEntry | undefined;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function uid(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

const DEFAULT_ACTIVE_DAYS: WeekDay[] = [0, 1, 2, 3, 4, 5, 6];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    aiEnabled: false,
    themePreference: "system",
  });

  useEffect(() => {
    (async () => {
      const [g, e, s] = await Promise.all([loadGoals(), loadEntries(), loadSettings()]);
      setGoals(g);
      setEntries(e);
      setSettings(s);
      setReady(true);
    })();
  }, []);

  async function addGoal(input: Omit<Goal, "id" | "createdAt" | "active">): Promise<Goal> {
    const goal: Goal = {
      ...input,
      id: uid(),
      createdAt: todayISODate(),
      active: true,
      activeDays: input.activeDays?.length ? input.activeDays : DEFAULT_ACTIVE_DAYS,
    };
    const next = [...goals, goal];
    setGoals(next);
    await saveGoals(next);
    return goal;
  }

  async function updateGoal(goal: Goal): Promise<void> {
    const next = goals.map((g) => (g.id === goal.id ? goal : g));
    setGoals(next);
    await saveGoals(next);
  }

  async function deleteGoal(goalId: string): Promise<void> {
    const next = goals.map((g) => (g.id === goalId ? { ...g, active: false } : g));
    setGoals(next);
    await saveGoals(next);
  }

  function getEntry(goalId: string, date: string): DailyEntry | undefined {
    return entries.find((e) => e.goalId === goalId && e.date === date);
  }

  async function setEntryForToday(goalId: string, patch: Partial<DailyEntry>): Promise<void> {
    const date = todayISODate();
    const id = `${goalId}_${date}`;
    const existing = entries.find((e) => e.id === id);
    const updated: DailyEntry = {
      id,
      goalId,
      date,
      completed: false,
      progress: 0,
      skipped: false,
      updatedAt: new Date().toISOString(),
      ...existing,
      ...patch,
    };
    const next = existing ? entries.map((e) => (e.id === id ? updated : e)) : [...entries, updated];
    setEntries(next);
    await saveEntries(next);
  }

  async function updateSettings(patch: Partial<AppSettings>): Promise<void> {
    const next = { ...settings, ...patch };
    setSettings(next);
    await saveSettings(next);
  }

  const value = useMemo(
    () => ({
      ready,
      goals,
      entries,
      settings,
      addGoal,
      updateGoal,
      deleteGoal,
      setEntryForToday,
      getEntry,
      updateSettings,
    }),
    [ready, goals, entries, settings]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
