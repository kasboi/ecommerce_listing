"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Product, ProductFormData } from "../../../src/lib/types";
import { useCategories } from "../../hooks/use-queries";
import { Button } from "../../../src/components/ui/button";
import { Input } from "../../../src/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../src/components/ui/card";

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: ProductFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    image: product?.image || "",
    inStock: product?.inStock ?? true,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductFormData, string>>
  >({});
  const [imagePreview, setImagePreview] = useState(product?.image || "");

  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();
  const allCategories = [
    "Gaming",
    "Audio",
    "Phones",
    "Photography",
    "Laptops",
    "Smart Home",
    ...categories,
  ];
  const uniqueCategories = Array.from(new Set(allCategories));

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    } else if (formData.price > 100000) {
      newErrors.price = "Price cannot exceed $100,000";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (!formData.image.trim()) {
      newErrors.image = "Image URL is required";
    } else {
      // Allow both relative URLs (starting with /) and absolute URLs
      const isRelativeUrl = formData.image.startsWith('/');
      const isValidAbsoluteUrl = () => {
        try {
          new URL(formData.image);
          return true;
        } catch {
          return false;
        }
      };
      
      if (!isRelativeUrl && !isValidAbsoluteUrl()) {
        newErrors.image = "Please enter a valid URL (e.g., /image.jpg or https://example.com/image.jpg)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
    setImagePreview(url);

    // Clear image error when user starts typing
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/admin">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </Link>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{product ? "Edit Product" : "Add New Product"}</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Product Name *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter product name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter product description"
                className={`w-full px-3 py-2 border rounded-md bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none ${
                  errors.description ? "border-red-500" : "border-input"
                }`}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price ($) *
                </label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  placeholder="0.00"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  disabled={isLoadingCategories}
                  className={`w-full h-10 px-3 py-2 border rounded-md bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    errors.category ? "border-red-500" : "border-input"
                  }`}
                >
                  <option value="">
                    {isLoadingCategories
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>
                  {!isLoadingCategories &&
                    uniqueCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Image URL *
              </label>
              <Input
                id="image"
                type="text"
                value={formData.image}
                onChange={(e) => handleImageChange(e.target.value)}
                placeholder="/image.jpg or https://example.com/image.jpg"
                className={errors.image ? "border-red-500" : ""}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <div className="w-32 h-32 rounded-md overflow-hidden border">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview("")}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Stock Status */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.inStock}
                  onChange={(e) =>
                    handleInputChange("inStock", e.target.checked)
                  }
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="text-sm font-medium text-gray-700">
                  Product is in stock
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Link href="/admin">
                <Button variant="outline" disabled={isSubmitting}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {product ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {product ? "Update Product" : "Add Product"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
