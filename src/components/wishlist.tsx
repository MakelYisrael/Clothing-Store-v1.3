import { Heart, ShoppingCart, X } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Product } from './product-card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface WishlistProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: string[];
  products: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, color?: string, size?: string) => void;
}

export function Wishlist({ 
  isOpen, 
  onClose, 
  wishlistItems, 
  products, 
  onRemoveFromWishlist, 
  onAddToCart 
}: WishlistProps) {
  const wishlistProducts = products.filter(product => wishlistItems.includes(product.id));

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2" />
            My Wishlist
          </SheetTitle>
          <SheetDescription>
            Items you've saved for later
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {wishlistProducts.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">Your wishlist is empty</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Save items you love for later!
                </p>
                <Button onClick={onClose} className="cursor-button">Continue Shopping</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-muted/50 transition-all duration-200 animate-fade-in cursor-card">
                      <div className="relative h-20 w-20 rounded-md overflow-hidden cursor-zoom">
                        <ImageWithFallback
                          src={product.image}
                          alt={product.name}
                          className="object-cover w-full h-full hover-scale"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="font-bold">${product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                          {product.isOnSale && (
                            <Badge variant="destructive" className="text-xs">
                              Sale
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => onAddToCart(product)}
                            className="flex-1 pulse-on-hover"
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Add to Cart
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onRemoveFromWishlist(product.id)}
                            className="hover-scale"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <Button
                  variant="outline"
                  className="w-full mb-3 cursor-button"
                  onClick={() => {
                    wishlistProducts.forEach(product => onAddToCart(product));
                    onClose();
                  }}
                >
                  Add All to Cart ({wishlistProducts.length} items)
                </Button>
                
                <Button
                  className="w-full cursor-button"
                  onClick={onClose}
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}