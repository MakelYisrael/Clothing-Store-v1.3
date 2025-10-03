import React from "react";
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from './product-card';
import { ProductReviews, Review } from './product-reviews';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
  onAddReview: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isInWishlist,
  onAddReview
}: ProductDetailModalProps) {
  if (!product) return null;

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="sr-only">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge variant="destructive" className="text-xs">New</Badge>
                )}
                {product.isOnSale && discountPercentage > 0 && (
                  <Badge variant="secondary" className="text-xs">-{discountPercentage}%</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              {product.averageRating && product.reviews && product.reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(product.averageRating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.averageRating.toFixed(1)} ({product.reviews.length} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p className="text-muted-foreground mb-6">
                  {product.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={() => onAddToCart(product)}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => onToggleWishlist(product.id)}
              >
                <Heart 
                  className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </Button>
            </div>

            {/* Product Features */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free shipping</span>
                <span>On orders over $75</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Returns</span>
                <span>30-day free returns</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warranty</span>
                <span>1-year warranty</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Reviews Section */}
        <ProductReviews
          productId={product.id}
          reviews={product.reviews || []}
          onAddReview={(review) => onAddReview(review)}
        />
      </DialogContent>
    </Dialog>
  );
}