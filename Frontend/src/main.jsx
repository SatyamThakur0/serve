import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import Store from "./store/index.js";
import { SocketProvider } from "./store/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider store={Store}>
            <SocketProvider>
                <App />
                <Toaster />
            </SocketProvider>
        </Provider>
    </StrictMode>
);
