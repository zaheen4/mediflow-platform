import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";
import { toast } from "sonner";
import { FaEye, FaEyeSlash, FaSave } from "react-icons/fa";

const Profile = () => {
    const { user, login } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [profileLoading, setProfileLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/users/me");
                setUsername(res.data.username);
                setEmail(res.data.email);
            } catch {
                toast.error("Failed to load profile");
            } finally {
                setProfileLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!username || username.length < 3 || username.length > 50) {
            toast.error("Username must be between 3 and 50 characters");
            return;
        }
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.error("Invalid email format");
            return;
        }

        setSavingProfile(true);
        try {
            const res = await api.put("/users/me", { username, email });
            login({
                ...user,
                username: res.data.username,
                email: res.data.email,
            });
            toast.success("Profile updated");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to update profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!newPassword || newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setSubmitting(true);
        try {
            await api.put("/change-password", { currentPassword, newPassword });
            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to change password");
        } finally {
            setSubmitting(false);
        }
    };

    if (profileLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-red-500"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6">My Profile</h2>

            <div className="max-w-md mx-auto bg-base-100 p-6 rounded-lg shadow-md">
                <form onSubmit={handleSaveProfile} className="mb-6">
                    <h3 className="text-xl font-semibold mb-4">Account Information</h3>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <input type="text" value={user.role} className="input input-bordered w-full" disabled />
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={savingProfile}>
                        {savingProfile ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                            <>
                                <FaSave className="mr-1" /> Save Profile
                            </>
                        )}
                    </button>
                </form>

                <div className="divider"></div>

                <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="input input-bordered w-full pr-10"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setShowCurrent(!showCurrent)}
                            >
                                {showCurrent ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="input input-bordered w-full pr-10"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setShowNew(!showNew)}
                            >
                                {showNew ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="input input-bordered w-full pr-10"
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                        {submitting ? <span className="loading loading-spinner loading-sm"></span> : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
