import { DailyEntry, Goal, Note, PlanItem } from "@/types";
import { CATEGORY_LABEL, STATUS_META } from "@/theme";
import { effectiveStatus } from "./planItem";
import { formatFriendlyDate } from "./dates";

interface SummaryInput {
  startDate: string;
  endDate: string;
  goals: Goal[];
  entries: DailyEntry[];
  planItems: PlanItem[];
  notes: Note[];
}

export function generateRangeSummary({ startDate, endDate, goals, entries, planItems, notes }: SummaryInput): string {
  const inRange = (date: string) => date >= startDate && date <= endDate;

  const items = planItems.filter((p) => inRange(p.date)).sort((a, b) => a.date.localeCompare(b.date));
  const lines: string[] = [];

  lines.push(`Resumen del ${startDate} al ${endDate}`);
  lines.push("");
  lines.push(
    "Contexto para Claude: te paso cómo me ha ido en este periodo (calendario, objetivos y notas). " +
      "Dime qué tal ves el progreso, qué patrones notas y qué me recomendarías ajustar."
  );
  lines.push("");

  lines.push("=== CALENDARIO ===");
  if (items.length === 0) {
    lines.push("(sin tareas en este periodo)");
  }
  for (const item of items) {
    const status = effectiveStatus(item);
    const meta = STATUS_META[status];
    const parts = [
      `${item.date} (${CATEGORY_LABEL[item.category] ?? item.category}) ${item.title}: ${meta.label}`,
    ];
    if (item.targetValue) parts.push(`objetivo ${item.targetValue} ${item.unit ?? ""}`.trim());
    if (item.resultValue !== undefined) parts.push(`resultado ${item.resultValue} ${item.unit ?? ""}`.trim());
    if (item.resultNote) parts.push(`sensaciones: "${item.resultNote}"`);
    lines.push(`- ${parts.join(" — ")}`);
  }

  lines.push("");
  lines.push("=== OBJETIVOS RECURRENTES ===");
  const activeGoals = goals.filter((g) => g.active);
  if (activeGoals.length === 0) {
    lines.push("(no tienes objetivos recurrentes)");
  }
  for (const goal of activeGoals) {
    const goalEntries = entries.filter((e) => e.goalId === goal.id && inRange(e.date));
    const completed = goalEntries.filter((e) => e.completed).length;
    const skipped = goalEntries.filter((e) => e.skipped && !e.completed).length;
    const totalProgress = goalEntries.reduce((s, e) => s + (e.progress || 0), 0);
    lines.push(
      `- ${goal.name}: ${completed} completados, ${skipped} saltados, ${goalEntries.length} días registrados` +
        (goal.kind === "numeric" ? `, total ${totalProgress} ${goal.unit ?? ""}` : "") +
        (goal.kind === "money" ? `, ahorrado ${goal.moneySaved ?? 0}€ de ${goal.moneyTarget ?? 0}€` : "")
    );
  }

  const rangeNotes = notes.filter((n) => inRange(n.date)).sort((a, b) => a.date.localeCompare(b.date));
  lines.push("");
  lines.push("=== NOTAS ===");
  if (rangeNotes.length === 0) {
    lines.push("(sin notas en este periodo)");
  }
  for (const n of rangeNotes) {
    const scoreText = n.examScore
      ? ` — ${n.examScore.correct}/${n.examScore.total} (${Math.round((n.examScore.correct / n.examScore.total) * 100)}%)`
      : "";
    const areaText = n.area === "instituto" && n.subject ? `Instituto/${n.subject}` : n.area;
    lines.push(`- ${n.date} [${areaText}] ${n.title}${scoreText}`);
  }

  return lines.join("\n");
}

export function friendlyRangeLabel(startDate: string, endDate: string): string {
  return `${formatFriendlyDate(startDate)} → ${formatFriendlyDate(endDate)}`;
}
