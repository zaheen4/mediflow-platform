import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const HomeLayout = () => {
    return (
        <div>
            <Navbar />
            <div className="mx-auto">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default HomeLayout;
