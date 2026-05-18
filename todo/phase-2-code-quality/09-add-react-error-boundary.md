# Add React Error Boundary

## Goal
Create an error boundary component to catch React rendering errors and display a fallback UI instead of crashing the entire app.

## Files to Create
- `src/components/Context/ErrorBoundary.jsx`

## Files to Touch
- `src/main.jsx`

## Steps

1. Create `src/components/Context/ErrorBoundary.jsx`:

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
                        <p className="text-gray-600 mb-4">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
```

2. Wrap the app in `src/main.jsx`:

```jsx
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
```

## Verification
- App should load normally
- To test: temporarily add `throw new Error("test")` inside any component's render — you should see the error boundary UI instead of a blank screen
- Remove the test error after confirming it works
