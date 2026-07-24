import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { toast } from "sonner";
import bdt_icon2 from "../../assets/bdt_icon2.svg";

const EquipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [equip, setEquip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/equipment/${id}`)
            .then((res) => {
                setEquip(res.data);
                setLoading(false);
            })
            .catch(() => {
                toast.error("Equipment not found");
                navigate("/buy-equipment");
            });
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    if (!equip) return null;

    return (
        <div className="container mx-auto px-4 py-10">
            <button className="btn btn-ghost mb-6" onClick={() => navigate("/buy-equipment")}>
                &larr; Back to Shop
            </button>
            <div className="card lg:card-side bg-base-100 shadow-xl">
                <figure className="lg:w-1/2 flex items-center justify-center p-8">
                    <img src={equip.image_url} alt={equip.name} className="max-h-96 object-contain" />
                </figure>
                <div className="card-body lg:w-1/2">
                    <h1 className="text-3xl font-bold">{equip.name}</h1>
                    <p className="text-base-content/70 text-lg mt-2">{equip.description}</p>

                    <div className="flex items-center gap-2 mt-4">
                        <p className="text-2xl font-semibold flex items-center gap-1">
                            <img src={bdt_icon2} alt="bdt_icon" className="size-6 dark-invert" /> {equip.price}
                        </p>
                    </div>

                    <div className="mt-2">
                        {equip.quantity > 0 ? (
                            <span className="badge badge-success badge-lg">In Stock ({equip.quantity} available)</span>
                        ) : (
                            <span className="badge badge-error badge-lg">Out of Stock</span>
                        )}
                    </div>

                    <div className="card-actions mt-6">
                        <button
                            className="btn btn-error btn-lg flex-1"
                            disabled={equip.quantity <= 0}
                            onClick={() => addToCart(equip)}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetail;
