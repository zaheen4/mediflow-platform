import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
            <h1 className="text-6xl font-bold text-mediflow-crimson">404</h1>
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-gray-500 text-center max-w-md">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/" className="btn btn-primary">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
