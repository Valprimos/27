import { WeekDay } from "@/types";

export function todayISODate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return todayISODate(date);
}

export function weekDayOf(dateStr: string): WeekDay {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay() as WeekDay;
}

export function isScheduledOn(activeDays: WeekDay[], dateStr: string): boolean {
  if (!activeDays || activeDays.length === 0) return true;
  return activeDays.includes(weekDayOf(dateStr));
}

export function lastNDates(n: number, fromDate: string = todayISODate()): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    out.push(addDays(fromDate, -i));
  }
  return out;
}

export const WEEKDAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export function formatFriendlyDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
