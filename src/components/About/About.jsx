import React from "react";


import zaheen from "../../assets/images/zaheen.jpg";
import sahil from "../../assets/images/sahil2.jpeg";
import arafath from "../../assets/images/arafath.jpg";
import fatin from "../../assets/images/fatin2.jpeg";
import healthtech from "../../assets/images/healthtech.jpg";
import tazim from "../../assets/images/tazim.jpg";
import mediflowlogo from "../../assets/images/mediflow.jpg";

const About = () => {
   return (
      <div className="inter_font">

         <div className="w-[70%] mx-auto p-10 ">
            <section className="flex my-10">
               <div className="section_title w-[60%]">
                  <h6 className=" zero_margin text-5xl">
                     MediFlow offers you the best medical equipment and treatment for your life.
                  </h6>
               </div>
               <div className="little_style pt-18 w-[45%] text-lg">
                  <h3>
                     Our team has only one goal: to create an environment where medical equipment is within everyone’s reach.
                     "Every single one of us deserves access to quality, affordable health care."
                  </h3>
               </div>
            </section>

            <section>
               <div>
                  <img src={healthtech} alt="Healthtech" width="100%" />
               </div>
            </section>
         </div>

         <section className="team_container">

            <div className="text-center my-8">
               <h2 className="section_title text-4xl pb-2">Meet Our Team</h2>
               <p className="section_description text-xl">
                  We believe medical equipment should be accessible to everyone, everywhere, regardless of income and class.
               </p>
            </div>
            <div className="mx-auto flex justify-center items-center">
               {/* <div className="team_content">
               </div> */}

               <div className="mb-20 w-[60%] grid grid-cols-2 gap-4 bg-base-300 px-28 py-16 rounded-2xl">
                  {[
                     { name: "", id: "", image: mediflowlogo },
                     { name: "Mir Zaheen Waseet", id: "CS-2203104", image: zaheen },
                     { name: "Muntasir Noor Tazim", id: "CS-2203100", image: tazim },
                     { name: "Mohammed Arafath Rahman", id: "CS-2203079", image: arafath },
                  ].map((member, index) => (
                     <div key={index} className={`relative rounded-xl student student_${index + 1}`} style={{ backgroundImage: `url(${member.image})`, backgroundSize: 'cover', width: '400px', height: '400px' }}>
                        <div className='absolute top-85 left-2 text-white '>
                           <h4 className='text-lg font-bold'>{member.name}</h4>
                           <p className=' font-semibold'>{member.id}</p>
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
