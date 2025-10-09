import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, Flame } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useSeller } from "../contexts/seller-context";
import { ProductCard, Product } from "./product-card";

interface TopProductsProps {
  products: Product[];
  onAddToCart: (product: Product, color?: string, size?: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistItems: string[];
  onProductClick: (product: Product) => void;
  limit?: number;
}

export function TopProducts({
  products,
  onAddToCart,
  onToggleWishlist,
  wishlistItems,
  onProductClick,
  limit = 6
}: TopProductsProps) {
  const { sales } = useSeller();

  // Calculate top products based on sales data
  const topProducts = useMemo(() => {
    // Aggregate sales by product
    const productSales: { [key: string]: { quantity: number; revenue: number } } = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { quantity: 0, revenue: 0 };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    // Get products with sales data and sort by quantity sold
    const productsWithSales = products
      .map(product => ({
        ...product,
        unitsSold: productSales[product.id]?.quantity || 0,
        revenue: productSales[product.id]?.revenue || 0
      }))
      .filter(product => product.unitsSold > 0)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, limit);

    return productsWithSales;
  }, [sales, products, limit]);

  // If no products have sales yet, show featured/new products instead
  // Prioritize newest products by sorting by ID (higher ID = newer)
  const displayProducts = topProducts.length > 0 
    ? topProducts 
    : products
        .filter(p => p.isNew || p.isOnSale)
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, limit);

  if (displayProducts.length === 0) {
    return null;
  }

  const { theme } = useTheme();
  return (
    <section className="pt-8 md:pt-16 pb-8 md:pb-8 bg-muted/20 border-t border-border/60">
      <div className="container mx-auto px-3 md:px-4">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
              {topProducts.length > 0 ? (
                <Flame className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
              ) : (
                <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              )}
              <h2 className="text-2xl md:text-3xl text-violet-700 dark:text-violet-300">
                {topProducts.length > 0
                  ? (theme === 'dark' ? 'Trending Tonight' : 'Trending Now')
                  : (theme === 'dark' ? 'Editor’s Picks' : 'Featured Products')}
              </h2>
            </div>
            <p className="text-sm md:text-base text-muted-foreground">
              {topProducts.length > 0 
                ? "Our most popular products based on customer purchases"
                : "Handpicked favorites for you"}
            </p>
          </div>
          {topProducts.length > 0 && (
            <Badge variant="secondary" className="hidden md:flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Based on {sales.length} sales
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          {displayProducts.map((product, index) => {
            const productWithSales = product as Product & { unitsSold?: number; revenue?: number };
            return (
              <div key={product.id} className="relative group">
                {/* Trending/Best Seller Badge - Over image */}
                {topProducts.length > 0 && productWithSales.unitsSold && (
                  <div className="absolute top-16 right-2 z-20">
                    <Badge 
                      variant={index === 0 ? "default" : "secondary"} 
                      className="flex items-center gap-1 shadow-md"
                    >
                      {index === 0 && <Flame className="w-3 h-3" />}
                      {index === 0 ? "Best Seller" : `#${index + 1}`}
                    </Badge>
                  </div>
                )}
                
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onToggleWishlist={onToggleWishlist}
                  isInWishlist={wishlistItems.includes(product.id)}
                  onProductClick={() => onProductClick(product)}
                />
                
                {/* Units Sold Badge - Below image area */}
                {topProducts.length > 0 && productWithSales.unitsSold && (
                  <div className="absolute bottom-20 right-2 z-20">
                    <Badge variant="outline" className="bg-background/95 backdrop-blur shadow-sm">
                      {productWithSales.unitsSold} sold
                    </Badge>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {topProducts.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Rankings updated based on recent sales activity
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
