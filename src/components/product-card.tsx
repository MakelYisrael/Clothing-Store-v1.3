import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Heart, ShoppingCart, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Review } from "./product-reviews";
import { useSeller } from "../contexts/seller-context";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[]; // Multiple product images for slideshow
  category: string;
  isNew?: boolean;
  isOnSale?: boolean;
  reviews?: Review[];
  averageRating?: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, color?: string, size?: string) => void;
  onToggleWishlist: (productId: string) => void;
  isInWishlist: boolean;
  onProductClick?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onToggleWishlist, isInWishlist, onProductClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const { products: sellerProducts } = useSeller();

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Get available colors for this product
  const sellerProduct = sellerProducts.find(p => p.id === product.id);
  const availableColors = sellerProduct?.availableColors || [];
  const hasColors = availableColors.length > 0;

  // Get images for the selected color variant, or fall back to default images
  const getImagesForColor = (color: string | null) => {
    if (!color || !sellerProduct) {
      return product.images && product.images.length > 0 ? product.images : [product.image];
    }
    
    // Find a variant with this color that has images
    const variantWithImages = sellerProduct.variants.find(v => 
      v.color === color && v.images && v.images.length > 0
    );
    
    if (variantWithImages?.images) {
      return variantWithImages.images;
    }
    
    // Fall back to default product images
    return product.images && product.images.length > 0 ? product.images : [product.image];
  };

  const allImages = getImagesForColor(selectedColor);
  const hasMultipleImages = allImages.length > 1;

  // Auto-advance slideshow when hovered
  useEffect(() => {
    if (!isHovered || !hasMultipleImages) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, allImages.length]);

  // Reset image index when color changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  // Set default color when component mounts
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasColors && !selectedColor) {
      setShowColorPicker(true);
      return;
    }
    onAddToCart(product, selectedColor || undefined);
    setShowColorPicker(false);
  };

  const handleColorSelect = (e: React.MouseEvent, color: string) => {
    e.stopPropagation();
    setSelectedColor(color);
  };

  return (
    <Card 
      className="group cursor-card transition-all duration-300 hover-lift border-0 shadow-sm hover-glow animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowColorPicker(false);
      }}
      onClick={() => onProductClick?.(product)}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {/* Image Slideshow */}
          <div className="relative w-full h-48 md:h-64">
            <ImageWithFallback
              src={allImages[currentImageIndex]}
              alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ''} - Image ${currentImageIndex + 1}`}
              className="w-full h-48 md:h-64 object-cover transition-all duration-500 cursor-zoom"
            />
            
            {/* Slideshow Navigation - Only show if multiple images */}
            {hasMultipleImages && (
              <>
                {/* Previous Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute left-2 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  } bg-background/80 hover:bg-background/90 cursor-button`}
                  onClick={handlePrevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Next Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={`absolute right-2 top-1/2 -translate-y-1/2 transition-opacity duration-200 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  } bg-background/80 hover:bg-background/90 cursor-button`}
                  onClick={handleNextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Image Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {allImages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all duration-300 cursor-button ${
                        index === currentImageIndex
                          ? 'w-6 bg-white'
                          : 'w-1.5 bg-white/50'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="destructive" className="text-xs animate-scale-in">New</Badge>
            )}
            {product.isOnSale && discountPercentage > 0 && (
              <Badge variant="secondary" className="text-xs animate-scale-in">-{discountPercentage}%</Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 transition-all duration-200 cursor-button hover-scale ${
              isHovered ? 'opacity-100' : 'opacity-0'
            } hover:bg-background/80`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
            />
          </Button>

          {/* Color Picker Overlay */}
          {showColorPicker && hasColors && (
            <div 
              className="absolute inset-0 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center gap-3 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm font-medium">Select a color:</p>
              <div className="flex gap-2 flex-wrap justify-center px-4">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      handleColorSelect(e, color);
                      onAddToCart(product, color);
                      setShowColorPicker(false);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs transition-all cursor-button hover-scale ${
                      selectedColor === color
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button / Color Selection */}
          <div className={`absolute bottom-2 left-2 right-2 transition-all duration-200 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            {hasColors ? (
              <div className="space-y-2">
                {/* Color selector */}
                <div className="flex gap-1 justify-center">
                  {availableColors.slice(0, 5).map((color) => (
                    <button
                      key={color}
                      onClick={(e) => handleColorSelect(e, color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all cursor-button hover-scale ${
                        selectedColor === color
                          ? 'border-white scale-110'
                          : 'border-white/50 hover:border-white'
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase() === 'black' ? '#000' :
                                        color.toLowerCase() === 'white' ? '#fff' :
                                        color.toLowerCase() === 'blue' ? '#3b82f6' :
                                        color.toLowerCase() === 'red' ? '#ef4444' :
                                        color.toLowerCase() === 'green' ? '#22c55e' :
                                        color.toLowerCase() === 'gray' || color.toLowerCase() === 'grey' ? '#6b7280' :
                                        color.toLowerCase() === 'brown' ? '#92400e' :
                                        color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                        color.toLowerCase() === 'beige' ? '#d4b5a0' : '#888'
                      }}
                      title={color}
                    />
                  ))}
                  {availableColors.length > 5 && (
                    <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                      +{availableColors.length - 5}
                    </span>
                  )}
                </div>
                <Button 
                  className="w-full cursor-button pulse-on-hover" 
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full cursor-button pulse-on-hover" 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-medium mb-2 line-clamp-2 cursor-link">{product.name}</h3>
          
          {/* Rating */}
          {product.averageRating && product.reviews && product.reviews.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.round(product.averageRating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">
                ({product.reviews.length})
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span className="font-semibold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          {/* Selected color indicator */}
          {hasColors && selectedColor && (
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {selectedColor}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
