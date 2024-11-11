/* eslint-disable react/prop-types */
import { useState } from "react";
import { PlusIcon, MinusIcon, Trash2, CirclePlus } from "lucide-react";

function ItemCard({ item, onAddItem, onDeleteItem, srNo }) {
  const [quantity, setQuantity] = useState(1);

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => parseFloat((prev + 0.1).toFixed(2)));
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => parseFloat((Math.max(0.1, prev - 0.1)).toFixed(2)));
  };

  const handleAddClick = () => {
    onAddItem(item, quantity);
  };

  return (
    <div className="p-3 bg-gray-100 shadow rounded-lg flex flex-col gap-2 relative">
      {/* Delete button */}
      <button
        onClick={() => onDeleteItem(item.id)}
        className="absolute top-1 right-1 text-red-600 hover:text-red-800"
      >
        <Trash2 className="w-6 h-6" />
      </button>

      <span className="absolute top-1 left-1 text-sm font-medium text-orange-600 bg-gray-200 rounded-full p-1">
        {srNo}
      </span>

      {/* Item details */}
      <div className="flex flex-col items-center text-center">
        <h3 className="text-md font-semibold">{item.name}</h3>
        <span className="text-sm font-medium text-orange-600 bg-gray-200 rounded-full px-2 py-1">
          {item.category}
        </span>
      </div>

      {/* Quantity controls and Add button */}
      <div className="flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center space-x-1">
          <button
            onClick={handleDecreaseQuantity}
            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <MinusIcon className="w-4 h-4" />
          </button>
          <input
            type="number"
            step="0.1"
            value={quantity}
            onChange={(e) => setQuantity(parseFloat(e.target.value))}
            className="text-center w-14 border border-gray-300 rounded-md p-1"
          />
          <button
            onClick={handleIncreaseQuantity}
            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            <PlusIcon className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
        >
          <CirclePlus />
        </button>
      </div>
    </div>
  );
}

export default ItemCard;
