import welcome_bg from "../../assets/pngtree—pink medical equipment banner background_968645.jpg";

const WelcomePage = () => {
    return (
        <div className="hero bg-base-300 relative">
            <img src={welcome_bg} alt="" className="w-full h-[400px] md:h-[600px] lg:h-[720px] object-cover" />
            <section className="hero-content flex flex-col items-center absolute bottom-0 md:bottom-20 justify-center w-full">
                <div className="text-center py-8 md:py-12 w-[90%] md:w-[75%] lg:w-[65%] mx-auto rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.2)] bg-base-200/95 mb-6 md:mb-20 lg:mb-40">
                    <div className="w-[90%] mx-auto">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 md:mb-5">
                            Welcome to MediFlow
                        </h1>
                        <p className="text-base md:text-lg lg:text-xl text-gray-800 mb-4 md:mb-8">
                            Your trusted partner in medical equipment solutions. We provide high-quality, reliable, and
                            affordable medical devices to healthcare professionals and institutions worldwide.
                        </p>
                        <p className="text-base md:text-lg lg:text-xl text-gray-800 mb-4 md:mb-8">
                            Whether you&apos;re looking to equip your clinic, hospital, or research facility, MediFlow
                            offers a wide range of products tailored to meet your needs. Explore our catalog and
                            discover the tools that empower modern healthcare.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WelcomePage;
