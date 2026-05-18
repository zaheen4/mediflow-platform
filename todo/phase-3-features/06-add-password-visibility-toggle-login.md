# Add Password Visibility Toggle to Login

## Goal
Add a show/hide password toggle button to the login form so users can see what they're typing.

## Files to Touch
- `src/components/Login/Login.jsx`

## Steps

1. Open `src/components/Login/Login.jsx`

2. Add state for password visibility:
```jsx
const [showPassword, setShowPassword] = useState(false);
```

3. Add an eye icon import (using react-icons which is already installed):
```jsx
import { FaEye, FaEyeSlash } from "react-icons/fa";
```

4. Replace the password input field in the form:

```jsx
// Before:
<div className="form-control">
    <label className="label"><span className="label-text font-bold text-white">Password</span></label>
    <input type="password" placeholder="Password" className="input input-bordered"
        value={password} onChange={(e) => setPassword(e.target.value)} required />
</div>

// After:
<div className="form-control">
    <label className="label"><span className="label-text font-bold text-white">Password</span></label>
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
    </div>
</div>
```

## Verification
- Login form should have an eye icon inside the password field
- Clicking the eye toggles between visible/hidden password
- Icon changes between eye (show) and eye-slash (hide)
- Login functionality remains unchanged
