import { useState, useMemo } from "react";
import { Header } from "./components/header";
import { HeroSection } from "./components/hero-section";
import { FeaturedProducts } from "./components/featured-products";
import { CategoriesSection } from "./components/categories-section";
import { Footer } from "./components/footer";
import { CartSheet, CartItem } from "./components/cart-sheet";
import { Product } from "./components/product-card";
import { AuthDialog } from "./components/auth-dialog";
import { OrderHistory } from "./components/order-history";
import { Wishlist } from "./components/wishlist";
import { SearchAndFilters, FilterOptions } from "./components/search-and-filters";
import { Checkout } from "./components/checkout";
import { ProductDetailModal } from "./components/product-detail-modal";
import { UserProvider } from "./contexts/user-context";
import { Review } from "./components/product-reviews";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

// Sample reviews data
const sampleReviews: { [productId: string]: Review[] } = {
  "1": [
    {
      id: "r1",
      userId: "u1",
      userName: "Sarah Johnson",
      rating: 5,
      comment: "Perfect fit and great quality! The fabric is soft and comfortable.",
      date: "2024-12-01",
      helpful: 12,
      verified: true
    },
    {
      id: "r2",
      userId: "u2",
      userName: "Mike Chen",
      rating: 4,
      comment: "Good quality shirt, runs a bit large though.",
      date: "2024-11-28",
      helpful: 8,
      verified: true
    }
  ],
  "2": [
    {
      id: "r3",
      userId: "u3",
      userName: "Emma Wilson",
      rating: 5,
      comment: "Absolutely stunning dress! Perfect for special occasions.",
      date: "2024-12-10",
      helpful: 15,
      verified: true
    }
  ]
};

// Sample products data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Classic White T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1603252110971-b8a57087be18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXN1YWwlMjBzaGlydHxlbnwxfHx8fDE3NTkwOTA0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Men's Clothing",
    isOnSale: true,
    reviews: sampleReviews["1"],
    averageRating: 4.5,
    description: "A comfortable and versatile classic white t-shirt made from 100% cotton."
  },
  {
    id: "2",
    name: "Elegant Black Dress",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1700158777421-2fd9263cec53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkxNDkzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Women's Clothing",
    isNew: true,
    reviews: sampleReviews["2"],
    averageRating: 5.0,
    description: "An elegant black dress perfect for evening events and special occasions."
  },
  {
    id: "3",
    name: "Premium Denim Jeans",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5MTUxNDE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Denim",
    isOnSale: true
  },
  {
    id: "4",
    name: "Athletic Sneakers",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1758702701300-372126112cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkwNzgzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Footwear",
    isNew: true
  },
  {
    id: "5",
    name: "Casual Button-Up Shirt",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1603252110971-b8a57087be18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXN1YWwlMjBzaGlydHxlbnwxfHx8fDE3NTkwOTA0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Men's Clothing"
  },
  {
    id: "6",
    name: "Summer Floral Dress",
    price: 69.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1700158777421-2fd9263cec53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkxNDkzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Women's Clothing",
    isOnSale: true
  },
  {
    id: "7",
    name: "Vintage Denim Jacket",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5MTUxNDE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Denim"
  },
  {
    id: "8",
    name: "Running Shoes",
    price: 109.99,
    originalPrice: 139.99,
    image: "https://images.unsplash.com/photo-1758702701300-372126112cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkwNzgzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Footwear",
    isOnSale: true
  }
];

function AppContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'search'>('main');
  const [productReviews, setProductReviews] = useState<{ [productId: string]: Review[] }>(sampleReviews);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    categories: [],
    priceRange: [0, 200],
    onSale: false,
    newArrivals: false,
    minRating: 0,
    sortBy: 'name'
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Enhanced products with reviews
  const productsWithReviews = useMemo(() => {
    return sampleProducts.map(product => ({
      ...product,
      reviews: productReviews[product.id] || [],
      averageRating: productReviews[product.id] 
        ? productReviews[product.id].reduce((sum, review) => sum + review.rating, 0) / productReviews[product.id].length
        : 0
    }));
  }, [productReviews]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = productsWithReviews;

    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => filters.categories.includes(product.category));
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Special filters
    if (filters.onSale) {
      filtered = filtered.filter(product => product.isOnSale);
    }

    if (filters.newArrivals) {
      filtered = filtered.filter(product => product.isNew);
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => (product.averageRating || 0) >= filters.minRating);
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [productsWithReviews, filters]);

  const categories = Array.from(new Set(sampleProducts.map(p => p.category)));

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    const item = cartItems.find(item => item.id === productId);
    setCartItems(prev => prev.filter(item => item.id !== productId));
    if (item) {
      toast.success(`${item.name} removed from cart`);
    }
  };

  const handleToggleWishlist = (productId: string) => {
    const product = sampleProducts.find(p => p.id === productId);
    setWishlistItems(prev => {
      if (prev.includes(productId)) {
        toast.success(`${product?.name} removed from wishlist`);
        return prev.filter(id => id !== productId);
      } else {
        toast.success(`${product?.name} added to wishlist`);
        return [...prev, productId];
      }
    });
  };

  const handleAddReview = (productId: string, review: Omit<Review, 'id' | 'date' | 'helpful'>) => {
    const newReview: Review = {
      ...review,
      id: `r${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      helpful: 0
    };

    setProductReviews(prev => ({
      ...prev,
      [productId]: [...(prev[productId] || []), newReview]
    }));
  };

  const handleSearchChange = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
    if (query.trim()) {
      setCurrentView('search');
    } else if (filters.categories.length === 0 && !filters.onSale && !filters.newArrivals && filters.minRating === 0) {
      setCurrentView('main');
    }
  };

  const handleClearFilters = () => {
    setFilters({
      searchQuery: '',
      categories: [],
      priceRange: [0, 200],
      onSale: false,
      newArrivals: false,
      minRating: 0,
      sortBy: 'name'
    });
    setCurrentView('main');
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setIsCheckoutOpen(false);
    setCartItems([]);
    toast.success('Order placed successfully!');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const showSearchResults = currentView === 'search' || filters.searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-background">
      {isCheckoutOpen ? (
        <Checkout
          cartItems={cartItems}
          onBack={() => setIsCheckoutOpen(false)}
          onOrderComplete={handleOrderComplete}
        />
      ) : (
        <>
          <Header 
            cartItemCount={cartItemCount}
            wishlistItemCount={wishlistItems.length}
            onCartClick={() => setIsCartOpen(true)}
            onWishlistClick={() => setIsWishlistOpen(true)}
            onLoginClick={() => setIsAuthDialogOpen(true)}
            onOrdersClick={() => setIsOrderHistoryOpen(true)}
            onSearchChange={handleSearchChange}
          />
          
          <main>
            {!showSearchResults ? (
              <>
                <HeroSection />
                <FeaturedProducts
                  products={productsWithReviews}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  wishlistItems={wishlistItems}
                  onProductClick={handleProductClick}
                />
                <CategoriesSection />
              </>
            ) : (
              <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    {filters.searchQuery ? `Search results for "${filters.searchQuery}"` : 'All Products'}
                  </h2>
                  <SearchAndFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                    onClearFilters={handleClearFilters}
                    categories={categories}
                  />
                </div>

                {filteredProducts.length > 0 ? (
                  <FeaturedProducts
                    products={filteredProducts}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                    wishlistItems={wishlistItems}
                    onProductClick={handleProductClick}
                  />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">No products found</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try adjusting your filters or search terms
                    </p>
                  </div>
                )}
              </div>
            )}
          </main>
          
          <Footer />
        </>
      )}
      
      {/* Dialogs and Sheets */}
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <AuthDialog
        isOpen={isAuthDialogOpen}
        onClose={() => setIsAuthDialogOpen(false)}
      />

      <OrderHistory
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />

      <Wishlist
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        products={productsWithReviews}
        onRemoveFromWishlist={(productId) => {
          setWishlistItems(prev => prev.filter(id => id !== productId));
          const product = productsWithReviews.find(p => p.id === productId);
          if (product) {
            toast.success(`${product.name} removed from wishlist`);
          }
        }}
        onAddToCart={handleAddToCart}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={isProductDetailOpen}
        onClose={() => {
          setIsProductDetailOpen(false);
          setSelectedProduct(null);
        }}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isInWishlist={selectedProduct ? wishlistItems.includes(selectedProduct.id) : false}
        onAddReview={(review) => {
          if (selectedProduct) {
            handleAddReview(selectedProduct.id, review);
          }
        }}
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}