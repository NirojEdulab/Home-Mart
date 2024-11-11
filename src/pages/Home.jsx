// src/pages/Home.js
import { CirclePlus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-center p-8 md:p-10 bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white">
      <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 animate-fadeIn">
        Welcome to Home Grocery Management
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 max-w-md md:max-w-lg animate-fadeIn delay-150">
        Organize your shopping and keep track of your groceries with ease.
      </p>
      <div className="flex gap-4 sm:gap-6 flex-col sm:flex-row animate-fadeIn delay-300">
        <Link to="/create-item">
          <button className="bg-white text-green-600 font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl duration-300">
            <span className="flex items-center justify-center space-x-2">
              <CirclePlus className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Add New Item</span>
            </span>
          </button>
        </Link>
        <Link to="/add-items">
          <button className="bg-white text-green-600 font-bold px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-lg transition transform hover:scale-105 hover:shadow-xl duration-300">
            <span className="flex items-center justify-center space-x-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Add Items to Cart</span>
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
