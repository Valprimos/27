import { DailyEntry, Goal } from "@/types";
import { todayISODate } from "@/utils/dates";

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-5";

interface AiPlanInput {
  apiKey: string;
  goals: Goal[];
  entries: DailyEntry[];
  extraContext?: string;
}

async function callClaude(apiKey: string, prompt: string): Promise<string> {
  const res = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 700,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error de la IA (${res.status}): ${text || res.statusText}`);
  }

  const data = await res.json();
  const block = data?.content?.[0];
  return block?.text ?? "No se ha recibido respuesta de la IA.";
}

export async function generateDailyPlan({ apiKey, goals, entries, extraContext }: AiPlanInput): Promise<string> {
  const today = todayISODate();
  const activeGoals = goals.filter((g) => g.active);
  const todayEntries = entries.filter((e) => e.date === today);

  const summary = activeGoals
    .map((g) => {
      const entry = todayEntries.find((e) => e.goalId === g.id);
      const target = g.dailyTarget ? `${g.dailyTarget} ${g.unit ?? ""}` : "sin cantidad fija";
      const done = entry?.completed ? `hecho (${entry.progress ?? 0} ${g.unit ?? ""})` : "pendiente hoy";
      return `- ${g.name} [${g.kind}]: objetivo diario ${target}. Estado: ${done}.`;
    })
    .join("\n");

  const prompt = `Eres un coach personal breve y motivador en español. El usuario tiene estos objetivos diarios:\n${summary}\n\n${
    extraContext ? `Contexto adicional del usuario: ${extraContext}\n\n` : ""
  }Dame un plan del día MUY concreto: para cada objetivo pendiente di exactamente cuánto debe hacer hoy y una micro-instrucción práctica (ej. "practica 20 minutos de inglés con una serie con subtítulos"). Sé cercano, breve (máximo 180 palabras) y termina con una frase corta de ánimo.`;

  return callClaude(apiKey, prompt);
}

export async function evaluateDay({
  apiKey,
  goals,
  entries,
  extraContext,
}: AiPlanInput): Promise<string> {
  const today = todayISODate();
  const activeGoals = goals.filter((g) => g.active);
  const todayEntries = entries.filter((e) => e.date === today);

  const summary = activeGoals
    .map((g) => {
      const entry = todayEntries.find((e) => e.goalId === g.id);
      if (!entry) return `- ${g.name}: sin registrar.`;
      return `- ${g.name}: ${entry.completed ? "COMPLETADO" : "NO completado"} (${entry.progress ?? 0} ${g.unit ?? ""})${
        entry.note ? `, nota: "${entry.note}"` : ""
      }`;
    })
    .join("\n");

  const prompt = `Eres un coach personal en español, cercano pero honesto. Este ha sido el día del usuario:\n${summary}\n\n${
    extraContext ? `Nota general del día: ${extraContext}\n\n` : ""
  }Evalúa brevemente (máx 150 palabras) cómo ha ido el día, reconoce lo logrado, señala con delicadeza lo que quedó pendiente, y da UN consejo concreto para mañana.`;

  return callClaude(apiKey, prompt);
}
