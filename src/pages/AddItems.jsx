/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import ItemCard from "@/components/ItemCard";
import { House, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import "../style/AddToCartStyle.css"; // Import CSS for animation
import toast from "react-hot-toast";

const serverURL = import.meta.env.VITE_SERVER_URL;

function AddItems({ addedItems, setAddedItems }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animateItemId, setAnimateItemId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${serverURL}/api/products`, {
          withCredentials: true,
        });
        setItems(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchSearchedItems = async () => {
      if (!searchTerm) {
        setLoading(true);
        try {
          const response = await axios.get(`${serverURL}/api/products`, {
            withCredentials: true,
          });
          setItems(response.data.data);
          return;
        } catch (error) {
          console.error("Error fetching searched products:", error);
        } finally {
          setLoading(false);
        }
      }

      setLoading(true);
      try {
        const response = await axios.get(`${serverURL}/api/searchProducts`, {
          params: { search: searchTerm },
          withCredentials: true,
        });
        setItems(response.data.data);
      } catch (error) {
        console.error("Error fetching searched products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSearchedItems();
  }, [searchTerm]);

  const handleAddItem = (item, quantity) => {
    setAddedItems((prev) => {
      const existingItem = prev.find((addedItem) => addedItem.id === item.id);
      if (existingItem) {
        return prev.map((addedItem) =>
          addedItem.id === item.id
            ? { ...addedItem, quantity: addedItem.quantity + quantity }
            : addedItem
        );
      } else {
        return [...prev, { ...item, quantity }];
      }
    });

    setAnimateItemId(item.id);
    setTimeout(() => setAnimateItemId(null), 500);
  };

  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`${serverURL}/api/product/${id}`, {
        withCredentials: true,
      });
      if (response.data.status === 200) {
        toast.success(response.data.message);
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-300">
      <main className="w-full">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-green-600">
          <div className="flex justify-between items-center gap-4 p-4">
            <Link to={"/"}>
              <House size={32} />
            </Link>
            <input
              type="text"
              placeholder="Search for items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md p-2 w-full text-sm"
            />
            <Link to={"/cart"}>
              <div className="relative">
                <ShoppingCart size={36} className="text-black" />
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {addedItems.reduce((total, item) => total + item.quantity, 0)}
                </span>
              </div>
            </Link>
          </div>
          {items.length > 0 && (
            <div className="bg-green-500 text-center py-2">
              <p className="text-white">Total Items: {items.length}</p>
            </div>
          )}
        </div>

        {/* Scrollable Item List */}
        {loading ? (
          <div className="flex justify-center items-center w-full mt-16">
            <div className="animate-spin w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full"></div>
          </div>
        ) : (
          <div className="p-2">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 h-[80vh] py-4 overflow-y-auto">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    key={item.id}
                    className={`${
                      animateItemId === item.id ? "animate-fly-to-cart" : ""
                    }`}
                  >
                    <ItemCard
                      item={item}
                      onAddItem={handleAddItem}
                      onDeleteItem={deleteProduct}
                      srNo={index + 1}
                    />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center">
                  <h2 className="text-lg font-semibold">No Items Found</h2>
                </div>
              )}
            </div>
            {items.length > 0 && (
              <Link to="/cart" className="col-span-full mt-4">
                <Button className="w-full text-sm">Go to cart</Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AddItems;
