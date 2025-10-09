import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { VisuallyHidden } from './ui/visually-hidden';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ShoppingCart, Heart, Star, Minus, Plus, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from './product-card';
import { ProductReviews, Review } from './product-reviews';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ImageLightbox } from './image-lightbox';
import { useSeller } from '../contexts/seller-context';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, color?: string, size?: string) => void;
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
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { products: sellerProducts } = useSeller();

  // Get available colors for this product (before early return)
  const sellerProduct = product ? sellerProducts.find(p => p.id === product.id) : null;
  const availableColors = sellerProduct?.availableColors || [];
  const hasColors = availableColors.length > 0;
  
  // Get available sizes based on selected color
  const getAvailableSizes = () => {
    if (!sellerProduct || !selectedColor) return [];
    
    // Get unique sizes for the selected color that have stock
    const sizesForColor = sellerProduct.variants
      .filter(v => v.color === selectedColor && v.stock > 0)
      .map(v => v.size);
    
    // Remove duplicates and return
    return Array.from(new Set(sizesForColor));
  };
  
  const availableSizes = getAvailableSizes();
  const hasSizes = availableSizes.length > 0;

  // Set default color when product changes (must be before early return)
  useEffect(() => {
    if (product && availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [product?.id, availableColors.length, selectedColor]);
  
  // Set default size when color changes
  useEffect(() => {
    if (selectedColor && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [selectedColor, availableSizes.length]);

  // Reset image index when color changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [selectedColor]);

  if (!product) return null;

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

  const images = getImagesForColor(selectedColor);
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(99, prev + delta)));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product, selectedColor || undefined, selectedSize || undefined);
    }
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => prev > 0 ? prev - 1 : images.length - 1);
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => prev < images.length - 1 ? prev + 1 : 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <VisuallyHidden asChild>
          <DialogTitle>{product.name}</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden asChild>
          <DialogDescription>
            View details, reviews, and add {product.name} to your cart
          </DialogDescription>
        </VisuallyHidden>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image Carousel */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden group">
              <ImageWithFallback
                src={images[currentImageIndex]}
                alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ''} - View ${currentImageIndex + 1}`}
                className="w-full h-full object-cover cursor-pointer transition-opacity duration-300"
                onClick={() => setIsLightboxOpen(true)}
              />
              
              {/* Zoom Button */}
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsLightboxOpen(true)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>

              {/* Navigation Arrows (only show if multiple images) */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handlePreviousImage}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}
              
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

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${product.name}${selectedColor ? ` - ${selectedColor}` : ''} - Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
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

            {/* Color Selector */}
            {hasColors && (
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Color: {selectedColor && <span className="text-muted-foreground font-normal">{selectedColor}</span>}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-md text-sm transition-all cursor-button hover-scale border-2 ${
                        selectedColor === color
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary text-secondary-foreground border-transparent hover:border-primary/30'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {hasSizes && (
              <div>
                <label className="text-sm font-medium mb-3 block">
                  Size: {selectedSize && <span className="text-muted-foreground font-normal">{selectedSize}</span>}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md text-sm transition-all cursor-button hover-scale border-2 min-w-[60px] ${
                        selectedSize === size
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-secondary text-secondary-foreground border-transparent hover:border-primary/30'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 99}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  Total: ${(product.price * quantity).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={handleAddToCart}
                className="flex-1"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add {quantity > 1 ? `${quantity} ` : ''}to Cart
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

        {/* Image Lightbox */}
        <ImageLightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={images}
          currentIndex={currentImageIndex}
          onNavigate={setCurrentImageIndex}
          productName={product.name}
        />
      </DialogContent>
    </Dialog>
  );
}