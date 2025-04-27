import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider";

// Add app-root class to the root element for theme targeting
const rootElement = document.getElementById("root")!;
rootElement.classList.add("app-root");

createRoot(rootElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);