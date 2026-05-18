# Add Password Visibility Toggle to Register

## Goal
Add a show/hide password toggle button to the registration form.

## Files to Touch
- `src/components/Register/Register.jsx`

## Steps

1. Open `src/components/Register/Register.jsx`

2. Add state for password visibility:
```jsx
const [showPassword, setShowPassword] = useState(false);
```

3. Add icon import:
```jsx
import { FaEye, FaEyeSlash } from "react-icons/fa";
```

4. Replace the password input field in the form:

```jsx
// Before:
<div className="mb-4">
    <label htmlFor="password" className="block text-sm font-semibold text-white">Password</label>
    <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full mt-2 p-2 border-none rounded-md text-black bg-white"
    />
</div>

// After:
<div className="mb-4">
    <label htmlFor="password" className="block text-sm font-semibold text-white">Password</label>
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 mt-2"
            onClick={() => setShowPassword(!showPassword)}
        >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
    </div>
</div>
```

## Verification
- Register form should have an eye icon inside the password field
- Clicking toggles password visibility
- Registration functionality remains unchanged
