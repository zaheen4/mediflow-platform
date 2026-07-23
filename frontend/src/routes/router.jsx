import { createBrowserRouter } from "react-router-dom";

import HomeLayout from "../components/Layout/HomeLayout";
import Login from "../pages/Login/Login";
import WelcomePage from "../pages/Home/WelcomePage";
import Register from "../pages/Register/Register";
import Shop from "../pages/Equipment/Shop";
import AdminDashboard from "../pages/Equipment/AdminDashboard";
import About from "../pages/About/About";
import Services from "../pages/About/Services";
import Cart from "../pages/Cart/Cart";
import OrderHistory from "../pages/Orders/OrderHistory";
import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        children: [
            {
                path: "/",
                element: <WelcomePage />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/buy-equipment",
                element: (
                    <ProtectedRoute>
                        <Shop />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/cart",
                element: (
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/orders",
                element: (
                    <ProtectedRoute>
                        <OrderHistory />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/admin-dashboard",
                element: (
                    <ProtectedRoute adminOnly>
                        <AdminDashboard />
                    </ProtectedRoute>
                ),
            },
            {
                path: "/about",
                element: <About />,
            },
            {
                path: "/services",
                element: <Services />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
]);
