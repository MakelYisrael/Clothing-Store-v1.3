import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useTheme } from "../contexts/theme-context";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Category {
  id: string;
  name: string;
  image: string;
  itemCount: number;
  categoryKey: string;
}

interface CategoriesSectionProps {
  onCategoryChange: (category: string | null) => void;
}

const categories: Category[] = [
  {
    id: "men",
    name: "Men's Collection",
    categoryKey: "Men's Clothing",
    image: "https://images.unsplash.com/photo-1603252110971-b8a57087be18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBjYXN1YWwlMjBzaGlydHxlbnwxfHx8fDE3NTkwOTA0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 120
  },
  {
    id: "women",
    name: "Women's Collection",
    categoryKey: "Women's Clothing",
    image: "https://images.unsplash.com/photo-1700158777421-2fd9263cec53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGRyZXNzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkxNDkzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 95
  },
  {
    id: "denim",
    name: "Denim Essentials",
    categoryKey: "Denim",
    image: "https://images.unsplash.com/photo-1617817435745-1eb486e641a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5MTUxNDE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 45
  },
  {
    id: "footwear",
    name: "Footwear",
    categoryKey: "Footwear",
    image: "https://images.unsplash.com/photo-1758702701300-372126112cb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHNob2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkwNzgzMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    itemCount: 80
  }
];

export function CategoriesSection({ onCategoryChange }: CategoriesSectionProps) {
  const handleCategoryClick = (categoryKey: string) => {
    onCategoryChange(categoryKey);
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { theme } = useTheme();
  return (
    <section id="categories" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">{theme === 'dark' ? 'Browse by Category' : 'Shop by Category'}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find exactly what you're looking for in our curated collections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card 
              key={category.id} 
              className="group cursor-card overflow-hidden border-0 shadow-sm hover-lift hover-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCategoryClick(category.categoryKey)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 group-hover:via-black/40 transition-all duration-300" />
                  
                  <div className="absolute inset-0 flex flex-col justify-end p-6 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-4">{category.itemCount} items</p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="self-start pulse-on-hover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCategoryClick(category.categoryKey);
                      }}
                    >
                      Shop Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
