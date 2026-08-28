import { DailyEntry, Goal, GoalStats } from "@/types";
import { addDays, isScheduledOn, lastNDates, todayISODate } from "./dates";

export function computeGoalStats(goal: Goal, entries: DailyEntry[]): GoalStats {
  const goalEntries = entries.filter((e) => e.goalId === goal.id);
  const byDate = new Map(goalEntries.map((e) => [e.date, e]));

  const today = todayISODate();
  let cursor = today;
  let currentStreak = 0;

  // Si hoy todavía no se ha completado pero está programado, no rompe la racha,
  // simplemente empezamos a contar desde ayer.
  const todayEntry = byDate.get(today);
  if (!todayEntry?.completed && isScheduledOn(goal.activeDays, today)) {
    cursor = addDays(today, -1);
  }

  // Recorremos hacia atrás sumando racha mientras los días programados estén completados
  for (let i = 0; i < 3650; i++) {
    if (new Date(goal.createdAt) > new Date(cursor)) break;
    if (!isScheduledOn(goal.activeDays, cursor)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    const entry = byDate.get(cursor);
    if (entry?.completed) {
      currentStreak++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }

  // Mejor racha histórica
  let bestStreak = 0;
  let running = 0;
  const allDates = goalEntries.map((e) => e.date).sort();
  const start = allDates[0] ?? today;
  let d = start;
  while (d <= today) {
    if (isScheduledOn(goal.activeDays, d)) {
      const entry = byDate.get(d);
      if (entry?.completed) {
        running++;
        bestStreak = Math.max(bestStreak, running);
      } else {
        running = 0;
      }
    }
    d = addDays(d, 1);
  }
  bestStreak = Math.max(bestStreak, currentStreak);

  const totalCompleted = goalEntries.filter((e) => e.completed).length;
  const totalSkipped = goalEntries.filter((e) => e.skipped && !e.completed).length;
  const totalScheduled = goalEntries.length;
  const completionRate = totalScheduled > 0 ? totalCompleted / totalScheduled : 0;
  const totalProgress = goalEntries.reduce((sum, e) => sum + (e.progress || 0), 0);

  const last7Days = lastNDates(7).map((date) => byDate.get(date)?.completed ?? false);

  return {
    goalId: goal.id,
    currentStreak,
    bestStreak,
    totalCompleted,
    totalSkipped,
    totalScheduled,
    completionRate,
    last7Days,
    totalProgress,
  };
}

export function computeOverallStats(goals: Goal[], entries: DailyEntry[]) {
  const activeGoals = goals.filter((g) => g.active);
  const perGoal = activeGoals.map((g) => computeGoalStats(g, entries));

  const totalCompleted = perGoal.reduce((s, g) => s + g.totalCompleted, 0);
  const totalScheduled = perGoal.reduce((s, g) => s + g.totalScheduled, 0);
  const totalSkipped = perGoal.reduce((s, g) => s + g.totalSkipped, 0);
  const overallRate = totalScheduled > 0 ? totalCompleted / totalScheduled : 0;
  const bestCurrentStreak = perGoal.reduce((m, g) => Math.max(m, g.currentStreak), 0);

  return {
    perGoal,
    totalCompleted,
    totalScheduled,
    totalSkipped,
    overallRate,
    bestCurrentStreak,
  };
}
