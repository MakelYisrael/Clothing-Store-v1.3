import { ProductCard, Product } from "./product-card";
import { useTheme } from "../contexts/theme-context";

interface FeaturedProductsProps {
  products: Product[];
  onAddToCart: (product: Product, color?: string, size?: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlistItems: string[];
  onProductClick?: (product: Product) => void;
}

export function FeaturedProducts({ products, onAddToCart, onToggleWishlist, wishlistItems, onProductClick }: FeaturedProductsProps) {
  const { theme } = useTheme();
  return (
    <section id="featured-products" className="py-8 md:py-16">
      <div className="container mx-auto px-3 md:px-4">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-violet-700 dark:text-violet-300">{theme === 'dark' ? 'Editor’s Picks' : 'Featured Products'}</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of the season's most coveted pieces
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={wishlistItems.includes(product.id)}
              onProductClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
