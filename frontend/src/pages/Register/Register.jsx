import login_image2 from "../../assets/luke-chesser-CxBx_J3yp9g-unsplash.jpg";
import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "sonner";

const VALID_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!formData.username || formData.username.length < 3 || formData.username.length > 50) {
            setErrorMessage("Username must be between 3 and 50 characters");
            return;
        }

        if (!formData.password || formData.password.length < 6) {
            setErrorMessage("Password must be at least 6 characters");
            return;
        }

        if (!formData.email || !VALID_EMAIL.test(formData.email)) {
            setErrorMessage("Please enter a valid email address");
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post("/register", formData);

            setSuccessMessage(response.data.message);
            setFormData({
                username: "",
                password: "",
                email: "",
            });

            toast.success("Registration Successful!");

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            if (error.response) {
                setErrorMessage(error.response.data.error || "Registration failed!");
            } else {
                setErrorMessage("An error occurred!");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="hero min-h-screen items-center">
            <img src={login_image2} alt="" className="h-[860px] w-full object-cover" />

            <div className="max-w-sm w-full p-8 text-white shadow-[0_0_60px_rgba(0,0,0,0.3)] rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
                {errorMessage && <div className="text-yellow-400 text-center mb-4">{errorMessage}</div>}
                {successMessage && <div className="text-green-400 text-center mb-4">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-semibold text-white ">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 p-2 border-none rounded-md text-black bg-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-semibold text-white">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full mt-2 p-2 border-none rounded-md text-black bg-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold text-white">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full mt-2 p-2 pr-10 border-none rounded-md text-black bg-white"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-base-content mt-2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full bg-mediflow-red text-white p-2 rounded-md hover:bg-mediflow-crimson shadow- disabled:opacity-50"
                            disabled={submitting}
                        >
                            {submitting ? <span className="loading loading-spinner loading-sm"></span> : "Register"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
