import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import bdt_icon2 from "../../assets/bdt_icon2.svg";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { toast } from "sonner";

const Shop = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const { addToCart, getTotalItems } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEquipment = async () => {
            setLoading(true);
            try {
                const params = { page, limit: 12 };
                if (search) params.search = search;
                const res = await api.get("/equipment", { params });
                const body = res.data;
                if (Array.isArray(body)) {
                    setEquipment(body);
                    setTotalPages(1);
                } else {
                    setEquipment(body.data);
                    setTotalPages(body.totalPages);
                }
            } catch (error) {
                console.error("There was an error fetching the equipment data!", error);
                toast.error("Failed to load equipment. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [page, search]);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchInput("");
        setSearch(searchInput);
        setPage(1);
    };

    const handleClear = () => {
        setSearchInput("");
        setSearch("");
        setPage(1);
    };

    const skeleton = () => (
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

    if (loading && equipment.length === 0) {
        return skeleton();
    }

    return (
        <div className="justify-center flex mx-36 py-10">
            <div className="w-[90%]">
                <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                    <div className="join flex-1">
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search equipment..."
                            className="input input-bordered join-item w-full"
                        />
                        <button type="submit" className="btn btn-primary join-item">
                            <FaSearch />
                        </button>
                        {search && (
                            <button type="button" onClick={handleClear} className="btn btn-ghost join-item">
                                Clear
                            </button>
                        )}
                    </div>
                </form>

                {equipment.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[40vh]">
                        <FaSearch className="h-24 w-24 text-gray-300 mb-4" />
                        <p className="text-xl text-gray-500 mb-4">No equipment found</p>
                        <p className="text-gray-400">Try a different search term.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
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

                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    className="btn btn-sm"
                                    disabled={page <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        className={`btn btn-sm ${p === page ? "btn-primary" : "btn-ghost"}`}
                                        onClick={() => setPage(p)}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    className="btn btn-sm"
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                <button
                    className="fixed bottom-18 right-20 bg-red-500 text-white p-4 rounded-full shadow-lg flex items-center gap-2"
                    onClick={() => navigate("/cart")}
                >
                    <FaShoppingCart />
                    Cart ({getTotalItems()})
                </button>
            </div>
        </div>
    );
};

export default Shop;
