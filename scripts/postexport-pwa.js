/**
 * Tras `expo export -p web`, añade lo necesario para que la web sea instalable
 * como app en iOS (Safari "Añadir a pantalla de inicio") y Android/Chrome:
 * manifest.webmanifest, iconos y las etiquetas <meta>/<link> de Apple que
 * Expo no genera automáticamente sin expo-router.
 */
const fs = require("fs");
const path = require("path");

const BASE_URL = "/27";
const OUT_DIR = path.join(__dirname, "..", "docs");

function copyAsset(name) {
  fs.copyFileSync(path.join(__dirname, "..", "assets", name), path.join(OUT_DIR, name));
}

function main() {
  if (!fs.existsSync(OUT_DIR)) {
    throw new Error(`No existe ${OUT_DIR}. Ejecuta antes "npx expo export -p web --output-dir docs".`);
  }

  copyAsset("icon-192.png");
  copyAsset("icon-512.png");
  copyAsset("apple-touch-icon.png");

  const manifest = {
    name: "Mis Objetivos Diarios",
    short_name: "Objetivos",
    description: "App personal para seguir tus objetivos diarios: estudio, ejercicio, ahorro y notas.",
    start_url: `${BASE_URL}/`,
    scope: `${BASE_URL}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: "#0b1220",
    theme_color: "#0b1220",
    lang: "es",
    icons: [
      { src: `${BASE_URL}/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: `${BASE_URL}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
  fs.writeFileSync(path.join(OUT_DIR, "manifest.webmanifest"), JSON.stringify(manifest, null, 2));

  const indexPath = path.join(OUT_DIR, "index.html");
  let html = fs.readFileSync(indexPath, "utf8");

  // `viewport-fit=cover` es imprescindible para que la web instalada en el
  // iPhone pinte también debajo de la isla dinámica / notch; sin esto esa
  // franja de arriba se queda con el blanco por defecto de Safari.
  html = html.replace(
    /<meta name="viewport" content="[^"]*"\s*\/>/,
    '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />'
  );

  const pwaTags = `
  <link rel="manifest" href="${BASE_URL}/manifest.webmanifest" />
  <link rel="apple-touch-icon" href="${BASE_URL}/apple-touch-icon.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="${BASE_URL}/icon-192.png" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Objetivos" />
  <style>
    html, body { background-color: #050810; }
  </style>
</head>`;

  if (!html.includes("manifest.webmanifest")) {
    html = html.replace("</head>", pwaTags);
  }
  fs.writeFileSync(indexPath, html);

  // GitHub Pages necesita este archivo para servir index.html en rutas desconocidas (SPA).
  fs.copyFileSync(indexPath, path.join(OUT_DIR, "404.html"));

  // Evita que GitHub Pages procese la carpeta con Jekyll (rompería _expo/*).
  fs.writeFileSync(path.join(OUT_DIR, ".nojekyll"), "");

  console.log(`PWA lista para publicar en GitHub Pages desde /${path.basename(OUT_DIR)}`);
}

main();
