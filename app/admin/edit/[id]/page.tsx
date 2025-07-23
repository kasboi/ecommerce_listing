"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { ProductFormData } from "../../../../src/lib/types";
import {
  useProduct,
  useUpdateProduct,
} from "../../../../src/hooks/use-queries";
import { ProductForm } from "../../../../src/components/products/product-form";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();

  // Extract params using use() hook for async params
  const { id } = use(params);

  const { data: product, isLoading, error } = useProduct(id);
  const updateProductMutation = useUpdateProduct();

  // If product not found
  if (error && !isLoading) {
    notFound();
  }

  const handleSubmit = async (data: ProductFormData) => {
    if (!product) return;

    try {
      const updatedProduct = await updateProductMutation.mutateAsync({
        id: product.id,
        data,
      });

      // Show success message
      alert(`Product "${updatedProduct.name}" has been updated successfully!`);

      // Redirect to admin page
      router.push("/admin");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  return (
    <ProductForm
      product={product}
      onSubmit={handleSubmit}
      isSubmitting={updateProductMutation.isPending}
    />
  );
}
