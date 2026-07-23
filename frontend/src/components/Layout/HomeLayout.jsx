import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const fallback = (
    <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
);

const HomeLayout = () => {
    return (
        <div>
            <Navbar />
            <div className="mx-auto">
                <Suspense fallback={fallback}>
                    <Outlet />
                </Suspense>
            </div>
            <Footer />
        </div>
    );
};

export default HomeLayout;
