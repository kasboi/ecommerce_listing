"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { Product, ProductFormData } from "../../../../src/lib/types";
import { getProductById, updateProduct } from "../../../../src/lib/storage";
import { ProductForm } from "../../../../src/components/products/product-form";

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = () => {
      const productData = getProductById(params.id);
      if (!productData) {
        notFound();
      }
      setProduct(productData);
      setIsLoading(false);
    };

    fetchProduct();
  }, [params.id]);

  const handleSubmit = async (data: ProductFormData) => {
    if (!product) return;

    setIsSubmitting(true);

    try {
      const updatedProduct = updateProduct(product.id, data);

      if (updatedProduct) {
        // Show success message
        alert(
          `Product "${updatedProduct.name}" has been updated successfully!`,
        );

        // Redirect to admin page
        router.push("/admin");
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed to update product. Please try again.");
    } finally {
      setIsSubmitting(false);
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
      isSubmitting={isSubmitting}
    />
  );
}
