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

  // Fetch all items initially
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true); // Set loading state before fetching
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

  // Fetch filtered items based on the search term
  useEffect(() => {
    const fetchSearchedItems = async () => {
      if (!searchTerm) {
        setLoading(true);
        // If searchTerm is cleared, fetch all items again
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

      setLoading(true); // Set loading state when searching
      try {
        const response = await axios.get(`${serverURL}/api/searchProducts`, {
          params: { search: searchTerm },
          withCredentials: true,
        });
        setItems(response.data.data);
      } catch (error) {
        console.error("Error fetching searched products:", error);
      } finally {
        setLoading(false); // Reset loading state after fetching
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
    console.log("deleteProduct ==>> ", id);
    setLoading(true);
    try {
      const response = await axios.delete(`${serverURL}/api/product/${id}`, {
        withCredentials: true,
      });
      console.log(response)
      if(response.data.status === 200){
        toast.success(response.data.message);
        try {
          const response = await axios.get(`${serverURL}/api/products`, {
            withCredentials: true,
          });
          setItems(response.data.data);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error fetching searched products:", error);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Error fetching searched products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen">
      <main className="w-full p-6 bg-gray-300">
        <div className="flex justify-between items-center gap-4 bg-green-300 p-4">
          <Link to={"/"}>
            <House size={36} />
          </Link>
          <input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
          <Link to={"/cart"}>
            <div className="relative">
              <ShoppingCart size={36} className="text-black" />
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-lg rounded-full flex items-center justify-center">
                {addedItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center w-full mt-32">
            <div className="animate-spin w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
            {items.length > 0 ? (
              items.map((item) => (
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
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center">
                <h2 className="text-xl font-semibold">No Items Found</h2>
              </div>
            )}
            {items.length > 0 && (
              <Link to="/cart" className="col-span-full mt-4">
                <Button className="w-full">Go to cart</Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AddItems;
