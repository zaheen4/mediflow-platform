import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

import HomeLayout from "../components/Layout/HomeLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import RouteErrorBoundary from "../components/RouteErrorBoundary";

const Login = lazy(() => import("../pages/Login/Login"));
const WelcomePage = lazy(() => import("../pages/Home/WelcomePage"));
const Register = lazy(() => import("../pages/Register/Register"));
const Shop = lazy(() => import("../pages/Equipment/Shop"));
const EquipmentDetail = lazy(() => import("../pages/Equipment/EquipmentDetail"));
const AdminDashboard = lazy(() => import("../pages/Equipment/AdminDashboard"));
const About = lazy(() => import("../pages/About/About"));
const Services = lazy(() => import("../pages/About/Services"));
const Cart = lazy(() => import("../pages/Cart/Cart"));
const OrderHistory = lazy(() => import("../pages/Orders/OrderHistory"));
const Profile = lazy(() => import("../pages/Profile/Profile"));
const NotFound = lazy(() => import("../pages/NotFound/NotFound"));

const wrap = (element, name) => <RouteErrorBoundary name={name}>{element}</RouteErrorBoundary>;

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        children: [
            {
                path: "/",
                element: wrap(<WelcomePage />, "WelcomePage"),
            },
            {
                path: "/login",
                element: wrap(<Login />, "Login"),
            },
            {
                path: "/register",
                element: wrap(<Register />, "Register"),
            },
            {
                path: "/buy-equipment",
                element: wrap(
                    <ProtectedRoute>
                        <Shop />
                    </ProtectedRoute>,
                    "Shop"
                ),
            },
            {
                path: "/equipment/:id",
                element: wrap(
                    <ProtectedRoute>
                        <EquipmentDetail />
                    </ProtectedRoute>,
                    "EquipmentDetail"
                ),
            },
            {
                path: "/cart",
                element: wrap(
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>,
                    "Cart"
                ),
            },
            {
                path: "/orders",
                element: wrap(
                    <ProtectedRoute>
                        <OrderHistory />
                    </ProtectedRoute>,
                    "OrderHistory"
                ),
            },
            {
                path: "/profile",
                element: wrap(
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>,
                    "Profile"
                ),
            },
            {
                path: "/admin-dashboard",
                element: wrap(
                    <ProtectedRoute adminOnly>
                        <AdminDashboard />
                    </ProtectedRoute>,
                    "AdminDashboard"
                ),
            },
            {
                path: "/about",
                element: wrap(<About />, "About"),
            },
            {
                path: "/services",
                element: wrap(<Services />, "Services"),
            },
            {
                path: "*",
                element: wrap(<NotFound />, "NotFound"),
            },
        ],
    },
]);
