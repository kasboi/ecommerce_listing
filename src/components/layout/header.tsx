"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, ShoppingCart, User } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useResetProducts } from "../../hooks/use-queries";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const resetProductsMutation = useResetProducts();

  const handleProductsReset = async () => {
    try {
      await resetProductsMutation.mutateAsync();
      setIsMenuOpen(false);
      // Show success message
      window.location.reload(); // Reload to reflect changes
      alert("Products have been reset to default values!");
    } catch (error) {
      console.error("Failed to reset products:", error);
      alert("Failed to reset products. Please try again.");
    }
  };

  return (
    <header className="sticky top-0 z-50 py-4 w-full bg-slate-700/60 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-md bg-gray-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <span className="text-xl font-bold text-white">GidiStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/admin"
              className="text-white hover:text-gray-200 transition-colors"
            >
              Admin
            </Link>
            <Button
              variant="destructive"
              onClick={handleProductsReset}
              disabled={resetProductsMutation.isPending}
            >
              {resetProductsMutation.isPending
                ? "Resetting..."
                : "Reset Local Storage"}
            </Button>
          </nav>

          {/* Action Buttons */}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-8 w-8" />
            ) : (
              <Menu className="h-8 w-8" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <Link
                  href="/"
                  className="text-white hover:text-gray-200 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className="text-white hover:text-gray-200 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/admin"
                  className="text-white hover:text-gray-200 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
                <Button
                  variant="destructive"
                  onClick={handleProductsReset}
                  disabled={resetProductsMutation.isPending}
                >
                  {resetProductsMutation.isPending
                    ? "Resetting..."
                    : "Reset Local Storage"}
                </Button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
