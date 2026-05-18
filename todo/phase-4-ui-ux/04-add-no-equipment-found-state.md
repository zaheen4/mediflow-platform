# Add No Equipment Found State

## Goal
When the equipment list is empty (no items in database or fetch returns empty array), show a friendly message instead of a blank grid.

## Files to Touch
- `frontend/src/pages/Equipment/Shop.jsx`
- `frontend/src/pages/Equipment/AdminDashboard.jsx`

## Steps

### 1. Update Shop.jsx

After the loading check and before the equipment grid:

```jsx
if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-red-500"></span>
        </div>
    );
}

if (equipment.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-xl text-gray-500 mb-4">No equipment available</p>
            <p className="text-gray-400">Check back later for new products.</p>
        </div>
    );
}
```

### 2. Update AdminDashboard.jsx

After the loading check and before the table:

```jsx
if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-red-500"></span>
        </div>
    );
}
```

Add an empty state inside the table body when equipment is empty (but still show the add row):

```jsx
<tbody>
    {equipment.length === 0 ? (
        <tr>
            <td colSpan="7" className="p-8 text-center text-gray-500">
                No equipment found. Add your first item below.
            </td>
        </tr>
    ) : (
        equipment.map((equip) => (
            // ... existing rows ...
        ))
    )}

    {/* Add Equipment Row (always shown) */}
    <tr className="border-b border-gray-300">
        {/* ... existing add row ... */}
    </tr>
</tbody>
```

## Verification
- Empty database on shop page → shows "No equipment available" with icon
- Empty database on admin page → shows "No equipment found" message in table, add row still visible
- With equipment → renders normally
