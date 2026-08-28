export type GoalKind = "habit" | "numeric" | "money";

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

  notes?: string;
}

export interface DailyEntry {
  id: string; // `${goalId}_${date}`
  goalId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  progress: number; // cantidad realizada (minutos, páginas, € ahorrado ese día...)
  skipped: boolean; // marcado explícitamente como "saltado/no hecho"
  note?: string;
  updatedAt: string; // ISO datetime
}

// Tarea puntual anclada a una fecha concreta del calendario (ej. "17 de mayo:
// entrenamiento de piernas", "20 de mayo: examen de Cálculo"). No se repite
// solo ni se convierte en un hábito semanal: vive únicamente ese día.
export type PlanCategory = "entrenamiento" | "estudio" | "dinero" | "examen" | "otro";

export interface PlanItem {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description?: string;
  category: PlanCategory;
  icon: string;
  targetValue?: number;
  unit?: string;
  completed: boolean;
  source: "manual" | "import";
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  tags: string[];
  date: string; // YYYY-MM-DD, fecha de referencia (ej. fecha del examen)
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// Formato del "documento" que se pega en Ajustes > Importar plan. Es lo que
// Claude genera en la conversación a partir de tus objetivos, sin llamar a
// ninguna API ni gastar nada: tú lo copias y pegas.
export interface ImportDocument {
  version: 1;
  generatedAt?: string;
  planItems?: Array<{
    id?: string;
    date: string;
    title: string;
    description?: string;
    category?: PlanCategory;
    icon?: string;
    targetValue?: number;
    unit?: string;
    completed?: boolean;
  }>;
  notes?: Array<{
    id?: string;
    title: string;
    body: string;
    tags?: string[];
    date?: string;
    pinned?: boolean;
  }>;
  goals?: Array<{
    id?: string;
    name: string;
    kind: GoalKind;
    icon?: string;
    color?: string;
    dailyTarget?: number;
    unit?: string;
    moneyTarget?: number;
    moneySaved?: number;
    activeDays?: WeekDay[];
  }>;
}

export interface AppSettings {
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
