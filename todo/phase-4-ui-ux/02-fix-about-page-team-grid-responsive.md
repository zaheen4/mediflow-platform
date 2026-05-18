# Fix About Page Team Grid Responsive

## Goal
The About page team section uses fixed `400px` image dimensions and a 2-column grid that doesn't adapt to smaller screens.

## Files to Touch
- `src/components/About/About.jsx`

## Current State
```jsx
<div className="mb-20 w-[60%] grid grid-cols-2 gap-4 bg-base-300 px-28 py-16 rounded-2xl">
    {[...].map((member, index) => (
        <div key={index} className={`...`} style={{ backgroundImage: `url(${member.image})`, backgroundSize: 'cover', width: '400px', height: '400px' }}>
```

## Steps

1. Open `src/components/About/About.jsx`

2. Replace the team section with:

```jsx
<div className="mb-20 w-[95%] md:w-[80%] lg:w-[60%] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 bg-base-300 px-4 sm:px-12 lg:px-28 py-8 sm:py-12 lg:py-16 rounded-2xl">
    {[
        { name: "", id: "", image: mediflowlogo },
        { name: "Mir Zaheen Waseet", id: "CS-2203104", image: zaheen },
        { name: "Muntasir Noor Tazim", id: "CS-2203100", image: tazim },
        { name: "Mohammed Arafath Rahman", id: "CS-2203079", image: arafath },
    ].map((member, index) => (
        <div key={index} className={`relative rounded-xl overflow-hidden student student_${index + 1}`} style={{ backgroundImage: `url(${member.image})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', aspectRatio: '1 / 1' }}>
            <div className='absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded'>
                <h4 className='text-lg font-bold'>{member.name}</h4>
                <p className='text-sm font-semibold'>{member.id}</p>
            </div>
        </div>
    ))}
</div>
```

Key changes:
- Container width: `w-[95%] md:w-[80%] lg:w-[60%]` — responsive
- Grid: `grid-cols-1 sm:grid-cols-2` — single column on mobile
- Padding: `px-4 sm:px-12 lg:px-28` — less padding on mobile
- Card sizing: `width: '100%', aspectRatio: '1 / 1'` — fills grid cell, stays square
- Added `overflow-hidden` and `backgroundPosition: 'center'` for better image display
- Text overlay: moved to bottom with semi-transparent background for readability

3. Also fix the top section's flex layout for mobile:

```jsx
<section className="flex flex-col lg:flex-row my-10 gap-6">
    <div className="section_title w-full lg:w-[60%]">
        <h6 className="zero_margin text-3xl md:text-4xl lg:text-5xl">
            MediFlow offers you the best medical equipment and treatment for your life.
        </h6>
    </div>
    <div className="little_style w-full lg:w-[45%] text-base md:text-lg">
        <h3>
            Our team has only one goal: to create an environment where medical equipment is within everyone's reach.
            "Every single one of us deserves access to quality, affordable health care."
        </h3>
    </div>
</section>
```

## Verification
- On mobile: team members stack vertically, text is readable, no horizontal scroll
- On tablet: 2-column grid appears
- On desktop: looks similar to before but with better spacing
- Top section stacks vertically on mobile, side-by-side on desktop
