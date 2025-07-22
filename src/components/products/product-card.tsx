"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "../../lib/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { id, name, price, image, rating, reviewCount, inStock, category } =
    product;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <div className="flex items-center space-x-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className="w-4 h-4 fill-yellow-400 text-yellow-400"
          />
        ))}
        {hasHalfStar && (
          <Star className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    );
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <Link href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 bg-blue-900/90 backdrop-blur text-white text-xs font-medium rounded-full">
              {category}
            </span>
          </div>
          {!inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/products/${id}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-blue-900 group-hover:text-blue-700 transition-colors">
            {name}
          </h3>
        </Link>

        <div className="flex items-center mb-3">
          {renderStars(rating)}
          <span className="ml-2 text-sm text-gray-600">
            ({reviewCount} reviews)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-900">
            ${price.toFixed(2)}
          </div>

          <Button
            size="sm"
            disabled={!inStock}
            variant="outline"
            className="min-w-fit "
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            Add to Cart
          </Button>
        </div>

        {!inStock && (
          <p className="text-red-600 text-sm mt-2 font-medium">
            Currently unavailable
          </p>
        )}
      </CardContent>
    </Card>
  );
}
