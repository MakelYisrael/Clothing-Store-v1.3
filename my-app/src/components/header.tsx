import React from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Input } from "./ui/input";
import { Menu, Search, ShoppingCart, User, Heart } from "lucide-react";
import { useUser } from "../contexts/user-context";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  cartItemCount: number;
  wishlistItemCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onLoginClick: () => void;
  onOrdersClick: () => void;
  onSearchChange: (query: string) => void;
}

export function Header({ 
  cartItemCount, 
  wishlistItemCount, 
  onCartClick, 
  onWishlistClick, 
  onLoginClick, 
  onOrdersClick,
  onSearchChange 
}: HeaderProps) {
  const { user } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <nav className="flex flex-col space-y-4 mt-8">
                <a href="#" className="hover:text-primary transition-colors">Men</a>
                <a href="#" className="hover:text-primary transition-colors">Women</a>
                <a href="#" className="hover:text-primary transition-colors">Accessories</a>
                <a href="#" className="hover:text-primary transition-colors">Sale</a>
                <a href="#" className="hover:text-primary transition-colors">New Arrivals</a>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold">JHF</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-primary transition-colors">Men</a>
            <a href="#" className="hover:text-primary transition-colors">Women</a>
            <a href="#" className="hover:text-primary transition-colors">Accessories</a>
            <a href="#" className="hover:text-primary transition-colors">Sale</a>
            <a href="#" className="hover:text-primary transition-colors">New Arrivals</a>
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="w-64 pl-10"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearchChange(e.target.value);
                }}
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            {/* Mobile search */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" onClick={onWishlistClick} className="relative">
              <Heart className="h-5 w-5" />
              {wishlistItemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {wishlistItemCount > 9 ? '9+' : wishlistItemCount}
                </Badge>
              )}
            </Button>

            {/* User */}
            {user ? (
              <UserMenu onOrdersClick={onOrdersClick} onWishlistClick={onWishlistClick} />
            ) : (
              <Button variant="ghost" size="icon" onClick={onLoginClick}>
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Cart */}
            <Button variant="ghost" size="icon" onClick={onCartClick} className="relative">
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
          <div className="lg:hidden py-2 border-t">
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