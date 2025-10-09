import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ScrollIndicator } from "./scroll-indicator";

interface HeroSectionProps {
  onShopNow?: () => void;
  onViewCollection?: () => void;
}

export function HeroSection({ onShopNow, onViewCollection }: HeroSectionProps) {
  const handleShopNow = () => {
    if (onShopNow) {
      onShopNow();
    }
    // Scroll to featured products section
    const featuredSection = document.querySelector('#featured-products');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleViewCollection = () => {
    if (onViewCollection) {
      onViewCollection();
    }
    // Scroll to categories section
    const categoriesSection = document.querySelector('#categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative h-[60vh] md:h-[70vh] min-h-[400px] md:min-h-[500px] overflow-hidden border-b border-border/60">
      <ImageWithFallback
        src="https://images.unsplash.com/photo-1726128449240-6569b63355d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYm91dGlxdWUlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTkzMTYyNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        alt="Fashion Collection"
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white max-w-2xl px-6 md:px-4 animate-fade-in">
          <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 animate-slide-down">
            New Collection
          </h1>
          <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90 animate-slide-up">
            Discover the latest trends in fashion. Premium quality clothing for the modern lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-scale-in">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 pulse-on-hover hover-lift"
              onClick={handleShopNow}
            >
              Shop Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-black bg-transparent pulse-on-hover hover-lift"
              onClick={handleViewCollection}
            >
              View Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator - shows mouse on desktop, finger on mobile */}
      <div onClick={handleShopNow} className="cursor-button">
        <ScrollIndicator />
      </div>
    </section>
  );
}
