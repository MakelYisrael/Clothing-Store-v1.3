import { useState, useMemo } from "react";
import { Header } from "./components/header";
import { HeroSection } from "./components/hero-section";
import { FeaturedProducts } from "./components/featured-products";
import { TopProducts } from "./components/top-products";
import { CategoriesSection } from "./components/categories-section";
import { CategoryHero } from "./components/category-hero";
import { Footer } from "./components/footer";
import { CartSheet, CartItem } from "./components/cart-sheet";
import { Product } from "./components/product-card";
import { AuthDialog } from "./components/auth-dialog";
import { OrderHistory } from "./components/order-history";
import { Wishlist } from "./components/wishlist";
import { SearchAndFilters, FilterOptions } from "./components/search-and-filters";
import { Checkout } from "./components/checkout";
import { ProductDetailModal } from "./components/product-detail-modal";
import { AboutUs } from "./components/about-us";
import { Contact } from "./components/contact";
import { SizeGuide } from "./components/size-guide";
import { ShippingInfo } from "./components/shipping-info";
import { Returns } from "./components/returns";
import { SellerDashboard } from "./components/seller-dashboard";
import { PrivacyPolicy } from "./components/privacy-policy";
import { TermsOfService } from "./components/terms-of-service";
import { CookieConsent } from "./components/cookie-consent";
import { NotificationSubscription } from "./components/notification-subscription";
import { CustomerFeedback } from "./components/customer-feedback";
import { Settings } from "./components/settings";
import { UserProvider, useUser } from "./context/user-context";
import { SellerProvider, useSeller } from "./context/seller-context";
import { ThemeProvider } from "./context/theme-context";
import { Review } from "./components/product-reviews";
import { toast } from "sonner";
import { Toaster } from "./components/ui/sonner";
import { BottomNav } from "./components/bottom-nav";

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

// Sample products data - Expanded with more variety
const sampleProducts: Product[] = [
  // Men's Clothing
  {
    id: "1",
    name: "Classic White T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkyNDU4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkyNDU4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1543529140-86d36880cafd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMGJhY2t8ZW58MXx8fHwxNzU5MzI4MDI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    category: "Men's Clothing",
    isOnSale: true,
    reviews: sampleReviews["1"],
    averageRating: 4.5,
    description: "A comfortable and versatile classic white t-shirt made from 100% cotton."
  },
  {
    id: "5",
    name: "Casual Button-Up Shirt",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0b24lMjBzaGlydCUyMGNhc3VhbHxlbnwxfHx8fDE3NTkyNDU4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Men's Clothing",
    description: "A versatile button-up shirt perfect for casual or semi-formal occasions."
  },
  {
    id: "9",
    name: "Men's Polo Shirt",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1706007647543-460bfa7db776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xvJTIwc2hpcnQlMjBtZW58ZW58MXx8fHwxNzU5MTM1NTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Men's Clothing",
    isNew: true,
    description: "Classic polo shirt with modern fit and premium cotton fabric."
  },
  {
    id: "10",
    name: "Men's Chino Pants",
    price: 69.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1586605728676-f0375b3af670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlubyUyMHBhbnRzJTIwYmVpZ2V8ZW58MXx8fHwxNzU5MjQ1ODcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Men's Clothing",
    isOnSale: true,
    description: "Comfortable and stylish chino pants for everyday wear."
  },
  
  // Women's Clothing
  {
    id: "2",
    name: "Elegant Black Dress",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1759090988109-2ed7abd1eefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGRyZXNzJTIwZWxlZ2FudHxlbnwxfHx8fDE3NTkxNzQ2NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1759090988109-2ed7abd1eefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGRyZXNzJTIwZWxlZ2FudHxlbnwxfHx8fDE3NTkxNzQ2NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1623609163915-d21853ad7d0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGRyZXNzJTIwZXZlbmluZyUyMGJhY2t8ZW58MXx8fHwxNzU5MzI4MDI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    category: "Women's Clothing",
    isNew: true,
    reviews: sampleReviews["2"],
    averageRating: 5.0,
    description: "An elegant black dress perfect for evening events and special occasions."
  },
  {
    id: "6",
    name: "Summer Floral Dress",
    price: 69.99,
    originalPrice: 89.99,
    image: "https://images.unsplash.com/photo-1578404449256-0de908ee34ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBkcmVzcyUyMHN1bW1lcnxlbnwxfHx8fDE3NTkyNDU4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Women's Clothing",
    isOnSale: true,
    description: "Bright and beautiful summer dress with floral patterns."
  },
  {
    id: "11",
    name: "Women's Blouse",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1685338336656-e10a7bb3e12a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGJsb3VzZSUyMGZhc2hpb258ZW58MXx8fHwxNzU5MjQ1ODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm-medium=referral",
    category: "Women's Clothing",
    isNew: true,
    description: "Elegant blouse perfect for professional and casual settings."
  },
  {
    id: "12",
    name: "Women's Skirt",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1637227314917-3c0f595c3596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkyMjIxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Women's Clothing",
    description: "A-line skirt with modern silhouette and comfortable fit."
  },
  
  // Denim
  {
    id: "3",
    name: "Premium Denim Jeans",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1713880442898-0f151fba5e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NTkyNDU4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1713880442898-0f151fba5e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NTkyNDU4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1627688371237-be0253a36955?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBiYWNrJTIwcG9ja2V0fGVufDF8fHx8MTc1OTMyODAyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    category: "Denim",
    isOnSale: true,
    description: "Premium quality denim jeans with perfect fit and durability."
  },
  {
    id: "7",
    name: "Vintage Denim Jacket",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1563339387-0ba9892a3f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGphY2tldCUyMHZpbnRhZ2V8ZW58MXx8fHwxNzU5MTMwMTgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Denim",
    isNew: true,
    description: "Classic vintage-style denim jacket for timeless fashion."
  },
  {
    id: "13",
    name: "Slim Fit Denim",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGltJTIwZml0JTIwamVhbnN8ZW58MXx8fHwxNzU5MjQ1ODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Denim",
    description: "Modern slim fit denim jeans for a contemporary look."
  },
  
  // Footwear
  {
    id: "4",
    name: "Athletic Sneakers",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1719523677291-a395426c1a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGF0aGxldGljJTIwc2hvZXN8ZW58MXx8fHwxNzU5MjQ1ODYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1719523677291-a395426c1a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGF0aGxldGljJTIwc2hvZXN8ZW58MXx8fHwxNzU5MjQ1ODYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1623961750651-da5deaa8a49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNpZGUlMjB2aWV3fGVufDF8fHx8MTc1OTMyODAyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1713603577917-27ad05a6524a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNvbGUlMjBib3R0b218ZW58MXx8fHwxNzU5Mjk0NzEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    category: "Footwear",
    isNew: true,
    description: "High-performance athletic sneakers with superior comfort."
  },
  {
    id: "8",
    name: "Running Shoes",
    price: 109.99,
    originalPrice: 139.99,
    image: "https://images.unsplash.com/photo-1709258228137-19a8c193be39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBzcG9ydHxlbnwxfHx8fDE3NTkyNDA4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Footwear",
    isOnSale: true,
    description: "Lightweight running shoes designed for optimal performance."
  },
  {
    id: "14",
    name: "Casual Sneakers",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1582231640349-6ea6881fabeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzbmVha2VycyUyMHdoaXRlfGVufDF8fHx8MTc1OTIzMjgwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Footwear",
    description: "Versatile sneakers perfect for everyday wear."
  },
  {
    id: "15",
    name: "Leather Boots",
    price: 159.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1638158980051-f7e67291efed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYm9vdHMlMjBicm93bnxlbnwxfHx8fDE3NTkxNTYxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Footwear",
    isOnSale: true,
    description: "Premium leather boots with timeless design."
  },
  
  // Accessories
  {
    id: "16",
    name: "Leather Wallet",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwd2FsbGV0fGVufDF8fHx8MTc1OTI0NTg3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    description: "Genuine leather wallet with multiple card slots."
  },
  {
    id: "17",
    name: "Designer Sunglasses",
    price: 149.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1718967807816-414e2f9bc95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkyMjU1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    isOnSale: true,
    description: "Stylish sunglasses with UV protection."
  },
  {
    id: "18",
    name: "Classic Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1667375565651-b660b574d1a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cmlzdCUyMHdhdGNoJTIwY2xhc3NpY3xlbnwxfHx8fDE3NTkyNDU4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    isNew: true,
    description: "Elegant timepiece with leather strap and water resistance."
  },
  {
    id: "19",
    name: "Leather Belt",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1664286074176-5206ee5dc878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmVsdHxlbnwxfHx8fDE3NTkyNDU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    description: "Premium leather belt with classic buckle."
  },
  {
    id: "20",
    name: "Tote Bag",
    price: 59.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1590084955567-ba857f41d437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwY2FudmFzfGVufDF8fHx8MTc1OTE4MTc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    isOnSale: true,
    description: "Spacious canvas tote bag perfect for daily use."
  },
  {
    id: "21",
    name: "Premium Cotton T-Shirt",
    price: 34.99,
    originalPrice: 44.99,
    image: "https://images.unsplash.com/photo-1503256575996-7cbe509190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwbWVufGVufDF8fHx8MTc1OTM1MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    images: [
      "https://images.unsplash.com/photo-1503256575996-7cbe509190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwbWVufGVufDF8fHx8MTc1OTM1MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1650314094468-b8f9594c5a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwYmFja3xlbnwxfHx8fDE3NTkzNTM3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    ],
    category: "Men's Clothing",
    isOnSale: true,
    isNew: true,
    description: "Premium quality cotton t-shirt available in multiple vibrant colors. Each color variant comes with its own detailed product photos."
  },
  {
    id: "22",
    name: "Urban Hoodie",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1688111421205-a0a85415b224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBtZW4lMjBmYXNoaW9ufGVufDF8fHx8MTc1OTQxNDk0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Men's Clothing",
    isNew: true,
    description: "Comfortable urban hoodie with modern streetwear style and premium fabric."
  },
  {
    id: "23",
    name: "Leather Crossbody Bag",
    price: 69.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1709899629440-64da054379d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9zc2JvZHklMjBiYWclMjBsZWF0aGVyfGVufDF8fHx8MTc1OTQxNDk0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Accessories",
    isOnSale: true,
    description: "Stylish leather crossbody bag perfect for daily essentials."
  }
];

function AppContent() {
  const { user } = useUser();
  const { isSellerMode, setIsSellerMode, products: sellerProducts, recordSale } = useSeller();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'search' | 'category'>(
    'main'
  );
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [productReviews, setProductReviews] = useState<{ [productId: string]: Review[] }>(sampleReviews);
  const [bottomNavActive, setBottomNavActive] = useState<'home' | 'wishlist' | 'cart' | 'seller'>('home');
  
  // Quick links state
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isShippingInfoOpen, setIsShippingInfoOpen] = useState(false);
  const [isReturnsOpen, setIsReturnsOpen] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    categories: [],
    colors: [],
    priceRange: [0, 200],
    onSale: false,
    newArrivals: false,
    minRating: 0,
    sortBy: 'name'
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Use seller products (which sync with buyer view)
  const displayProducts = useMemo(() => {
    return sellerProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      images: product.images,
      category: product.category,
      description: product.description,
      isOnSale: product.isOnSale,
      isNew: product.isNew,
      reviews: productReviews[product.id] || [],
      averageRating: productReviews[product.id] 
        ? productReviews[product.id].reduce((sum, review) => sum + review.rating, 0) / productReviews[product.id].length
        : 0
    } as Product));
  }, [sellerProducts, productReviews]);

  // Enhanced products with reviews
  const productsWithReviews = displayProducts;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = productsWithReviews;

    // Category view filter (from navigation)
    if (currentCategory && currentCategory !== 'sale' && currentCategory !== 'new') {
      filtered = filtered.filter(product => product.category === currentCategory);
    } else if (currentCategory === 'sale') {
      filtered = filtered.filter(product => product.isOnSale);
    } else if (currentCategory === 'new') {
      filtered = filtered.filter(product => product.isNew);
    }

    // Search filter
    if (filters.searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Category filter (from filters panel)
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => filters.categories.includes(product.category));
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => {
        const productColors = sellerProducts.find(p => p.id === product.id)?.availableColors || [];
        return filters.colors.some(color => productColors.includes(color));
      });
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
  }, [productsWithReviews, filters, currentCategory]);

  const categories = Array.from(new Set(sampleProducts.map(p => p.category)));
  const availableColors = Array.from(new Set(displayProducts flatMap is invalid))