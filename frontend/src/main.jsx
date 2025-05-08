import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import AuthCon from "./Context/AuthCon.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthCon>
      <App />
    </AuthCon>
  </StrictMode>
);
