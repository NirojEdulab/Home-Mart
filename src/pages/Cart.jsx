/* eslint-disable react/prop-types */
import {
  CalendarIcon,
  CircleArrowLeft,
  Minus,
  Plus,
  Trash,
} from "lucide-react";
import { jsPDF } from "jspdf";
import { Link } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

function Cart({ addedItems, setAddedItems }) {
  // Add state for month selection
  const [date, setDate] = useState(Date.now());
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState({}); // State to track image loading errors

  // Handle increase and decrease of item quantity
  const handleIncreaseQuantity = (itemId) => {
    setAddedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecreaseQuantity = (itemId) => {
    setAddedItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Handle removing an item from the cart
  const handleRemoveItem = (itemId) => {
    setAddedItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const handleSelectDate = (newDate) => {
    setDate(newDate);
    setIsOpen(false);
  };

  // Generate PDF of the cart
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("Helvetica", "normal");

    const formattedDate = format(new Date(date), "dd-MM-yyyy");
  
    // Add Title
    doc.setFontSize(20);
    doc.text(`Groceries (${formattedDate})`, 20, 20);
  
    // Add Table Headings (Sr. No, Name, Quantity)
    doc.setFontSize(12);
    doc.text("Sr. No", 20, 40);
    doc.text("Name", 50, 40);  // Adjusting position for "Name"
    doc.text("Quantity", 100, 40);  // Adjusting position for "Quantity"
    doc.text("Price", 150, 40);  // Adjusting position for "Quantity"
  
    // Draw a line under the headings
    doc.line(20, 42, doc.internal.pageSize.width - 20, 42);
  
    // Add Cart Items
    doc.setFontSize(12);
    let yPosition = 50;  // Adjusting starting position for items
    addedItems.forEach((item, index) => {
      // Format item details with Sr. No, Name, and Quantity
      doc.text(`${index + 1}.`, 20, yPosition); // Sr. No
      doc.text(item.name, 50, yPosition); // Name
      doc.text(`${item.quantity} ${item.measureUnit}`, 100, yPosition); // Quantity with unit
      yPosition += 10;  // Move to next line
    });
  
    // Add a separator that covers the entire width of the page
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20; // Margin from the left
    doc.line(margin, yPosition, pageWidth - margin, yPosition); // Draw horizontal line
    yPosition += 10; // Move the position after the separator
  
    // Save the PDF
    doc.save(`groceries_list_${format(new Date(date), "dMMMyyyy")}.pdf`);
  };

  // Handle image loading error
  const handleImageError = (itemId) => {
    setImageError((prev) => ({
      ...prev,
      [itemId]: true, // Mark the item as having a broken image
    }));
  };

  const getCompressedImageUrl = (imageUrl) => {
    const baseUrl = imageUrl?.split("upload/")[0];
    const imagePath = imageUrl?.split("upload/")[1];
    return `${baseUrl}upload/w_500,f_auto/${imagePath}`;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center gap-2 p-3 mb-4 bg-green-500 rounded-md">
        <h2 className="text-2xl font-semibold">Shopping Cart</h2>
        <Link to={"/add-items"}>
          <CircleArrowLeft size={32} />
        </Link>
      </div>

      {/* Month Picker using ShadCN UI */}
      <div className="mb-6 p-2 border-2 rounded-md">
        <label htmlFor="month-picker" className="text-sm font-medium">
          Select Month: <span className="text-red-500"> *</span>
        </label>
        <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full h-12 justify-start text-left font-semibold text-lg sm:text-xl",
                !date && "text-muted-foreground "
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleSelectDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {addedItems.length > 0 ? (
        <div className="space-y-4 p-2 border-2 rounded-md">
          {addedItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row justify-between sm:items-center items-start gap-4 p-4 bg-white rounded shadow-md"
            >
              <div className="flex items-center justify-center">
                <img
                  src={
                    imageError[item.id]
                      ? "/images/noImage.png" // Default placeholder image
                      : `${getCompressedImageUrl(item.imageUrl)}`
                  }
                  alt={item.name}
                  onError={() => handleImageError(item.id)} // Trigger the error handler
                  className="w-full h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-4 justify-center w-full sm:w-auto">
                {/* Decrease Quantity */}
                <button
                  onClick={() => handleDecreaseQuantity(item.id)}
                  className="p-2 sm:p-4 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  <Minus />
                </button>
                <span className="text-lg font-semibold text-center">
                  {item.quantity} ({item.measureUnit})
                </span>
                {/* Increase Quantity */}
                <button
                  onClick={() => handleIncreaseQuantity(item.id)}
                  className="p-2 sm:p-4 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  <Plus />
                </button>
                {/* Remove Item */}
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 sm:p-4 bg-red-200 rounded-md hover:bg-red-300"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-xl text-gray-600 mt-8 p-2 border-2 rounded-md">
          <h3>Your cart is empty</h3>
        </div>
      )}

      {/* Checkout Button */}
      {addedItems.length > 0 && (
        <div className="mt-6 p-2 border-2 rounded-md">
          <button
            onClick={generatePDF}
            className="bg-red-500 text-white px-6 py-3 w-full rounded-md hover:bg-red-600 font-semibold text-lg"
          >
            Print PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
