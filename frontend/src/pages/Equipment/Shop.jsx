import { useState, useEffect, useContext } from "react";
import axios from "axios";
import bdt_icon2 from "../../assets/bdt_icon2.svg";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { toast } from "sonner";

const Shop = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart, getTotalItems } = useContext(CartContext);
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/equipment`)
            .then((response) => {
                setEquipment(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("There was an error fetching the equipment data!", error);
                toast.error("Failed to load equipment. Please try again.");
                setLoading(false);
            });
    }, [API_BASE_URL]);

    if (loading) {
        return (
            <div className="justify-center flex mx-36 py-10">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 w-[90%]">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div
                            key={n}
                            className="card items-center bg-[#ffffff] shadow-[0_0_20px_rgba(0,0,0,0.2)] animate-pulse"
                        >
                            <div className="w-48 h-48 bg-gray-200 rounded-lg"></div>
                            <div className="card-body w-full bg-mediflow-pink rounded-md">
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

    if (equipment.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-24 w-24 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                </svg>
                <p className="text-xl text-gray-500 mb-4">No equipment available</p>
                <p className="text-gray-400">Check back later for new products.</p>
            </div>
        );
    }

    return (
        <div className="justify-center flex mx-36 py-10">
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 w-[90%]">
                {equipment.map((equip) => (
                    <div
                        key={equip.equipment_id}
                        className="card items-center bg-[#ffffff] shadow-[0_0_20px_rgba(0,0,0,0.2)]"
                    >
                        <figure className="w-48 h-48 flex items-center justify-center">
                            <img className="h-full py-2" src={equip.image_url} alt={equip.name} />
                        </figure>
                        <div className="card-body w-full bg-[#ffcece] rounded-md">
                            <h2 className="card-title">{equip.name}</h2>
                            <p>{equip.description}</p>
                            <p className="pt-4 text-[16px] flex items-center">
                                <img src={bdt_icon2} alt="bdt_icon" className="size-5" /> {equip.price}
                            </p>
                            <div className="card-actions justify-end">
                                <button
                                    className="btn btn-soft btn-error text-black hover:text-white"
                                    onClick={() => addToCart(equip)}
                                >
                                    Add to cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button
                className="fixed bottom-18 right-20 bg-red-500 text-white p-4 rounded-full shadow-lg flex items-center gap-2"
                onClick={() => navigate("/cart")}
            >
                <FaShoppingCart />
                Cart ({getTotalItems()})
            </button>
        </div>
    );
};

export default Shop;
