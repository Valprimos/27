# Arquitectura de 27

## Primera versión

27 es una aplicación web estática, sin dependencias de servidor. La interfaz usa HTML, CSS y JavaScript nativos. Los datos se conservan en `localStorage` bajo una clave versionada; un archivo JSON permite exportarlos y volverlos a importar. Un service worker almacena los recursos de la interfaz para que la app cargue sin conexión tras la primera visita.

La capa de almacenamiento es local a cada navegador/dispositivo. No hay cuentas, base de datos remota ni sincronización automática. El estado inicial crea catálogos de hábitos, áreas y asignaturas, pero no crea registros de actividad pasados.

## iCloud

Apple ofrece CloudKit JS para sitios web. Requiere un contenedor CloudKit existente, activar sus servicios web y configurar autenticación/acceso web. Por eso no se activa una sincronización sin configurar esos recursos y credenciales. Mientras tanto, la copia JSON es la transferencia explícita entre dispositivos.

## Publicación

La app se publica en GitHub Pages desde la raíz de `main`, en `https://valprimos.github.io/27/`, y se sirve mediante HTTPS. El repositorio y sus documentos son públicos. Los registros de uso siguen guardándose localmente en cada navegador y no se publican con el código.
