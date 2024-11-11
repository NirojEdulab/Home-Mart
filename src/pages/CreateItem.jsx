import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { CircleArrowLeft } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { RingLoader } from "react-spinners";

const serverURL = import.meta.env.VITE_SERVER_URL;

const CreateItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    measureUnit: "",
    category: null,
    customCategory: "",
  });

  const [loading, setLoading] = useState(false);

  const categories = ["Grocery", "Bathroom", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      category: value,
      customCategory: value === "Other" ? "" : prevData.customCategory,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate the form fields
    if (
      !formData.name ||
      !formData.measureUnit ||
      (!formData.category && formData.category !== "Other")
    ) {
      toast.error("Name, category, and measure unit are required fields!");
      setLoading(false);
      return;
    }
    if (formData.category === "Other" && !formData.customCategory) {
      toast.error("Please specify the new category.");
      setLoading(false);
      return;
    }

    const productData = {
      name: formData.name,
      measureUnit: formData.measureUnit,
      category:
        formData.category === "Other"
          ? formData.customCategory
          : formData.category,
    };

    try {
      const response = await axios.post(
        `${serverURL}/api/products`,
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.status === 201) {
        toast.success(response.data.message);

        // Clear the form data after successful submission
        setFormData({
          name: "",
          measureUnit: "",
          category: null,
          customCategory: "",
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error adding product. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen p-6 bg-gradient-to-br from-gray-700 to-gray-900">
      <Link to="/" className="w-full max-w-3xl mb-6">
        <p className="flex items-center text-green-500 w-full p-2 text-lg font-semibold">
          <CircleArrowLeft className="mr-2" />
          Go Back to Home
        </p>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg space-y-6"
      >
        {/* Name Field */}
        <div>
          <Label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-800 mb-2"
          >
            Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter item name"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-md p-4 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Measure Unit Field */}
        <div>
          <Label
            htmlFor="measureUnit"
            className="block text-sm font-semibold text-gray-800 mb-2"
          >
            Measure Unit <span className="text-red-500">*</span>
          </Label>
          <Input
            id="measureUnit"
            name="measureUnit"
            type="text"
            placeholder="Enter measure unit (e.g., kg, liter)"
            value={formData.measureUnit}
            onChange={handleChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-md p-4 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Category Selection */}
        <div>
          <Label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-800 mb-2"
          >
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={handleSelectChange}
            disabled={loading}
          >
            <SelectTrigger className="w-full border border-gray-300 rounded-md p-4 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={null} disabled>
                  Select Category
                </SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Category Input (Visible only if "Other" is selected) */}
        {formData.category === "Other" && (
          <div>
            <Label
              htmlFor="customCategory"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Specify Category <span className="text-red-500">*</span>
            </Label>
            <Input
              id="customCategory"
              name="customCategory"
              type="text"
              placeholder="Enter new category"
              value={formData.customCategory}
              onChange={handleChange}
              disabled={loading}
              className="w-full border border-gray-300 rounded-md p-4 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-200"
        >
          {loading ? (
            <RingLoader size={24} color="#fff" loading={loading} />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
};

export default CreateItem;
