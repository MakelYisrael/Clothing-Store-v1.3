import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CategoryHeroProps {
  category: string;
  productCount?: number;
}

const categoryContent: { [key: string]: { title: string; description: string; image: string } } = {
  "Men's Clothing": {
    title: "Men's Collection",
    description: "Discover timeless style with our curated men's collection featuring premium quality clothing",
    image: "https://images.unsplash.com/photo-1552252059-9d77e4059ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW4lMjBmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzU5MTUyOTc1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  "Women's Clothing": {
    title: "Women's Collection",
    description: "Elevate your wardrobe with elegant and contemporary pieces designed for the modern woman",
    image: "https://images.unsplash.com/photo-1708363390847-b4af54f45273?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGZhc2hpb24lMjBjbG90aGluZ3xlbnwxfHx8fDE3NTkyMTQxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  "Denim": {
    title: "Denim Essentials",
    description: "Premium denim crafted for comfort and durability. From classic jeans to modern jackets",
    image: "https://images.unsplash.com/photo-1714143136372-ddaf8b606da7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGplYW5zJTIwdGV4dHVyZXxlbnwxfHx8fDE3NTkyNDU4MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  "Footwear": {
    title: "Footwear Collection",
    description: "Step into style with our carefully selected range of shoes for every occasion",
    image: "https://images.unsplash.com/photo-1690505853909-8b75d0b05274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaG9lcyUyMGZvb3R3ZWFyJTIwZGlzcGxheXxlbnwxfHx8fDE3NTkyNDU4MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  "Accessories": {
    title: "Accessories",
    description: "Complete your look with our collection of premium accessories and essentials",
    image: "https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzU5MTc3OTQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  "sale": {
    title: "Sale",
    description: "Don't miss out on incredible deals. Save big on your favorite styles",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlJTIwc2hvcHBpbmclMjBkaXNjb3VudHxlbnwxfHx8fDE3NTkyNDU4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  "new": {
    title: "New Arrivals",
    description: "Be the first to discover our latest collection. Fresh styles just for you",
    image: "https://images.unsplash.com/photo-1614714053570-6c6b6aa54a6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjBmYXNoaW9uJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NTkyNDU4MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
};

export function CategoryHero({ category, productCount }: CategoryHeroProps) {
  const content = categoryContent[category];

  if (!content) return null;

  return (
    <div className="relative h-[300px] md:h-[400px] overflow-hidden bg-gray-900">
      <ImageWithFallback
        src={content.image}
        alt={content.title}
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white dark:text-indigo-200">{content.title}</h1>
          <p className="text-lg md:text-xl mb-2 max-w-2xl mx-auto">{content.description}</p>
          {productCount !== undefined && (
            <p className="text-sm md:text-base opacity-90">
              {productCount} {productCount === 1 ? 'product' : 'products'} available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
