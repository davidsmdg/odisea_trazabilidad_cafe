
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import "./app/utils/pwaInstallManager";

createRoot(document.getElementById("root")!).render(<App />);

// Registro del service worker (offline del portal del productor).
// Solo en producción: en dev estorba con el hot-reload de Vite.
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* sin SW la app sigue funcionando, solo pierde el modo offline */
    });
  });
}
