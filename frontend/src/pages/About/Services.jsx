import { Link } from "react-router-dom";
import consult from "../../assets/servicesicons/consult.svg";
import rent from "../../assets/servicesicons/rent.svg";
import shop from "../../assets/servicesicons/shopping_bag.svg";
import repair from "../../assets/servicesicons/repair.svg";

const Services = () => {
    return (
        <>
            <main className="min-h-screen w-4/5 mx-auto">
                <div className="px-4 py-12">
                    <h1 className="text-4xl font-bold text-center text-base-content mb-6">Our Services</h1>
                    <p className="text-lg text-base-content/80 text-center mb-12">
                        At MediFlow, we offer a wide range of services to meet your medical equipment needs. Explore our
                        offerings below.
                    </p>

                    {/* Service Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-base-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="text-center">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="mx-auto mb-4 size-16 dark-invert"
                                    />
                                    <h2 className="text-xl font-semibold text-base-content mb-2">{service.title}</h2>
                                    <p className="text-base-content mb-4">{service.description}</p>
                                    {service.link ? (
                                        <Link
                                            to={service.link}
                                            className="text-red-500 hover:text-red-600 font-semibold"
                                        >
                                            Learn More →
                                        </Link>
                                    ) : (
                                        <span className="text-base-content/60 font-semibold cursor-not-allowed">
                                            Coming Soon
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <div className="bg-primary/10 py-12">
                <div className="w-4/5 mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-base-content mb-8">What Our Clients Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-base-100 p-6 rounded-lg shadow-md">
                                <p className="text-base-content/80 mb-4">&ldquo;{testimonial.text}&rdquo;</p>
                                <p className="text-base-content font-semibold">— {testimonial.author}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

const services = [
    {
        title: "Equipment Sales",
        description:
            "Browse our extensive catalog of high-quality medical equipment. From diagnostic tools to surgical instruments, we have it all.",
        image: shop,
        link: "/buy-equipment",
    },
    {
        title: "Equipment Rental",
        description:
            "Need equipment for a short period? Rent from our wide selection of medical devices at affordable rates.",
        image: rent,
        link: null,
    },
    {
        title: "Maintenance & Repair",
        description: "Keep your equipment in top condition with our expert maintenance and repair services.",
        image: repair,
        link: null,
    },
    {
        title: "Consulting",
        description: "Get expert advice on selecting, installing, and managing medical equipment for your facility.",
        image: consult,
        link: null,
    },
];

const testimonials = [
    {
        text: "MediFlow provided us with the best medical equipment for our hospital. Their service is top-notch!",
        author: "Dr. John Doe, City Hospital",
    },
    {
        text: "The rental process was seamless, and the equipment was delivered on time. Highly recommended!",
        author: "Jane Smith, Clinic Manager",
    },
];

export default Services;
