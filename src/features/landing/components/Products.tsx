import React, { useState, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X } from "lucide-react";
import { Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

import { ProductData, Categories } from "../types/product";

const Products: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("miles-creeps");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const productsRef = useRef<HTMLElement>(null);

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath);
  };

  const productsPerPage = 3;
  const filteredProducts = ProductData.filter(
    ProductData => ProductData.category === activeCategory
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    productsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="products" ref={productsRef} className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="text-pink-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-center">Our Creations</h2>
          <Sparkles className="text-pink-600" />
        </div>

        {/* Categories Section */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-8 md:mb-12">
          {Categories.map((category) => (
            <Badge
              key={category.id}
              variant="outline"
              className={`cursor-pointer text-sm px-3 md:px-4 py-2 transition-all ${
                activeCategory === category.id
                  ? "bg-pink-600 text-white hover:bg-pink-700"
                  : "border-pink-600 text-pink-600 hover:bg-pink-50"
              }`}
              onClick={() => {
                setActiveCategory(category.id);
                setCurrentPage(1);
              }}
            >
              {category.name}
            </Badge>
          ))}
        </div>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
            {currentProducts.map((product) => (
              <Card key={product.name} className="group overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="relative h-64 md:h-96 overflow-hidden">
                  <img
                    src={product.imagePath}
                    alt={product.name}
                    className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                      product.imagePath.endsWith('.png') ? 'object-contain px-4' : 'object-cover'
                    }`}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute bottom-4 right-4 bg-white/90 hover:bg-white"
                    onClick={() => handleImageClick(product.imagePath)}
                  >
                    <Maximize2 className="w-4 h-4 mr-2" />
                    View Full
                  </Button>
                </div>

                <CardContent className="p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4">
                    {product.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs md:text-sm bg-pink-100 text-pink-600">
                      Premium Quality
                    </Badge>
                    <Badge variant="secondary" className="text-xs md:text-sm bg-pink-100 text-pink-600">
                      Made Fresh Daily
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-600">No products available in this category</h3>
            <p className="text-gray-500 mt-2">Please check back later or select another category</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            {pageNumbers.map((number) => (
              <Badge
                key={number}
                variant="outline"
                className={`cursor-pointer px-3 md:px-4 py-2 transition-all ${
                  currentPage === number
                    ? "bg-pink-600 text-white hover:bg-pink-700"
                    : "border-pink-600 text-pink-600 hover:bg-pink-50"
                }`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </Badge>
            ))}
          </div>
        )}

        {/* Full Image Modal */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-screen-lg w-full h-screen md:h-auto p-0">
            <div className="relative w-full h-full md:min-h-[80vh] flex items-center justify-center bg-black/95">
              <DialogClose className="absolute top-4 right-4 z-50">
                <div className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
                  <X className="h-6 w-6 text-white" />
                </div>
              </DialogClose>
              {selectedImage && (
                <div className="w-full h-full md:h-auto flex items-center justify-center p-4">
                  <img
                    src={selectedImage}
                    alt="Full size"
                    className={`${
                      selectedImage.endsWith('.png')
                        ? 'h-auto max-h-[80vh] w-auto max-w-full object-contain'
                        : 'h-auto max-h-[80vh] w-auto max-w-full object-contain'
                    }`}
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Products;