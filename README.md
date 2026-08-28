# Mis Objetivos Diarios 🎯

App personal (React Native + Expo) para gestionar tus objetivos: estudiar inglés,
hacer ejercicio, ahorrar dinero, entrenamientos con fecha, notas de exámenes... y
ver estadísticas de cumplimiento. Todos los datos se guardan **localmente en tu
dispositivo** (sin backend, sin cuentas, sin IA de pago).

## Funcionalidades

- **Hoy**: lo que toca hacer hoy — tareas puntuales del calendario y objetivos
  recurrentes — con botones rápidos para marcarlas hechas o saltadas.
- **Calendario**: agenda con todas tus tareas con fecha (entrenamientos futuros,
  exámenes, lo que sea), agrupadas por día. No son hábitos que se repiten solos:
  cada una vive en su fecha, tal y como la hayas planeado.
- **Notas**: un cuaderno libre para apuntes de exámenes, ideas o lo que quieras,
  con etiquetas y buscador.
- **Objetivos recurrentes** (opcional, desde Ajustes): hábitos, metas numéricas
  diarias o ahorro, con racha y % de cumplimiento.
- **Estadísticas**: racha actual, mejor racha histórica, días completados/saltados,
  progreso acumulado y vista semanal por objetivo.
- **Importar plan**: en vez de pagar por una IA conectada, hablas con Claude en la
  conversación, te da un documento (JSON) con tu plan y lo pegas en la app. Se
  procesa 100% offline y sin coste.

## Cómo ejecutarla

```bash
npm install
npm start
```

Luego escanea el código QR con la app **Expo Go** (Android/iOS) o pulsa `a`/`i`
para abrir un emulador.

## Importar un plan (sin gastar en IA)

1. Habla con Claude sobre tu plan de entrenamiento, tus exámenes o tus objetivos.
2. Pídele: *"dame el documento para importar a la app"*.
3. Copia el JSON que te dé y pégalo en **Ajustes → Importar plan** (o desde el
   botón "⬇ Importar plan" en la pantalla Hoy).

Formato del documento (todos los campos excepto `version` son opcionales):

```json
{
  "version": 1,
  "planItems": [
    {
      "date": "2026-05-17",
      "title": "Entrenamiento de piernas",
      "description": "4x10 sentadillas, 3x12 prensa, 3x15 zancadas",
      "category": "entrenamiento",
      "icon": "🏋️",
      "targetValue": 60,
      "unit": "minutos"
    }
  ],
  "notes": [
    {
      "title": "Examen Cálculo II",
      "body": "Temas: derivadas, integrales, series.",
      "tags": ["examen", "cálculo"],
      "date": "2026-05-10"
    }
  ],
  "goals": [
    { "name": "Ahorrar para viaje", "kind": "money", "icon": "💰", "moneyTarget": 1500 }
  ]
}
```

- `category` de `planItems`: `entrenamiento` | `estudio` | `dinero` | `examen` | `otro`.
- `kind` de `goals`: `habit` | `numeric` | `money`.
- Volver a importar un `planItem`/`nota`/`goal` con el mismo `id` lo actualiza en
  vez de duplicarlo.

## Versión web instalable (PWA) en GitHub Pages

Además de la app móvil, el proyecto se puede publicar como una web instalable
("Añadir a pantalla de inicio" en iPhone/Android) usando GitHub Pages:

1. Genera la build web con:
   ```bash
   npm run build:web
   ```
   Esto exporta la app a la carpeta `docs/` (con `expo export -p web`) y añade
   `manifest.webmanifest`, iconos y las etiquetas de Apple necesarias para que
   Safari permita instalarla como app (`postexport-pwa.js`).
2. En GitHub, ve a **Settings → Pages** y selecciona como *source*:
   **Branch: `main`, carpeta `/docs`**.
3. La web quedará disponible en `https://<usuario>.github.io/27/`. En iPhone,
   ábrela con Safari → botón compartir → **"Añadir a pantalla de inicio"**: se
   instalará como una app normal, con icono propio y sin barra de navegador.

> Nota: la ruta base `/27` está fijada en `app.json` (`experiments.baseUrl`)
> para que funcione en la subcarpeta del repo en GitHub Pages. Si cambias el
> nombre del repo o usas un dominio propio, actualiza ese valor y vuelve a
> ejecutar `npm run build:web`.

## Estructura del proyecto

```
App.tsx                        Punto de entrada y navegación
src/types.ts                    Modelos de datos (Goal, PlanItem, Note...)
src/storage.ts                   Persistencia local (AsyncStorage)
src/context/AppContext.tsx       Estado global de la app + importDocument()
src/utils/dates.ts                Utilidades de fechas
src/utils/stats.ts                Cálculo de rachas y estadísticas
src/utils/color.ts                Gradientes derivados del color de cada objetivo
src/theme.ts                      Paleta y gradientes (look Apple)
src/screens/                      Hoy, Calendario, Notas, Estadísticas, Ajustes...
src/components/                   GlassCard, GradientButton, GoalCard, PlanItemCard...
src/navigation/                   Navegación (stack + tabs personalizadas)
```
