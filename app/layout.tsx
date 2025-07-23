import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "../src/components/layout/header";
import QueryProvider from "../src/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GidiStore - E-commerce Platform",
  description:
    "Modern e-commerce platform with the latest products and great deals",
  keywords: "ecommerce, shopping, electronics, gadgets",
  authors: [{ name: "GidiStore Team" }],
  openGraph: {
    title: "GidiStore - E-commerce Platform",
    description:
      "Modern e-commerce platform with the latest products and great deals",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <Header />
          <main className="min-h-screen bg-gray-50">{children}</main>
          <footer className="bg-white border-t">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-gray-600 font-semibold">
                <p>&copy; 2025 GidiStore. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
