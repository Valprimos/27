# 27 — A tu ritmo

Aplicación personal para registrar hábitos, formación elegida por ti, notas académicas y experiencias puntuales. Los cuatro ámbitos mantienen historiales y estadísticas separados.

## Ejecutar en Mac

La aplicación no necesita instalar paquetes ni usar una cuenta. Desde la carpeta del proyecto, inicia un servidor local:

```bash
python3 -m http.server 8000
```

Abre <http://localhost:8000> en el navegador. La primera carga necesita conexión; después, la interfaz básica queda disponible sin conexión.

## Datos y privacidad

- Los registros se guardan en el almacenamiento local del navegador de cada dispositivo.
- No se envían a este repositorio ni a un servidor de 27.
- Usa **Configuración → Exportar todos mis datos** para hacer copias o mover datos entre dispositivos; importar sustituye los datos locales actuales.
- Esta versión no sincroniza automáticamente con iCloud. La aplicación informa de los requisitos de CloudKit JS en Configuración.
- El código fuente está en un repositorio privado. La app no se ha publicado en GitHub Pages.

Para instalarla desde Safari en iPhone como PWA, debe servirse desde una dirección HTTPS. La instalación no se activa al abrir el archivo directamente. Si se publica en algún sitio, la web publicada debe tratarse como accesible públicamente aunque el repositorio sea privado.

## Funciones incluidas

- Hábitos diarios, por días concretos o varias veces por semana; exclusiones por fecha; pausa, archivo, edición y eliminación.
- Registro independiente de sesiones en Matemáticas personal, Inglés personal, Python y otras áreas.
- Asignaturas y notas de exámenes y evaluaciones, medias normalizadas sobre 10 y evolución por asignatura.
- Extras editables que no afectan a hábitos, rachas ni porcentaje diario.
- Calendario, ánimo, reflexiones con guardado automático, objetivos, curiosidades con fuentes, estadísticas basadas en registros y copias JSON.
- Diseño adaptable a Mac y iPhone, manifest PWA y caché local de la interfaz.

## Especificación

Los requisitos completos están en [docs/REQUISITOS.md](docs/REQUISITOS.md).
