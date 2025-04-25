import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./context/ThemeProvider";

// Create a custom element 
const rootElement = document.getElementById("root")!;
rootElement.className = "app-root";

createRoot(rootElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
