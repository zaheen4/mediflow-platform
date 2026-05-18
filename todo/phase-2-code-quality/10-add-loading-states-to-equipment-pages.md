# Add Loading States to Equipment Pages

## Goal
Add loading spinners to `Shop.jsx` and `AdminDashboard.jsx` while equipment data is being fetched from the backend.

## Files to Touch
- `frontend/src/pages/Equipment/Shop.jsx`
- `frontend/src/pages/Equipment/AdminDashboard.jsx`

## Steps

### 1. Update Shop.jsx

Add a loading state:

```jsx
const [loading, setLoading] = useState(true);

useEffect(() => {
    axios.get(`${API_BASE_URL}/equipment`)
        .then(response => {
            setEquipment(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error fetching the equipment data!', error);
            setLoading(false);
        });
}, []);
```

Add a loading UI before the equipment grid:

```jsx
if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-red-500"></span>
        </div>
    );
}
```

Place this check right after the `useEffect` and before the `return` statement that renders the equipment grid.

### 2. Update AdminDashboard.jsx

Add a loading state:

```jsx
const [loading, setLoading] = useState(true);

const fetchEquipment = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/equipment`);
        setEquipment(response.data);
    } catch (error) {
        console.error("Error fetching equipment:", error);
    } finally {
        setLoading(false);
    }
};
```

Add a loading UI:

```jsx
if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-red-500"></span>
        </div>
    );
}
```

Place this check before the main `return` statement.

## Verification
- On page load, a spinner should appear while data fetches
- Once data loads, the spinner disappears and content appears
- On error, the spinner still disappears (so user isn't stuck)
- Uses DaisyUI's built-in spinner component (`loading loading-spinner`)
