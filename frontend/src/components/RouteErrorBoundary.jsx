import { Component } from "react";
import { Link } from "react-router-dom";

class RouteErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error(`RouteErrorBoundary (${this.props.name || "unknown"}):`, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="bg-base-200 p-8 rounded-lg shadow-lg text-center max-w-md">
                        <h1 className="text-2xl font-bold text-error mb-4">Page Error</h1>
                        <p className="text-base-content/70 mb-4">Something went wrong loading this page.</p>
                        <Link to="/" className="btn btn-primary">
                            Go Home
                        </Link>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default RouteErrorBoundary;
