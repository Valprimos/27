import { PlanCategory } from "@/types";

export type RootStackParamList = {
  Main: undefined;
  Goals: undefined;
  GoalForm: { goalId?: string };
  PlanItemForm: { date: string; planItemId?: string };
  PlanItemDetail: { planItemId: string };
  ImportPlan: undefined;
  NoteForm: { noteId?: string };
  CategoryStats: { category: PlanCategory };
  GoalStats: { goalId: string };
  SubjectStats: { area: "ingles" | "instituto"; subject?: string };
};

export type MainTabKey = "home" | "agenda" | "notes" | "stats" | "settings";
