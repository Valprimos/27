// Paleta y gradientes inspirados en el estilo de las apps de Apple (Fitness,
// Salud, Wallet): fondo oscuro casi negro con acentos en degradado vivo.

export const colors = {
  bg: "#050810",
  bgTop: "#0b1220",
  card: "rgba(255,255,255,0.045)",
  cardBorder: "rgba(255,255,255,0.09)",
  cardBorderStrong: "rgba(255,255,255,0.16)",
  text: "#f5f7fa",
  textDim: "#9aa5b6",
  textFaint: "#5f6b80",
  divider: "rgba(255,255,255,0.08)",
};

export const gradients = {
  background: ["#0d1220", "#070a12", "#050810"] as const,
  green: ["#34d399", "#059669"] as const,
  blue: ["#60a5fa", "#2563eb"] as const,
  purple: ["#c084fc", "#7c3aed"] as const,
  pink: ["#fb7185", "#db2777"] as const,
  orange: ["#fbbf24", "#ea580c"] as const,
  cyan: ["#67e8f9", "#0891b2"] as const,
  money: ["#facc15", "#f97316"] as const,
  header: ["#1d2540", "#0d1220"] as const,
  glass: ["rgba(255,255,255,0.09)", "rgba(255,255,255,0.02)"] as const,
};

export const categoryGradient: Record<string, readonly [string, string]> = {
  entrenamiento: gradients.orange,
  ingles: gradients.cyan,
  estudio: gradients.blue,
  dinero: gradients.money,
  examen: gradients.pink,
  otro: gradients.purple,
};

export const CATEGORY_LABEL: Record<string, string> = {
  entrenamiento: "Entrenamiento",
  ingles: "Inglés",
  estudio: "Estudio",
  dinero: "Dinero",
  examen: "Examen",
  otro: "Otro",
};

export const radius = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
};
