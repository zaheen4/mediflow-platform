import { createBrowserRouter } from "react-router-dom";

import Home from "../components/Home/Home";
import Login from "../components/Login/Login";
import WelcomePage from "../components/Home/WelcomePage";
import DummyPage from "../components/Dummy/DummyPage";
import Register from "../components/Register/Regsiter";
import BuyEquipment from "../components/Equipment/BuyEquipment";
import AdminPage from "../components/Equipment/AdminPage";
import About from "../components/About/About";
import Services from "../components/About/Services";
import Cart from "../components/Cart/Cart";
import ProtectedRoute from "../components/Context/ProtectedRoute";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <Home />,
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
            path: "/dummy-page",
            element: <DummyPage />,
         },
          {
             path: "/buy-equipment",
             element: (
                <ProtectedRoute>
                   <BuyEquipment />
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
             path: "/admin-dashboard",
             element: (
                <ProtectedRoute adminOnly>
                   <AdminPage />
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





      ],

   },
]);

