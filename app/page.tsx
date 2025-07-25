"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { Product } from "../src/lib/types";
import { useProducts } from "../src/hooks/use-queries";
import { ProductCard } from "../src/components/products/product-card";
import { Button } from "../src/components/ui/button";

export default function HomePage() {
  const { data: products = [], isLoading, error } = useProducts();

  // Get featured product (highest rated with reviews)
  const featuredProduct =
    products
      .filter((p) => p.reviewCount > 0)
      .sort((a, b) => b.rating - a.rating)[0] || products[0];

  const latestProducts = products.slice(0, 6);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error loading products
          </h3>
          <p className="text-gray-600 mb-6">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      {featuredProduct && (
        <section className="mb-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8 items-center p-8 md:p-12">
              <div className="text-white space-y-6">
                <div className="space-y-4">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                    Featured Product
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                    {featuredProduct.name}
                  </h1>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {featuredProduct.description}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(featuredProduct.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white/90">
                    {featuredProduct.rating} ({featuredProduct.reviewCount}{" "}
                    reviews)
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-white">
                    ${featuredProduct.price.toFixed(2)}
                  </div>
                  <Link href={`/products/${featuredProduct.id}`}>
                    <Button
                      size="lg"
                      className="bg-white text-gray-900 hover:bg-gray-100"
                    >
                      View Product
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    width={300}
                    height={300}
                    className="object-cover h-full w-full"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Products Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest Products
            </h2>
            <p className="text-gray-600">
              Discover our newest arrivals and trending items
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {latestProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products available</p>
            <Link href="/admin">
              <Button>Add Your First Product</Button>
            </Link>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="mt-16 bg-white rounded-2xl p-8 md:p-12 border">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to Start Shopping?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our complete catalog of products, filter by categories, and
            find exactly what you're looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button size="lg" variant="default">
                Browse All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="secondary" size="lg">
                Manage Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
