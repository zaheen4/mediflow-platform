import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from "react-router-dom";
import { router } from './routes/Route';
import AuthProvider from './components/Context/AuthContext';
import CartProvider from './components/Context/CartContext';
import ErrorBoundary from './components/Context/ErrorBoundary';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ErrorBoundary>
            <AuthProvider>
                <CartProvider>
                    <RouterProvider router={router} />
                </CartProvider>
            </AuthProvider>
        </ErrorBoundary>
    </StrictMode>,
)
