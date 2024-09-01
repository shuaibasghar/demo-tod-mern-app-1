import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/authContext.jsx";
import { TaskProvider } from "./contexts/taskContext.jsx";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <TaskProvider>
            <StrictMode>
                <App />
            </StrictMode>
        </TaskProvider>
    </AuthProvider>
);
