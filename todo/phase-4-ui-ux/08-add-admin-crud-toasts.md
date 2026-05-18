# Add Admin CRUD Toasts

## Goal
Add success toast notifications for admin equipment operations (add, edit, delete).

## Files to Touch
- `src/components/Equipment/AdminPage.jsx`

## Steps

1. Open `src/components/Equipment/AdminPage.jsx`

2. Ensure toast imports are present (from a previous task):
```jsx
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
```

3. Update `handleDelete` to show a success toast:

```jsx
const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;

    try {
        await axios.delete(`${API_BASE_URL}/delete-equipment/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchEquipment();
        toast.success("Equipment deleted successfully", {
            position: "top-center",
            autoClose: 2000,
            theme: "light",
        });
    } catch (error) {
        console.error("Error deleting equipment:", error);
        toast.error("Failed to delete equipment", {
            position: "top-center",
            autoClose: 3000,
            theme: "light",
        });
    }
};
```

4. Update `handleSaveEdit`:

```jsx
const handleSaveEdit = async () => {
    try {
        await axios.put(
            `${API_BASE_URL}/modify-equipment/${editing.equipment_id}`,
            editing,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditing(null);
        fetchEquipment();
        toast.success("Equipment updated successfully", {
            position: "top-center",
            autoClose: 2000,
            theme: "light",
        });
    } catch (error) {
        console.error("Error updating equipment:", error);
        toast.error("Failed to update equipment", {
            position: "top-center",
            autoClose: 3000,
            theme: "light",
        });
    }
};
```

5. Update `handleAddEquipment`:

```jsx
const handleAddEquipment = async () => {
    try {
        await axios.post(`${API_BASE_URL}/add-equipment`, newEquipment, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setNewEquipment({ name: "", description: "", price: "", quantity: "", image_url: "" });
        fetchEquipment();
        toast.success("Equipment added successfully", {
            position: "top-center",
            autoClose: 2000,
            theme: "light",
        });
    } catch (error) {
        console.error("Error adding equipment:", error);
        toast.error("Failed to add equipment", {
            position: "top-center",
            autoClose: 3000,
            theme: "light",
        });
    }
};
```

## Verification
- Add equipment → green success toast
- Edit equipment → green success toast
- Delete equipment → green success toast (after confirmation dialog)
- Any failed operation → red error toast
- All toasts auto-dismiss (2s for success, 3s for error)
