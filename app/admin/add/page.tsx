"use client";

import { useRouter } from "next/navigation";
import { ProductFormData } from "../../../src/lib/types";
import { useCreateProduct } from "../../../src/hooks/use-queries";
import { ProductForm } from "../../../src/components/products/product-form";

export default function AddProductPage() {
  const router = useRouter();
  const createProductMutation = useCreateProduct();

  const handleSubmit = async (data: ProductFormData) => {
    try {
      const newProduct = await createProductMutation.mutateAsync(data);

      // Show success message (you could add a toast notification here)
      alert(`Product "${newProduct.name}" has been added successfully!`);

      // Redirect to admin page
      router.push("/admin");
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <ProductForm
      onSubmit={handleSubmit}
      isSubmitting={createProductMutation.isPending}
    />
  );
}
