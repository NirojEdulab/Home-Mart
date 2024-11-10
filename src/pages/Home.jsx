// src/pages/Home.js
import { CirclePlus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center p-10 bg-gradient-to-r from-green-600 to-green-800 text-white">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
        Welcome to Home Grocery Management
      </h1>
      <p className="text-sm sm:text-lg mb-8">
        Organize your shopping and keep track of your groceries easily.
      </p>
      <div className="flex gap-6 flex-col sm:flex-row">
        <Link to="/create-item">
          <button className="bg-white text-green-600 font-bold p-2 sm:p-4 rounded-lg shadow-md transform hover:scale-105 transition ease-in-out duration-300">
            <span className="flex flex-col sm:flex-row justify-center items-center">
              <CirclePlus className="mr-2" />
              Add New Item
            </span>
          </button>
        </Link>
        <Link to="/add-items">
          <button className="bg-white text-green-600 font-bold p-2 sm:p-4 rounded-lg shadow-md transform hover:scale-105 transition ease-in-out duration-300">
            <span className="flex flex-col sm:flex-row justify-center items-center">
              <ShoppingCart className="mr-2" />
              Add Items to Cart
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
