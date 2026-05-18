# Fix WelcomePage Responsive Breakage

## Goal
The WelcomePage uses fixed heights (`h-[720px]`) and large margins (`mt-40`, `mb-40`) that break on mobile screens. Make it responsive.

## Files to Touch
- `src/components/Home/WelcomePage.jsx`

## Current State
```jsx
<img src={welcome_bg} alt="" className="h-[720px] object-cover" />
<section className=" hero-content flex mt-40 justify-center">
    <div className="text-center py-12 w-[65%] mx-auto rounded-3xl ... mb-40">
```

## Steps

1. Open `src/components/Home/WelcomePage.jsx`

2. Replace the entire component with:

```jsx
import welcome_bg from "../../assets/pngtree—pink medical equipment banner background_968645.jpg"

const WelcomePage = () => {
    return (
        <div className="hero bg-base-300 relative">
            <img src={welcome_bg} alt="" className="w-full h-[400px] md:h-[600px] lg:h-[720px] object-cover" />
            <section className="hero-content flex flex-col items-center absolute bottom-0 md:bottom-20 lg:mt-40 justify-center w-full">
                <div className="text-center py-8 md:py-12 w-[90%] md:w-[75%] lg:w-[65%] mx-auto rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.2)] bg-base-200/95 mb-6 md:mb-20 lg:mb-40">
                    <div className="w-[90%] mx-auto">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-5">Welcome to MediFlow</h1>
                        <p className="text-base md:text-lg lg:text-xl text-gray-800 mb-4 md:mb-8">
                            Your trusted partner in medical equipment solutions. We provide high-quality, reliable, and
                            affordable medical devices to healthcare professionals and institutions worldwide.
                        </p>
                        <p className="text-base md:text-lg lg:text-xl text-gray-800 mb-4 md:mb-8">
                            Whether you&apos;re looking to equip your clinic, hospital, or research facility, MediFlow offers a
                            wide range of products tailored to meet your needs. Explore our catalog and discover the tools
                            that empower modern healthcare.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WelcomePage;
```

Key changes:
- Image height: `h-[400px] md:h-[600px] lg:h-[720px]` — scales with screen size
- Content width: `w-[90%] md:w-[75%] lg:w-[65%]` — wider on mobile
- Font sizes: `text-3xl md:text-4xl lg:text-5xl` — smaller on mobile
- Margins reduced on mobile: `mb-6 md:mb-20 lg:mb-40`
- Added `bg-base-200/95` for slight transparency so text is readable over the image
- Used `absolute bottom-0` positioning for the content card on mobile

## Verification
- On mobile (<768px): image is 400px tall, text is readable, card doesn't overflow
- On tablet (768px-1024px): image is 600px tall, card is 75% width
- On desktop (>1024px): looks the same as before
