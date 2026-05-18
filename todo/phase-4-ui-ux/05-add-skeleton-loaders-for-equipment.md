# Add Skeleton Loaders for Equipment

## Goal
Replace the simple spinner with skeleton card placeholders that mimic the actual equipment card layout, providing a better perceived loading experience.

## Files to Touch
- `frontend/src/pages/Equipment/Shop.jsx`

## Steps

1. Open `frontend/src/pages/Equipment/Shop.jsx`

2. Replace the loading spinner with skeleton cards:

```jsx
// Before:
if (loading) {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <span className="loading loading-spinner loading-lg text-red-500"></span>
        </div>
    );
}

// After:
if (loading) {
    return (
        <div className='justify-center flex mx-36 py-10'>
            <div className='grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 w-[90%]'>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="card items-center bg-[#ffffff] shadow-[0_0_20px_rgba(0,0,0,0.2)] animate-pulse">
                        <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
                        <div className="card-body w-full bg-[#ffcece] rounded-md">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                            <div className="card-actions justify-end">
                                <div className="h-10 bg-gray-200 rounded w-28"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
```

This creates 6 skeleton cards that mimic the real card layout:
- Gray placeholder for the image
- Gray bars for title, description, price
- Gray placeholder for the "Add to cart" button
- Uses Tailwind's `animate-pulse` for the shimmer effect

## Verification
- On page load, 6 skeleton cards appear with pulsing animation
- Once data loads, skeletons are replaced with real equipment cards
- Layout of skeletons matches the real card layout
