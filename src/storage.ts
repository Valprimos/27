import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { AppSettings, DailyEntry, Goal } from "@/types";

const GOALS_KEY = "dailygoals:goals";
const ENTRIES_KEY = "dailygoals:entries";
const SETTINGS_KEY = "dailygoals:settings";
const AI_KEY_SECURE = "dailygoals:ai_api_key";

export async function loadGoals(): Promise<Goal[]> {
  const raw = await AsyncStorage.getItem(GOALS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveGoals(goals: Goal[]): Promise<void> {
  await AsyncStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

export async function loadEntries(): Promise<DailyEntry[]> {
  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function saveEntries(entries: DailyEntry[]): Promise<void> {
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

const DEFAULT_SETTINGS: AppSettings = {
  aiEnabled: false,
  themePreference: "system",
};

export async function loadSettings(): Promise<AppSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  const settings = raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  const apiKey = await SecureStore.getItemAsync(AI_KEY_SECURE);
  return { ...settings, aiApiKey: apiKey ?? undefined };
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  const { aiApiKey, ...rest } = settings;
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(rest));
  if (aiApiKey) {
    await SecureStore.setItemAsync(AI_KEY_SECURE, aiApiKey);
  } else {
    await SecureStore.deleteItemAsync(AI_KEY_SECURE).catch(() => {});
  }
}
