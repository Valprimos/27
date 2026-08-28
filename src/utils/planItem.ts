import { PlanItem, PlanItemStatus } from "@/types";
import { todayISODate } from "./dates";

// Un plan item "pending" cuya fecha ya pasó no queda pendiente para siempre:
// si no lo hiciste ese día, se pierde. Esto es solo para mostrar/estadísticas,
// no cambia el dato guardado (el usuario puede seguir marcándolo a mano).
export type EffectiveStatus = PlanItemStatus | "missed";

export function effectiveStatus(item: PlanItem, today: string = todayISODate()): EffectiveStatus {
  if (item.status === "pending" && item.date < today) return "missed";
  return item.status;
}
