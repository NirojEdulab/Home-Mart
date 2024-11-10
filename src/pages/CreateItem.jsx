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
import { cn } from "@/lib/utils";
import axios from "axios";
import { CircleArrowLeft, CloudUpload, Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { RingLoader } from "react-spinners";
const serverURL = import.meta.env.VITE_SERVER_URL;

const CreateItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    measureUnit: "",
    category: "",
    file: null,
    customCategory: "",
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    "Grocery",
    "Bathroom",
    "Kitchen",
    "Cleaning Supplies",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      category: value,
      customCategory: value === "Other" ? "" : prevData.customCategory,
    }));
  };

  const handleFileDelete = () => {
    setFormData((prevData) => ({
      ...prevData,
      file: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

    const formDataObj = new FormData();
    formDataObj.append("name", productData.name);
    formDataObj.append("measureUnit", productData.measureUnit);
    formDataObj.append("category", productData.category);

    if (formData.file) {
      formDataObj.append("file", formData.file);
    }

    try {
      const response = await axios.post(
        `${serverURL}/api/products`,
        formDataObj,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.status === 201) {
        toast.success(response.data.message);
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
    <div className="flex flex-col justify-center items-center w-full min-h-screen p-4 bg-gradient-to-br from-gray-700 to-gray-900">
      <Link to="/" className="w-full max-w-3xl">
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
            className="block text-sm font-semibold text-gray-800 mb-1"
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
            className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Measure Unit Field */}
        <div>
          <Label
            htmlFor="measureUnit"
            className="block text-sm font-semibold text-gray-800 mb-1"
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
            className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Category Selection */}
        <div>
          <Label
            htmlFor="category"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Category <span className="text-red-500">*</span>
          </Label>
          <Select onValueChange={handleSelectChange} disabled={loading}>
            <SelectTrigger className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
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
              className="block text-sm font-semibold text-gray-800 mb-1"
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
              className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {/* File Upload */}
        <div>
          <Label
            htmlFor="file"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Upload Image (Optional)
          </Label>
          <div className="relative">
            {!formData.file ? (
              <label htmlFor="file" className="w-full cursor-pointer">
                <div className="flex flex-col items-center justify-center p-8 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <CloudUpload className="text-gray-500 w-10 h-10 mb-2" />
                  <p className="mb-1 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500">SVG, PNG, JPG, or GIF</p>
                </div>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>
            ) : (
              <div className="w-full h-64 relative">
                <img
                  src={URL.createObjectURL(formData.file)}
                  alt="Selected file"
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleFileDelete}
                  className={cn(`absolute top-2 right-2 p-2 ${loading ? 'bg-gray-500' : 'bg-red-500'} text-white rounded-full text-xs`)}
                >
                  <Trash2 className="w-8 h-8" />
                </button>
              </div>
            )}
          </div>
        </div>

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
