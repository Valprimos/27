export type RootStackParamList = {
  Main: undefined;
  Goals: undefined;
  GoalForm: { goalId?: string };
  PlanItemForm: { date: string };
  ImportPlan: undefined;
  NoteForm: { noteId?: string };
};

export type MainTabKey = "home" | "agenda" | "notes" | "stats" | "settings";
