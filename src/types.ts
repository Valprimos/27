export type GoalKind = "habit" | "numeric" | "money" | "notes";

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = domingo

export interface Goal {
  id: string;
  name: string;
  kind: GoalKind;
  icon: string; // emoji
  color: string;
  createdAt: string; // ISO date
  active: boolean;

  // Para hábitos/numéricos: cuánto hay que hacer cada día (ej. 30 minutos, 20 páginas)
  dailyTarget?: number;
  unit?: string; // "minutos", "páginas", "repeticiones", "€"...

  // Días de la semana en los que aplica el objetivo (por defecto todos)
  activeDays: WeekDay[];

  // Para objetivos de dinero: meta total y fecha límite opcional
  moneyTarget?: number;
  moneyDeadline?: string; // ISO date
  moneySaved?: number;

  // Recordatorio
  reminderTime?: string; // "HH:mm"
  reminderEnabled?: boolean;

  notes?: string;
}

export interface DailyEntry {
  id: string; // `${goalId}_${date}`
  goalId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  progress: number; // cantidad realizada (minutos, páginas, € ahorrado ese día...)
  skipped: boolean; // marcado explícitamente como "saltado/no hecho"
  note?: string; // nota libre del día (diario, reflexión...)
  updatedAt: string; // ISO datetime
}

export interface AppSettings {
  aiApiKey?: string;
  aiEnabled: boolean;
  userName?: string;
  themePreference: "system" | "light" | "dark";
}

export interface GoalStats {
  goalId: string;
  currentStreak: number;
  bestStreak: number;
  totalCompleted: number;
  totalSkipped: number;
  totalScheduled: number;
  completionRate: number; // 0-1
  last7Days: boolean[]; // true = completado
  totalProgress: number; // suma de progress histórico
}
