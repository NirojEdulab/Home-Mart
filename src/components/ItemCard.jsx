/* eslint-disable react/prop-types */
import { useState } from "react";
import { PlusIcon, MinusIcon, XIcon } from "lucide-react";  // Added XIcon for delete button

function ItemCard({ item, onAddItem, onDeleteItem }) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
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

      <img
        src={
          imageError
            ? "/images/noImage.png" // URL of the default placeholder image
            : `${getCompressedImageUrl(item.imageUrl)}`
        }
        alt={item.name}
        onError={handleImageError} // Trigger the handleImageError function on image error
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <h3 className="text-lg font-semibold text-center">{item.name}</h3>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mt-4 w-full">
        {/* Quantity controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecreaseQuantity}
            className="p-1 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <span className="text-black font-semibold">{quantity} {item.measureUnit}</span>
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
