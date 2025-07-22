"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFormData } from "../../../src/lib/types";
import { createProduct } from "../../../src/lib/storage";
import { ProductForm } from "../../../src/components/products/product-form";

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const newProduct = createProduct(data);

      // Show success message (you could add a toast notification here)
      alert(`Product "${newProduct.name}" has been added successfully!`);

      // Redirect to admin page
      router.push("/admin");
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <ProductForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />;
}
