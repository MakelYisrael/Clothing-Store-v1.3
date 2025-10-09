import { Home, Heart, ShoppingCart, Store } from "lucide-react";
import { Badge } from "./ui/badge";

interface BottomNavProps {
  cartItemCount: number;
  wishlistItemCount: number;
  onHomeClick: () => void;
  onWishlistClick: () => void;
  onCartClick: () => void;
  onSellerDashboardClick?: () => void;
  showSellerDashboard?: boolean;
  activeTab?: 'home' | 'wishlist' | 'cart' | 'seller';
}

export function BottomNav({
  cartItemCount,
  wishlistItemCount,
  onHomeClick,
  onWishlistClick,
  onCartClick,
  onSellerDashboardClick,
  showSellerDashboard = false,
  activeTab = 'home'
}: BottomNavProps) {
  const gridCols = showSellerDashboard ? 'grid-cols-4' : 'grid-cols-3';
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
      <div className={`grid ${gridCols} h-16`}>
        {/* Home */}
        <button
          onClick={onHomeClick}
          className={`flex flex-col items-center justify-center gap-1 transition-colors tap-target ${
            activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <Home className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={onWishlistClick}
          className={`flex flex-col items-center justify-center gap-1 transition-colors relative tap-target ${
            activeTab === 'wishlist' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <div className="relative">
            <Heart className="h-6 w-6" />
            {wishlistItemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center p-0 text-xs"
              >
                {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
              </Badge>
            )}
          </div>
          <span className="text-xs">Wishlist</span>
        </button>

        {/* Cart */}
        <button
          onClick={onCartClick}
          className={`flex flex-col items-center justify-center gap-1 transition-colors relative tap-target ${
            activeTab === 'cart' ? 'text-primary' : 'text-muted-foreground'
          }`}
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-4 min-w-4 flex items-center justify-center p-0 text-xs"
              >
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </Badge>
            )}
          </div>
          <span className="text-xs">Cart</span>
        </button>

        {/* Seller Dashboard - Only show for sellers */}
        {showSellerDashboard && onSellerDashboardClick && (
          <button
            onClick={onSellerDashboardClick}
            className={`flex flex-col items-center justify-center gap-1 transition-colors tap-target ${
              activeTab === 'seller' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Store className="h-6 w-6" />
            <span className="text-xs">Seller</span>
          </button>
        )}
      </div>
    </nav>
  );
}
