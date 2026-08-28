# Mis Objetivos Diarios 🎯

App personal (React Native + Expo) para gestionar tus objetivos diarios: estudiar
inglés, hacer ejercicio, ahorrar dinero, escribir notas... y ver estadísticas de
cumplimiento a lo largo del tiempo. Todos los datos se guardan **localmente en tu
móvil** (sin backend, sin cuentas).

## Funcionalidades

- **Objetivos personalizados** de 4 tipos:
  - **Hábito** (sí/no): meditar, leer, etc.
  - **Numérico**: minutos de inglés, páginas leídas, repeticiones de ejercicio...
  - **Dinero**: meta de ahorro con importe objetivo.
  - **Notas/diario**: reflexión libre del día.
  - Cada objetivo tiene icono, color, días de la semana activos y cantidad diaria
    objetivo con su unidad.
- **Pantalla "Hoy"**: te dice exactamente cuánto tienes que hacer de cada cosa hoy,
  y te deja marcarlo como hecho (con la cantidad real) o saltado.
- **Plan inteligente del día** (opcional, con IA): genera instrucciones concretas
  para cada objetivo pendiente usando la API de Claude.
- **Evaluación del día** (opcional, con IA): al final del día, te da feedback sobre
  lo que has cumplido y un consejo para mañana, a partir de tus notas.
- **Estadísticas**: racha actual, mejor racha histórica, días completados, días
  saltados, % de cumplimiento, progreso acumulado (minutos totales, dinero
  ahorrado...) y vista de los últimos 7 días por objetivo.

## Cómo ejecutarla

```bash
npm install
npm start
```

Luego escanea el código QR con la app **Expo Go** (Android/iOS) o pulsa `a`/`i`
para abrir un emulador.

## Activar el asistente de IA (opcional)

1. Ve a **Ajustes** dentro de la app.
2. Activa el interruptor "Activar IA (Claude)".
3. Pega tu propia clave de API de Anthropic (la puedes crear en
   https://console.anthropic.com). Se guarda cifrada solo en tu dispositivo
   (`expo-secure-store`) y se usa únicamente para llamar directamente a la API
   de Anthropic desde tu móvil.

Sin clave configurada, la app funciona igualmente al 100% en modo local/manual.

## Estructura del proyecto

```
App.tsx                     Punto de entrada y navegación
src/types.ts                 Modelos de datos (Goal, DailyEntry, Settings...)
src/storage.ts                Persistencia local (AsyncStorage + SecureStore)
src/context/AppContext.tsx    Estado global de la app
src/utils/dates.ts             Utilidades de fechas
src/utils/stats.ts             Cálculo de rachas y estadísticas
src/services/ai.ts             Integración opcional con la API de Claude
src/screens/                   Pantallas: Hoy, Objetivos, Estadísticas, Ajustes
src/components/                Componentes reutilizables (GoalCard, ProgressBar)
src/navigation/                Navegación (stack + tabs personalizadas)
```
