import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppSettings, DailyEntry, Goal, Note, PlanItem } from "@/types";

const GOALS_KEY = "dailygoals:goals";
const ENTRIES_KEY = "dailygoals:entries";
const SETTINGS_KEY = "dailygoals:settings";
const PLAN_ITEMS_KEY = "dailygoals:planItems";
const NOTES_KEY = "dailygoals:notes";

async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? JSON.parse(raw) : fallback;
}

async function saveJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const loadGoals = () => loadJSON<Goal[]>(GOALS_KEY, []);
export const saveGoals = (goals: Goal[]) => saveJSON(GOALS_KEY, goals);

export const loadEntries = () => loadJSON<DailyEntry[]>(ENTRIES_KEY, []);
export const saveEntries = (entries: DailyEntry[]) => saveJSON(ENTRIES_KEY, entries);

export const loadPlanItems = () => loadJSON<PlanItem[]>(PLAN_ITEMS_KEY, []);
export const savePlanItems = (items: PlanItem[]) => saveJSON(PLAN_ITEMS_KEY, items);

export const loadNotes = () => loadJSON<Note[]>(NOTES_KEY, []);
export const saveNotes = (notes: Note[]) => saveJSON(NOTES_KEY, notes);

const DEFAULT_SETTINGS: AppSettings = {
  themePreference: "system",
};

export const loadSettings = () => loadJSON<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
export const saveSettings = (settings: AppSettings) => saveJSON(SETTINGS_KEY, settings);
