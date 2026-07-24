import zaheen from "../../assets/images/zaheen.jpg";
import arafath from "../../assets/images/arafath.jpg";
import healthtech from "../../assets/images/healthtech.jpg";
import tazim from "../../assets/images/tazim.jpg";
import mediflowlogo from "../../assets/images/mediflow.jpg";

const About = () => {
    return (
        <div>
            <div className="w-[95%] md:w-[80%] lg:w-[70%] mx-auto p-6 md:p-10">
                <section className="flex flex-col lg:flex-row my-10 gap-6">
                    <div className="w-full lg:w-[60%]">
                        <h6 className="text-3xl md:text-4xl lg:text-5xl">
                            MediFlow offers you the best medical equipment and treatment for your life.
                        </h6>
                    </div>
                    <div className="w-full lg:w-[45%] text-base md:text-lg">
                        <h3>
                            Our team has only one goal: to create an environment where medical equipment is within
                            everyone&apos;s reach. &ldquo;Every single one of us deserves access to quality, affordable
                            health care.&rdquo;
                        </h3>
                    </div>
                </section>

                <section>
                    <div>
                        <img src={healthtech} alt="Healthtech" className="w-full object-cover" />
                    </div>
                </section>
            </div>

            <section>
                <div className="text-center my-8">
                    <h2 className="text-4xl pb-2">Meet Our Team</h2>
                    <p className="text-xl">
                        We believe medical equipment should be accessible to everyone, everywhere, regardless of income
                        and class.
                    </p>
                </div>
                <div className="mx-auto flex justify-center items-center">
                    <div className="mb-20 w-[95%] md:w-[80%] lg:w-[60%] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 bg-base-300 px-4 sm:px-12 lg:px-28 py-8 sm:py-12 lg:py-16 rounded-2xl">
                        {[
                            { name: "", id: "", image: mediflowlogo },
                            { name: "Mir Zaheen Waseet", id: "CS-2203104", image: zaheen },
                            { name: "Muntasir Noor Tazim", id: "CS-2203100", image: tazim },
                            { name: "Mohammed Arafath Rahman", id: "CS-2203079", image: arafath },
                        ].map((member, index) => (
                            <div
                                key={index}
                                className="relative rounded-xl overflow-hidden"
                                style={{
                                    backgroundImage: `url(${member.image})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    width: "100%",
                                    aspectRatio: "1 / 1",
                                }}
                            >
                                <div className="absolute bottom-4 left-4 text-white bg-black/50 px-3 py-1 rounded">
                                    <h4 className="text-lg font-bold">{member.name}</h4>
                                    <p className="text-sm font-semibold">{member.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
