import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "./ui/sheet";
import { VisuallyHidden } from "./ui/visually-hidden";
import { Input } from "./ui/input";
import { Menu, Search, ShoppingCart, User, Heart, Moon, Sun } from "lucide-react";
import { useUser } from "../contexts/user-context";
import { useTheme } from "../contexts/theme-context";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  cartItemCount: number;
  wishlistItemCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onLoginClick: () => void;
  onOrdersClick: () => void;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string | null) => void;
  currentCategory?: string | null;
  onSellerModeToggle?: () => void;
  onNotificationsClick?: () => void;
  onFeedbackClick?: () => void;
  onSettingsClick?: () => void;
}

export function Header({ 
  cartItemCount, 
  wishlistItemCount, 
  onCartClick, 
  onWishlistClick, 
  onLoginClick, 
  onOrdersClick,
  onSearchChange,
  onCategoryChange,
  currentCategory,
  onSellerModeToggle,
  onNotificationsClick,
  onFeedbackClick,
  onSettingsClick
}: HeaderProps) {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategoryClick = (category: string | null) => {
    onCategoryChange(category);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Mobile menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden cursor-button">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <VisuallyHidden asChild>
                  <SheetTitle>Navigation Menu</SheetTitle>
                </VisuallyHidden>
                <VisuallyHidden asChild>
                  <SheetDescription>
                    Browse categories and shop collections
                  </SheetDescription>
                </VisuallyHidden>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-8">
                <button 
                  onClick={() => handleCategoryClick(null)} 
                  className={`text-left hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === null ? 'text-primary font-medium' : ''}`}
                >
                  All Products
                </button>
                <button 
                  onClick={() => handleCategoryClick("Men's Clothing")} 
                  className={`text-left hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Men's Clothing" ? 'text-primary font-medium' : ''}`}
                >
                  Men
                </button>
                <button 
                  onClick={() => handleCategoryClick("Women's Clothing")} 
                  className={`text-left hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Women's Clothing" ? 'text-primary font-medium' : ''}`}
                >
                  Women
                </button>
                <button 
                  onClick={() => handleCategoryClick("Denim")} 
                  className={`text-left hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Denim" ? 'text-primary font-medium' : ''}`}
                >
                  Denim
                </button>
                <button 
                  onClick={() => handleCategoryClick("Footwear")} 
                  className={`text-left hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Footwear" ? 'text-primary font-medium' : ''}`}
                >
                  Footwear
                </button>
                <button 
                  onClick={() => handleCategoryClick("Accessories")} 
                  className={`text-left hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Accessories" ? 'text-primary font-medium' : ''}`}
                >
                  Accessories
                </button>
                <button 
                  onClick={() => handleCategoryClick("sale")} 
                  className={`text-left hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "sale" ? 'text-primary font-medium' : ''}`}
                >
                  Sale
                </button>
                <button 
                  onClick={() => handleCategoryClick("new")} 
                  className={`text-left hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "new" ? 'text-primary font-medium' : ''}`}
                >
                  New Arrivals
                </button>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo and Welcome Message */}
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={() => handleCategoryClick(null)} className="hover:opacity-80 transition-opacity cursor-button hover-scale">
              <h1 className="text-xl font-bold">JHF</h1>
            </button>
            {user && (
              <span className="text-xs md:text-sm text-muted-foreground">
                Welcome, {user.name.split(' ')[0]}!
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <button 
              onClick={() => handleCategoryClick("Men's Clothing")} 
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Men's Clothing" ? 'text-primary font-medium' : ''}`}
            >
              Men
            </button>
            <button 
              onClick={() => handleCategoryClick("Women's Clothing")} 
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Women's Clothing" ? 'text-primary font-medium' : ''}`}
            >
              Women
            </button>
            <button 
              onClick={() => handleCategoryClick("Denim")} 
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Denim" ? 'text-primary font-medium' : ''}`}
            >
              Denim
            </button>
            <button 
              onClick={() => handleCategoryClick("Footwear")} 
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Footwear" ? 'text-primary font-medium' : ''}`}
            >
              Footwear
            </button>
            <button 
              onClick={() => handleCategoryClick("Accessories")} 
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "Accessories" ? 'text-primary font-medium' : ''}`}
            >
              Accessories
            </button>
            <button 
              onClick={() => handleCategoryClick("sale")} 
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "sale" ? 'text-primary font-medium' : ''}`}
            >
              Sale
            </button>
            <button 
              onClick={() => handleCategoryClick("new")} 
              className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${currentCategory === "new" ? 'text-primary font-medium' : ''}`}
            >
              New Arrivals
            </button>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="w-64 pl-10 cursor-input"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearchChange(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Mobile search */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden h-9 w-9"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="cursor-button hover-scale"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Wishlist - Hidden on mobile, shown in bottom nav */}
            <Button variant="ghost" size="icon" onClick={onWishlistClick} className="hidden md:flex relative cursor-button hover-scale">
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-scale-in">
                  {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
                </Badge>
              )}
            </Button>

            {/* Seller Mode Toggle - Only show for sellers */}
            {onSellerModeToggle && user?.isSeller && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onSellerModeToggle}
                className="hidden md:flex cursor-button pulse-on-hover"
              >
                Seller Dashboard
              </Button>
            )}

            {/* User */}
            {user ? (
              <UserMenu 
                onOrdersClick={onOrdersClick} 
                onWishlistClick={onWishlistClick}
                onSellerModeToggle={onSellerModeToggle}
                onNotificationsClick={onNotificationsClick}
                onFeedbackClick={onFeedbackClick}
                onSettingsClick={onSettingsClick}
              />
            ) : (
              <Button variant="ghost" size="icon" onClick={onLoginClick} className="cursor-button hover-scale">
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Cart - Hidden on mobile, shown in bottom nav */}
            <Button variant="ghost" size="icon" onClick={onCartClick} className="hidden md:flex relative cursor-button hover-scale">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-2 border-t border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="w-full pl-10"
                autoFocus
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearchChange(e.target.value);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
