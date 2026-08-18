import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "./theme";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <Analytics />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
