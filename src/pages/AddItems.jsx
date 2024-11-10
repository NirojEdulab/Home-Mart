/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import SearchItem from "@/components/SearchItem";
import ItemCard from "@/components/ItemCard";
import { House, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
const serverURL = import.meta.env.VITE_SERVER_URL;

function AddItems({ addedItems, setAddedItems }) {
  // const items = [
  //   {
  //     id: 1,
  //     name: "Potato",
  //     description: "Fresh potatoes",
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     id: 2,
  //     name: "Tomato",
  //     description: "Fresh tomatoes",
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  //   {
  //     id: 3,
  //     name: "Cucumber",
  //     description: "Fresh cucumbers",
  //     imageUrl:
  //       "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   },
  // ];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
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
  };

  return (
    <div className="flex w-full min-h-screen">
      <main className="w-full p-6 bg-gray-300">
        <div className="flex justify-between items-center gap-4 bg-green-300 p-4">
          <Link to={'/'}>
          <House size={36} />
          </Link>
          <SearchItem />
          <Link to={"/cart"}>
            <div className="relative">
              <ShoppingCart size={36} className=" text-black" />
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-lg rounded-full flex items-center justify-center">
                {addedItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
          </Link>
        </div>

        {/* Show loading state or products grid */}
        {loading ? (
          <div className="flex justify-center items-center w-full min-h-screen">
            <div className="animate-spin w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full"></div>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-6">
            {items.length > 0 ? (
              items.map((item) => (
                <ItemCard key={item.id} item={item} onAddItem={handleAddItem} />
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
