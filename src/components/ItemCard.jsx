/* eslint-disable react/prop-types */
import { useState } from "react";
import { PlusIcon, MinusIcon, XIcon } from "lucide-react";  // Added XIcon for delete button

function ItemCard({ item, onAddItem, onDeleteItem }) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  // Handle increase/decrease of quantity by fractional values (e.g. 0.1)
  const handleIncreaseQuantity = () => {
    setQuantity((prev) => parseFloat((prev + 0.1).toFixed(2))); // Increase by 0.1
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => parseFloat((Math.max(0.1, prev - 0.1)).toFixed(2))); // Decrease by 0.1 but never go below 0.1
  };

  const handleAddClick = () => {
    onAddItem(item, quantity);
  };

  const handleImageError = () => {
    setImageError(true); // Set the imageError state to true if the image fails to load
  };

  const getCompressedImageUrl = (imageUrl) => {
    const baseUrl = imageUrl?.split("upload/")[0];
    const imagePath = imageUrl?.split("upload/")[1];
    return `${baseUrl}upload/w_500,f_auto/${imagePath}`;
  };

  return (
    <div className="p-4 bg-white shadow-md flex flex-col items-center rounded-lg relative">
      {/* Delete button */}
      <button
        onClick={() => onDeleteItem(item.id)}
        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
      >
        <XIcon className="w-6 h-6" />
      </button>

      {/* Image and Category Tag */}
      <div className="w-full flex flex-col items-center mb-2">
        <img
          src={imageError ? "/images/noImage.png" : getCompressedImageUrl(item.imageUrl)}
          alt={item.name}
          onError={handleImageError} // Trigger the handleImageError function on image error
          className="w-full h-32 object-cover rounded-md mb-2"
        />
        {/* Category Tag */}
        <span className="text-sm font-medium text-orange-600 bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
      </div>

      <h3 className="text-lg font-semibold text-center">{item.name} ({item.measureUnit})</h3>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-4 w-full">
        {/* Quantity controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecreaseQuantity}
            className="p-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <input
            type="number"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
            className="text-black font-semibold w-20 text-center border border-gray-300 rounded-md p-2"
          />
          
          <button
            onClick={handleIncreaseQuantity}
            className="p-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 rounded-md"
        >
          Add
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
