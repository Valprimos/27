import { useEffect, useState } from "react";
import { Platform } from "react-native";

// En la PWA de iOS, RN's KeyboardAvoidingView no hace nada en web (es un
// no-op ahí), y el teclado nativo del navegador no reajusta el layout de la
// app: al abrirlo/cerrarlo queda un hueco donde antes/después estaba el
// teclado. Escuchamos el tamaño real de la ventana visible (visualViewport)
// y forzamos ese alto en el contenedor raíz para que todo se reajuste solo.
export function useWebViewportHeight(): number | undefined {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window === "undefined" || !window.visualViewport) return;
    const vv = window.visualViewport;
    const update = () => setHeight(vv.height);
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return height;
}
