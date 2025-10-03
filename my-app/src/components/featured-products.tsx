import React from "react";
import { ProductCard, Product } from "./product-card";

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistItems: string[];
  onProductClick?: (product: Product) => void;
}

export function FeaturedProducts({ products, onAddToCart, onToggleWishlist, wishlistItems, onProductClick }: FeaturedProductsProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of the season's most coveted pieces
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={wishlistItems.includes(product.id)}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}