import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "sonner";

import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import AuthProvider from "./context/AuthContext";
import CartProvider from "./context/CartContext";
import ErrorBoundary from "./context/ErrorBoundary";

createRoot(document.getElementById("root")).render(
    <>
        <StrictMode>
            <ErrorBoundary>
                <AuthProvider>
                    <CartProvider>
                        <RouterProvider router={router} />
                    </CartProvider>
                </AuthProvider>
            </ErrorBoundary>
        </StrictMode>
        <Toaster position="top-right" duration={3000} richColors expand={false} />
    </>
);
