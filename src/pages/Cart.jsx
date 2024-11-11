/* eslint-disable react/prop-types */
import { MinusIcon, PlusIcon, XIcon, CalendarIcon, CircleArrowLeft } from "lucide-react";
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
  const [date, setDate] = useState(Date.now());
  const [isOpen, setIsOpen] = useState(false);

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

  const handleRemoveItem = (itemId) => {
    setAddedItems((prevItems) =>
      prevItems.filter((item) => item.id !== itemId)
    );
  };

  const handleSelectDate = (newDate) => {
    setDate(newDate);
    setIsOpen(false);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const formattedDate = format(new Date(date), "dd-MM-yyyy");
    doc.setFontSize(20);
    doc.text(`Groceries (${formattedDate})`, 20, 20);

    // Table headers
    doc.setFontSize(12);
    doc.text("Sr. No", 20, 40);
    doc.text("Name", 50, 40);
    doc.text("Quantity", 100, 40);
    doc.text("Price", 150, 40);
    doc.line(20, 42, doc.internal.pageSize.width - 20, 42);

    let yPosition = 50;
    let itemsPerPage = 25;
    let itemIndex = 0;

    addedItems.forEach((item, index) => {
      if (itemIndex === itemsPerPage) {
        doc.addPage();
        yPosition = 20;
        itemIndex = 0;

        // Re-draw table headers for new page
        doc.text("Sr. No", 20, yPosition);
        doc.text("Name", 50, yPosition);
        doc.text("Quantity", 100, yPosition);
        doc.text("Price", 150, yPosition);
        doc.line(20, yPosition + 2, doc.internal.pageSize.width - 20, yPosition + 2);
        yPosition += 10;
      }

      doc.text(`${index + 1}.`, 20, yPosition);
      doc.text(item.name, 50, yPosition);
      doc.text(`${item.quantity} ${item.measureUnit}`, 100, yPosition);

      yPosition += 10;
      itemIndex += 1;
    });

    doc.line(20, yPosition, doc.internal.pageSize.width - 20, yPosition);
    doc.text("Total:", 120, yPosition + 10);
    doc.save(`groceries_list_${format(new Date(date), "dMMMyyyy")}.pdf`);
  };

  return (
    <div className="p-2 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center gap-2 p-4 mb-6 bg-green-600 text-white rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold">Shopping Cart</h2>
        <Link to="/add-items" className="text-white">
          <CircleArrowLeft size={32} />
        </Link>
      </div>

      <div className="mb-8 p-4 bg-white border rounded-lg shadow">
        <label htmlFor="month-picker" className="text-sm font-medium">
          Select Month: <span className="text-red-500">*</span>
        </label>
        <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 justify-start text-left font-semibold text-lg sm:text-xl",
                !date && "text-muted-foreground"
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
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b text-left">Sr. No</th>
                <th className="px-4 py-2 border-b text-left">Name</th>
                <th className="px-4 py-2 border-b text-left">Quantity</th>
                <th className="px-4 py-2 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addedItems.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.quantity} {item.measureUnit}</td>
                  <td className="px-4 py-2 flex items-center gap-2">
                    <button
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleIncreaseQuantity(item.id)}
                      className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1 bg-red-200 rounded hover:bg-red-300"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center mt-12 text-gray-600">
          <h3 className="text-2xl mb-4">Your cart is empty</h3>
          <Link to="/add-items" className="text-blue-500 underline">
            Go back and add some items
          </Link>
        </div>
      )}

      {addedItems.length > 0 && (
        <div className="mt-8">
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white w-full py-3 rounded-md shadow-lg hover:bg-blue-700 font-semibold text-lg"
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default Cart;
