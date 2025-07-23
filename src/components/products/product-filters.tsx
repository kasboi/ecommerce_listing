"use client";

import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ProductFilters } from "../../lib/types";
import { useCategories } from "../../hooks/use-queries";

interface ProductFiltersProps {
  filters: Partial<ProductFilters>;
  onFiltersChange: (filters: Partial<ProductFilters>) => void;
  onClearFilters: () => void;
}

export const ProductFiltersComponent = React.memo(
  function ProductFiltersComponent({
    filters,
    onFiltersChange,
    onClearFilters,
  }: ProductFiltersProps) {
    const { data: categories = [], isLoading: isLoadingCategories } =
      useCategories();

    const updateFilter = (key: keyof ProductFilters, value: any) => {
      onFiltersChange({ ...filters, [key]: value });
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Search Products
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name or description..."
              className=""
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="min-w-[200px]">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full h-10 px-3 py-2 border border-input rounded-md bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
              value={filters.category || "all"}
              onChange={(e) => updateFilter("category", e.target.value)}
              disabled={isLoadingCategories}
            >
              <option value="all">All Categories</option>
              {isLoadingCategories ? (
                <option disabled>Loading categories...</option>
              ) : (
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex gap-2 min-w-[200px]">
            <div className="flex-1">
              <label
                htmlFor="minPrice"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Min Price
              </label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={filters.minPrice || ""}
                onChange={(e) =>
                  updateFilter("minPrice", parseFloat(e.target.value) || 0)
                }
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="maxPrice"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Max Price
              </label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="999+"
                value={filters.maxPrice || ""}
                onChange={(e) =>
                  updateFilter(
                    "maxPrice",
                    parseFloat(e.target.value) || undefined,
                  )
                }
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="min-w-[150px]">
            <label
              htmlFor="sort"
              className="block text-sm font-medium text-gray-800 mb-2"
            >
              Sort By
            </label>
            <select
              id="sort"
              className="w-full h-10 px-3 py-2 border border-input rounded-md bg-transparent text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground"
              value={`${filters.sortBy || "name"}-${
                filters.sortOrder || "asc"
              }`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split("-");
                updateFilter("sortBy", sortBy);
                updateFilter("sortOrder", sortOrder);
              }}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
              <option value="rating-desc">Rating (High-Low)</option>
              <option value="rating-asc">Rating (Low-High)</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <Button
              variant="destructive"
              onClick={onClearFilters}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    );
  },
);
