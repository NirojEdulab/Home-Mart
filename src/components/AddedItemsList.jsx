/* eslint-disable react/prop-types */
function AddedItemsList({ items }) {
  return (
    <>
      <div className="bg-gray-50 rounded-lg p-4 shadow-inner border border-gray-200 max-h-screen overflow-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Added Items
        </h2>
        <ul className="space-y-2">
          {items.length > 0 &&
            items.map((item, index) => (
              <li key={index} className="flex justify-between border-b pb-2">
                <span>
                  {item.name} (x{item.quantity})
                </span>
                <span className="font-semibold text-gray-600">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </li>
            ))}
        </ul>
      </div>
      <div className="p-4">
        {items.length === 0 && (
          <div className="text-center text-red-500 font-semibold">
            <h3>Current you dont have any items on your cart!</h3>
          </div>
        )}
      </div>
    </>
  );
}

export default AddedItemsList;
