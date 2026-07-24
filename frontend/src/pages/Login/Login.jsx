import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import login_image2 from "../../assets/luke-chesser-CxBx_J3yp9g-unsplash.jpg";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        if (!username.trim()) {
            setError("Username or email is required");
            return;
        }
        if (!password) {
            setError("Password is required");
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post("/login", { username, password });

            const data = response.data;
            login(data);

            toast.success(`Welcome back, ${data.username}!`);

            navigate("/");
        } catch (error) {
            if (error.response) {
                setError(error.response.data.error || "Login failed");
            } else {
                setError("Network error");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="hero bg-base-200 min-h-screen">
                <img src={login_image2} alt="" className="h-[860px] w-full object-cover" />
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="w-[48%] text-center lg:text-left text-white">
                        <h1 className="text-5xl font-bold ">Welcome to MediFlow!!</h1>
                        <p className="py-6">
                            Log in to access your account and explore our wide range of medical equipment solutions.
                            Your journey to better healthcare starts here.
                        </p>
                    </div>
                    <div className="card w-full max-w-sm shrink-0 shadow-[0px_0px_30px_rgba(0,0,0,0.3)] rounded-2xl">
                        <form className="card-body" onSubmit={handleLogin}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-white">Username or Email</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Username or Email"
                                    className="input input-bordered"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold text-white">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        className="input input-bordered w-full pr-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-base-content"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>
                            {error && <p className="text-red-500">{error}</p>}
                            <div className="form-control mt-6">
                                <button
                                    type="submit"
                                    className="btn bg-mediflow-orange border-none hover:bg-mediflow-crimson shadow-xl text-white w-20"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <span className="loading loading-spinner loading-sm"></span>
                                    ) : (
                                        "Login"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
