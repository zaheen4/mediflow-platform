# Create User Profile Page

## Goal
Create a page where logged-in users can view their profile information and change their password.

## Files to Create
- `src/components/Profile/Profile.jsx`

## Files to Touch
- `src/routes/Route.jsx`
- `mediflow-backend/routes/auth_routes.js` (add change-password endpoint)

## Steps

### 1. Add Backend Endpoint

Open `mediflow-backend/routes/auth_routes.js` and add:

```js
// Change Password Route
router.put('/change-password', verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "New password must be at least 6 characters" });
    }

    try {
        const userResult = await executeQuery(
            "SELECT * FROM users WHERE user_id = ?",
            [req.user.user_id]
        );

        if (userResult.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const user = userResult[0];
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await executeQuery(
            "UPDATE users SET password = ? WHERE user_id = ?",
            [hashedPassword, req.user.user_id]
        );

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
```

### 2. Create Frontend Component

Create `src/components/Profile/Profile.jsx`:

```jsx
import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        try {
            await axios.put(
                `${API_BASE_URL}/change-password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            toast.success("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to change password");
        }
    };

    return (
        <div className="container mx-auto p-6 min-h-screen">
            <h2 className="text-3xl font-bold text-center mb-6">My Profile</h2>

            <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">Account Information</h3>
                    <p className="text-gray-600"><strong>Username:</strong> {user.username}</p>
                    <p className="text-gray-600"><strong>Role:</strong> {user.role}</p>
                </div>

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
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowCurrent(!showCurrent)}>
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
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowNew(!showNew)}>
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
                            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setShowConfirm(!showConfirm)}>
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full">
                        Change Password
                    </button>
                </form>
            </div>

            <ToastContainer position="top-center" autoClose={3000} theme="light" />
        </div>
    );
};

export default Profile;
```

### 3. Add Route

In `src/routes/Route.jsx`:

```jsx
import Profile from "../components/Profile/Profile";

{
    path: "/profile",
    element: (
        <ProtectedRoute>
            <Profile />
        </ProtectedRoute>
    ),
},
```

### 4. Add Navbar Link

In the Navbar user dropdown, add:
```jsx
<li>
    <Link to="/profile">Profile</Link>
</li>
```

## Verification
- Logged-in user navigates to `/profile` → sees username, role, and password change form
- Correct current password + matching new passwords → success toast
- Wrong current password → error toast
- Mismatched new passwords → error toast
- New password < 6 chars → error toast from backend
