# Add User-Facing Error Toasts

## Goal
Replace `console.error` calls with user-facing toast notifications so users know when something goes wrong instead of silently failing.

## Files to Touch
- `frontend/src/pages/Equipment/Shop.jsx`
- `frontend/src/pages/Equipment/AdminDashboard.jsx`

## Steps

### 1. Update Shop.jsx

Add toast import and notification on fetch error:

```jsx
import { toast } from "react-toastify";

// In the useEffect catch block:
.catch(error => {
    console.error('There was an error fetching the equipment data!', error);
    toast.error("Failed to load equipment. Please try again.");
    setLoading(false);
});
```

Ensure `<ToastContainer>` is rendered in the component's JSX (add it at the bottom of the return if not present):
```jsx
import { ToastContainer } from "react-toastify";

// At the end of the return JSX, before the closing </div>:
<ToastContainer position="top-center" autoClose={3000} theme="light" />
```

### 2. Update AdminDashboard.jsx

Add toast import and notifications for each operation:

```jsx
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
```

Update error handlers:

```jsx
// fetchEquipment catch:
catch (error) {
    console.error("Error fetching equipment:", error);
    toast.error("Failed to load equipment data.");
} finally {
    setLoading(false);
}

// handleDelete catch:
catch (error) {
    console.error("Error deleting equipment:", error);
    toast.error("Failed to delete equipment.");
}

// handleSaveEdit catch:
catch (error) {
    console.error("Error updating equipment:", error);
    toast.error("Failed to update equipment.");
}

// handleAddEquipment catch:
catch (error) {
    console.error("Error adding equipment:", error);
    toast.error("Failed to add equipment.");
}
```

Add success toasts for successful operations:

```jsx
// handleDelete success (after fetchEquipment()):
toast.success("Equipment deleted successfully.");

// handleSaveEdit success:
setEditing(null);
fetchEquipment();
toast.success("Equipment updated successfully.");

// handleAddEquipment success:
setNewEquipment({ name: "", description: "", price: "", quantity: "", image_url: "" });
fetchEquipment();
toast.success("Equipment added successfully.");
```

Add `<ToastContainer>` at the bottom of the return JSX:
```jsx
<ToastContainer position="top-center" autoClose={3000} theme="light" />
```

## Verification
- Failed equipment fetch → shows error toast
- Failed delete/update/add → shows error toast
- Successful delete/update/add → shows success toast
- Toasts auto-dismiss after 3 seconds
