import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AppSettings, DailyEntry, Goal, ImportDocument, Note, PlanItem, PlanItemStatus, WeekDay } from "@/types";
import {
  loadEntries,
  loadGoals,
  loadNotes,
  loadPlanItems,
  loadSettings,
  saveEntries,
  saveGoals,
  saveNotes,
  savePlanItems,
  saveSettings,
} from "@/storage";
import { todayISODate } from "@/utils/dates";

export interface ImportSummary {
  goalsAdded: number;
  goalsUpdated: number;
  planItemsAdded: number;
  notesAdded: number;
}

interface AppContextValue {
  ready: boolean;
  goals: Goal[];
  entries: DailyEntry[];
  planItems: PlanItem[];
  notes: Note[];
  settings: AppSettings;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "active">) => Promise<Goal>;
  updateGoal: (goal: Goal) => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  setEntryForToday: (goalId: string, patch: Partial<DailyEntry>) => Promise<void>;
  getEntry: (goalId: string, date: string) => DailyEntry | undefined;
  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  addPlanItem: (item: Omit<PlanItem, "id" | "status" | "source" | "updatedAt">) => Promise<void>;
  updatePlanItem: (item: PlanItem) => Promise<void>;
  cyclePlanItemStatus: (id: string) => Promise<void>;
  setPlanItemStatus: (id: string, status: PlanItemStatus) => Promise<void>;
  recordPlanItemResult: (
    id: string,
    patch: { status: PlanItemStatus; resultValue?: number; resultNote?: string }
  ) => Promise<void>;
  deletePlanItem: (id: string) => Promise<void>;
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => Promise<Note>;
  updateNote: (note: Note) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  importDocument: (doc: ImportDocument) => Promise<ImportSummary>;
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
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ themePreference: "system" });

  useEffect(() => {
    (async () => {
      const [g, e, p, n, s] = await Promise.all([
        loadGoals(),
        loadEntries(),
        loadPlanItems(),
        loadNotes(),
        loadSettings(),
      ]);
      setGoals(g);
      setEntries(e);
      setPlanItems(p);
      setNotes(n);
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

  async function addPlanItem(
    item: Omit<PlanItem, "id" | "status" | "source" | "updatedAt">
  ): Promise<void> {
    const newItem: PlanItem = {
      ...item,
      id: uid(),
      status: "pending",
      source: "manual",
      updatedAt: new Date().toISOString(),
    };
    const next = [...planItems, newItem];
    setPlanItems(next);
    await savePlanItems(next);
  }

  async function updatePlanItem(item: PlanItem): Promise<void> {
    const next = planItems.map((p) => (p.id === item.id ? { ...item, updatedAt: new Date().toISOString() } : p));
    setPlanItems(next);
    await savePlanItems(next);
  }

  const STATUS_CYCLE: PlanItemStatus[] = ["pending", "done", "failed"];

  async function cyclePlanItemStatus(id: string): Promise<void> {
    const next = planItems.map((p) => {
      if (p.id !== id) return p;
      const nextStatus = STATUS_CYCLE[(STATUS_CYCLE.indexOf(p.status) + 1) % STATUS_CYCLE.length];
      return { ...p, status: nextStatus, updatedAt: new Date().toISOString() };
    });
    setPlanItems(next);
    await savePlanItems(next);
  }

  async function setPlanItemStatus(id: string, status: PlanItemStatus): Promise<void> {
    const next = planItems.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p));
    setPlanItems(next);
    await savePlanItems(next);
  }

  async function recordPlanItemResult(
    id: string,
    patch: { status: PlanItemStatus; resultValue?: number; resultNote?: string }
  ): Promise<void> {
    const next = planItems.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p));
    setPlanItems(next);
    await savePlanItems(next);
  }

  async function deletePlanItem(id: string): Promise<void> {
    const next = planItems.filter((p) => p.id !== id);
    setPlanItems(next);
    await savePlanItems(next);
  }

  async function addNote(input: Omit<Note, "id" | "createdAt" | "updatedAt">): Promise<Note> {
    const now = new Date().toISOString();
    const note: Note = { ...input, id: uid(), createdAt: now, updatedAt: now };
    const next = [note, ...notes];
    setNotes(next);
    await saveNotes(next);
    return note;
  }

  async function updateNote(note: Note): Promise<void> {
    const next = notes.map((n) => (n.id === note.id ? { ...note, updatedAt: new Date().toISOString() } : n));
    setNotes(next);
    await saveNotes(next);
  }

  async function deleteNote(id: string): Promise<void> {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    await saveNotes(next);
  }

  async function importDocument(doc: ImportDocument): Promise<ImportSummary> {
    const summary: ImportSummary = { goalsAdded: 0, goalsUpdated: 0, planItemsAdded: 0, notesAdded: 0 };
    const now = new Date().toISOString();

    let nextGoals = goals;
    if (doc.goals?.length) {
      nextGoals = [...goals];
      for (const g of doc.goals) {
        const existingIdx = nextGoals.findIndex(
          (existing) => existing.id === g.id || existing.name.toLowerCase() === g.name.toLowerCase()
        );
        if (existingIdx >= 0) {
          nextGoals[existingIdx] = { ...nextGoals[existingIdx], ...g, activeDays: g.activeDays ?? nextGoals[existingIdx].activeDays };
          summary.goalsUpdated++;
        } else {
          nextGoals.push({
            id: g.id ?? uid(),
            name: g.name,
            kind: g.kind,
            icon: g.icon ?? "🎯",
            color: g.color ?? "#22c55e",
            createdAt: todayISODate(),
            active: true,
            dailyTarget: g.dailyTarget,
            unit: g.unit,
            moneyTarget: g.moneyTarget,
            moneySaved: g.moneySaved ?? 0,
            activeDays: g.activeDays?.length ? g.activeDays : DEFAULT_ACTIVE_DAYS,
          });
          summary.goalsAdded++;
        }
      }
    }

    let nextPlanItems = planItems;
    if (doc.planItems?.length) {
      nextPlanItems = [...planItems];
      for (const p of doc.planItems) {
        const existingIdx = p.id ? nextPlanItems.findIndex((x) => x.id === p.id) : -1;
        const built: PlanItem = {
          id: p.id ?? uid(),
          date: p.date,
          title: p.title,
          description: p.description,
          category: p.category ?? "otro",
          icon: p.icon ?? "🗓️",
          targetValue: p.targetValue,
          unit: p.unit,
          status:
            existingIdx >= 0
              ? nextPlanItems[existingIdx].status
              : p.status ?? (p.completed ? "done" : "pending"),
          resultValue: p.resultValue ?? (existingIdx >= 0 ? nextPlanItems[existingIdx].resultValue : undefined),
          resultNote: p.resultNote ?? (existingIdx >= 0 ? nextPlanItems[existingIdx].resultNote : undefined),
          source: "import",
          updatedAt: now,
        };
        if (existingIdx >= 0) {
          nextPlanItems[existingIdx] = built;
        } else {
          nextPlanItems.push(built);
          summary.planItemsAdded++;
        }
      }
    }

    let nextNotes = notes;
    if (doc.notes?.length) {
      nextNotes = [...notes];
      for (const n of doc.notes) {
        const existingIdx = n.id ? nextNotes.findIndex((x) => x.id === n.id) : -1;
        const built: Note = {
          id: n.id ?? uid(),
          title: n.title,
          body: n.body,
          tags: n.tags ?? [],
          date: n.date ?? todayISODate(),
          pinned: n.pinned ?? false,
          area: n.area ?? "otro",
          subject: n.subject,
          examScore: n.examScore,
          createdAt: existingIdx >= 0 ? nextNotes[existingIdx].createdAt : now,
          updatedAt: now,
        };
        if (existingIdx >= 0) {
          nextNotes[existingIdx] = built;
        } else {
          nextNotes.unshift(built);
          summary.notesAdded++;
        }
      }
    }

    setGoals(nextGoals);
    setPlanItems(nextPlanItems);
    setNotes(nextNotes);
    await Promise.all([saveGoals(nextGoals), savePlanItems(nextPlanItems), saveNotes(nextNotes)]);

    return summary;
  }

  const value = useMemo(
    () => ({
      ready,
      goals,
      entries,
      planItems,
      notes,
      settings,
      addGoal,
      updateGoal,
      deleteGoal,
      setEntryForToday,
      getEntry,
      updateSettings,
      addPlanItem,
      updatePlanItem,
      cyclePlanItemStatus,
      setPlanItemStatus,
      recordPlanItemResult,
      deletePlanItem,
      addNote,
      updateNote,
      deleteNote,
      importDocument,
    }),
    [ready, goals, entries, planItems, notes, settings]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp debe usarse dentro de AppProvider");
  return ctx;
}
