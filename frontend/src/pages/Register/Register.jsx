// src/components/Register.jsx
import login_image2 from "../../assets/luke-chesser-CxBx_J3yp9g-unsplash.jpg"
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";

const Register = () => {
   const [formData, setFormData] = useState({
      username: "",
      password: "",
      role: "User",  // Default role
      email: "",
   });

   const [errorMessage, setErrorMessage] = useState("");
   const [successMessage, setSuccessMessage] = useState("");
   const navigate = useNavigate();


   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;  // centralized backend link
   // console.log(API_BASE_URL);


   const handleChange = (e) => {
      setFormData({
         ...formData,
         [e.target.name]: e.target.value,
      });
   };

   const handleSubmit = async (e) => {

      e.preventDefault();
      setErrorMessage(""); // Clear previous errors
      setSuccessMessage(""); // Clear previous success message

      try {
         const response = await axios.post(`${API_BASE_URL}/register`, formData, {
            headers: {
               "Content-Type": "application/json",
            },
         });

         setSuccessMessage(response.data.message);
         setFormData({
            username: "",
            password: "",
            role: "User",
            email: "",
         });

         // toast.success("Registration Successful!");

         toast.success('Registration Successful!', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            // transition: Bounce,
         });


         setTimeout(() => {
            navigate("/login");
         }, 2000);

      } catch (error) {
         if (error.response) {
            setErrorMessage(error.response.data.error || "Registration failed!");
            console.log(error);
         } else {
            setErrorMessage("An error occurred!");
         }
      }


   };

   return (
      <div className="hero min-h-screen items-center">
         <img  src={login_image2} alt="" className="h-[860px] w-[100%] "/>
         
         <div className="max-w-sm w-full p-8 text-white shadow-[0_0_60px_rgba(0,0,0,0.3)] rounded-lg">
            <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
            {errorMessage && (
               <div className="text-yellow-400 text-center mb-4">{errorMessage}</div>
            )}
            {successMessage && (
               <div className="text-green-400 text-center mb-4">{successMessage}</div>
            )}
            <form onSubmit={handleSubmit}>
               <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-semibold text-white ">Username</label>
                  <input
                     type="text"
                     id="username"
                     name="username"
                     value={formData.username}
                     onChange={handleChange}
                     required
                     className="w-full mt-2 p-2 border-none rounded-md text-black bg-white"
                  />
               </div>
               <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-semibold text-white">Email</label>
                  <input
                     type="email"
                     id="email"
                     name="email"
                     value={formData.email}
                     onChange={handleChange}
                     required
                     className="w-full mt-2 p-2 border-none rounded-md text-black bg-white"
                  />
               </div>
               <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-semibold text-white">Password</label>
                  <input
                     type="password"
                     id="password"
                     name="password"
                     value={formData.password}
                     onChange={handleChange}
                     required
                     className="w-full mt-2 p-2 border-none rounded-md text-black bg-white"
                  />
               </div>
               <div className="mb-4">
                  <label htmlFor="role" className="block text-sm font-semibold text-white">Role</label>
                  <select
                     id="role"
                     name="role"
                     value={formData.role}
                     onChange={handleChange}
                     required
                     className="w-full mt-2 p-2 border-none rounded-md text-black bg-white"
                  >
                     <option value="User">User</option>
                     <option value="Admin">Admin</option>
                  </select>
               </div>
               <div className="flex justify-center">
                  <button
                     type="submit"
                     className="w-full bg-[#fc432d] text-white p-2 rounded-md hover:bg-[#e5004b] shadow-"
                  >
                     Register
                  </button>
               </div>
            </form>
         </div>
         <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            // transition={Bounce}
         />
      </div>
   );
};

export default Register;
