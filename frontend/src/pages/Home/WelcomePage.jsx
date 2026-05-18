import welcome_bg from "../../assets/pngtree—pink medical equipment banner background_968645.jpg"
const WelcomePage = () => {
   return (
      <div className="hero bg-base-300 ">
         <img src={welcome_bg} alt="" className="h-[720px] object-cover" />
         <section className=" hero-content flex mt-40 justify-center">
            <div className="text-center py-12 w-[65%] mx-auto rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.2)] bg-base-200 mb-40">
               {/* Inner Text Container */}
               <div className="w-[85%] mx-auto">
                  <h1 className="text-5xl font-bold text-gray-800 mb-5">Welcome to MediFlow</h1>
                  <p className="text-xl text-gray-800 mb-8">
                     Your trusted partner in medical equipment solutions. We provide high-quality, reliable, and
                     affordable medical devices to healthcare professionals and institutions worldwide.
                  </p>
                  <p className="text-xl text-gray-800 mb-8">
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