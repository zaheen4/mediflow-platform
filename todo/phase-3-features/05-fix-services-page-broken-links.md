# Fix Services Page Broken Links

## Goal
The Services page has 4 service cards, all linking to `/pages/dummypage.html` which doesn't exist. Fix these links to either point to valid routes or remove them.

## Files to Touch
- `src/components/About/Services.jsx`

## Current State
```js
const services = [
    { title: "Equipment Sales", link: "/pages/dummypage.html", ... },
    { title: "Equipment Rental", link: "/pages/dummypage.html", ... },
    { title: "Maintenance & Repair", link: "/pages/dummypage.html", ... },
    { title: "Consulting", link: "/pages/dummypage.html", ... },
];
```

## Steps

1. Open `src/components/About/Services.jsx`

2. Update the `services` array. Replace the `link` property with `action` — some will point to real routes, others will be non-functional placeholders:

```js
const services = [
    {
        title: "Equipment Sales",
        description: "Browse our extensive catalog of high-quality medical equipment. From diagnostic tools to surgical instruments, we have it all.",
        image: shop,
        link: "/buy-equipment",
        isInternal: true,
    },
    {
        title: "Equipment Rental",
        description: "Need equipment for a short period? Rent from our wide selection of medical devices at affordable rates.",
        image: rent,
        link: null, // Coming soon
    },
    {
        title: "Maintenance & Repair",
        description: "Keep your equipment in top condition with our expert maintenance and repair services.",
        image: repair,
        link: null, // Coming soon
    },
    {
        title: "Consulting",
        description: "Get expert advice on selecting, installing, and managing medical equipment for your facility.",
        image: consult,
        link: null, // Coming soon
    },
];
```

3. Update the card rendering to handle null links and use `Link` for internal routes:

```jsx
import { Link } from "react-router-dom";

// Replace the <a href={service.link}> line in the card with:
{service.link ? (
    service.isInternal ? (
        <Link to={service.link} className="text-red-500 hover:text-red-600 font-semibold">
            Learn More →
        </Link>
    ) : (
        <a href={service.link} className="text-red-500 hover:text-red-600 font-semibold">
            Learn More →
        </a>
    )
) : (
    <span className="text-gray-400 font-semibold cursor-not-allowed">Coming Soon</span>
)}
```

## Verification
- "Equipment Sales" card → links to `/buy-equipment` (Shop page)
- Other 3 cards → show "Coming Soon" in gray, non-clickable
- No broken links or 404s from the Services page
