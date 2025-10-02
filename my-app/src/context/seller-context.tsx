import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ProductVariant {
  id: string;
  color: string;
  size: string;
  stock: number;
  sku?: string;
  images?: string[];
}

export interface ProductWithInventory {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  description?: string;
  isOnSale?: boolean;
  isNew?: boolean;
  variants: ProductVariant[];
  totalStock: number;
  availableColors: string[];
  availableSizes: string[];
}

export interface SaleItem {
  productId: string;
  productName: string;
  variantId?: string;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
  category: string;
}

export interface Sale {
  id: string;
  timestamp: Date;
  items: SaleItem[];
  totalAmount: number;
  orderId: string;
}

interface SellerContextType {
  products: ProductWithInventory[];
  sales: Sale[];
  addProduct: (product: Omit<ProductWithInventory, 'id' | 'totalStock'>) => void;
  updateProduct: (id: string, product: Partial<ProductWithInventory>) => void;
  deleteProduct: (id: string) => void;
  updateVariantStock: (productId: string, variantId: string, stock: number) => void;
  bulkUpdateVariantStock: (updates: { productId: string; variantId: string; stock: number }[]) => void;
  recordSale: (items: SaleItem[], orderId: string) => void;
  isSellerMode: boolean;
  setIsSellerMode: (mode: boolean) => void;
}

const SellerContext = createContext<SellerContextType | undefined>(undefined);

const generateSampleSales = (): Sale[] => {
  const sampleSales: Sale[] = [];
  const now = new Date();

  for (let i = 0; i < 45; i++) {
    const saleDate = new Date(now);
    saleDate.setDate(saleDate.getDate() - i);
    const dailySales = Math.floor(Math.random() * 4);

    for (let j = 0; j < dailySales; j++) {
      const saleTime = new Date(saleDate);
      saleTime.setHours(Math.floor(Math.random() * 24));
      saleTime.setMinutes(Math.floor(Math.random() * 60));

      const numItems = Math.floor(Math.random() * 3) + 1;
      const items: SaleItem[] = [];

      const productOptions = [
        { id: "1", name: "Classic White T-Shirt", price: 29.99, category: "Men's Clothing", colors: ["White", "Gray"], sizes: ["S", "M", "L", "XL"] },
        { id: "2", name: "Elegant Black Dress", price: 89.99, category: "Women's Clothing", colors: ["Black", "Navy"], sizes: ["XS", "S", "M", "L"] },
        { id: "3", name: "Premium Denim Jeans", price: 79.99, category: "Denim", colors: ["Blue", "Black"], sizes: ["28", "30", "32", "34", "36"] },
        { id: "4", name: "Athletic Sneakers", price: 129.99, category: "Footwear", colors: ["White", "Black"], sizes: ["7", "8", "9", "10", "11"] }
      ];

      for (let k = 0; k < numItems; k++) {
        const product = productOptions[Math.floor(Math.random() * productOptions.length)];
        const color = (product as any).colors[Math.floor(Math.random() * (product as any).colors.length)];
        const size = (product as any).sizes[Math.floor(Math.random() * (product as any).sizes.length)];
        const quantity = Math.floor(Math.random() * 2) + 1;
        const variantId = `v${product.id}-${Math.floor(Math.random() * 10) + 1}`;

        items.push({
          productId: product.id,
          productName: product.name,
          variantId,
          color,
          size,
          quantity,
          price: product.price,
          category: product.category
        });
      }

      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      sampleSales.push({
        id: `sale-${saleTime.getTime()}-${j}`,
        timestamp: saleTime,
        items,
        totalAmount,
        orderId: `ORDER-${saleTime.getTime()}-${j}`
      });
    }
  }

  return sampleSales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

export function SellerProvider({ children }: { children: ReactNode }) {
  const [isSellerMode, setIsSellerMode] = useState(false);
  const [sales, setSales] = useState<Sale[]>(generateSampleSales());
  const [products, setProducts] = useState<ProductWithInventory[]>([
    {
      id: "1",
      name: "Classic White T-Shirt",
      price: 29.99,
      originalPrice: 39.99,
      image: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkyNDU4NjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Men's Clothing",
      isOnSale: true,
      description: "A comfortable and versatile classic white t-shirt made from 100% cotton.",
      variants: [
        { id: "v1-1", color: "White", size: "S", stock: 25, sku: "CWT-S-W" },
        { id: "v1-2", color: "White", size: "M", stock: 40, sku: "CWT-M-W" },
        { id: "v1-3", color: "White", size: "L", stock: 35, sku: "CWT-L-W" },
        { id: "v1-4", color: "White", size: "XL", stock: 20, sku: "CWT-XL-W" },
        { id: "v1-5", color: "Gray", size: "S", stock: 15, sku: "CWT-S-G" },
        { id: "v1-6", color: "Gray", size: "M", stock: 30, sku: "CWT-M-G" },
        { id: "v1-7", color: "Gray", size: "L", stock: 25, sku: "CWT-L-G" },
        { id: "v1-8", color: "Gray", size: "XL", stock: 18, sku: "CWT-XL-G" },
      ],
      totalStock: 208,
      availableColors: ["White", "Gray"],
      availableSizes: ["S", "M", "L", "XL"]
    },
    {
      id: "2",
      name: "Elegant Black Dress",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1759090988109-2ed7abd1eefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGRyZXNzJTIwZWxlZ2FudHxlbnwxfHx8fDE3NTkxNzQ2NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Women's Clothing",
      isNew: true,
      description: "An elegant black dress perfect for evening events and special occasions.",
      variants: [
        { id: "v2-1", color: "Black", size: "XS", stock: 12, sku: "EBD-XS-B" },
        { id: "v2-2", color: "Black", size: "S", stock: 20, sku: "EBD-S-B" },
        { id: "v2-3", color: "Black", size: "M", stock: 25, sku: "EBD-M-B" },
        { id: "v2-4", color: "Black", size: "L", stock: 18, sku: "EBD-L-B" },
        { id: "v2-5", color: "Navy", size: "XS", stock: 8, sku: "EBD-XS-N" },
        { id: "v2-6", color: "Navy", size: "S", stock: 15, sku: "EBD-S-N" },
        { id: "v2-7", color: "Navy", size: "M", stock: 20, sku: "EBD-M-N" },
        { id: "v2-8", color: "Navy", size: "L", stock: 12, sku: "EBD-L-N" },
      ],
      totalStock: 130,
      availableColors: ["Black", "Navy"],
      availableSizes: ["XS", "S", "M", "L"]
    },
    {
      id: "3",
      name: "Premium Denim Jeans",
      price: 79.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1713880442898-0f151fba5e16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwamVhbnMlMjBkZW5pbXxlbnwxfHx8fDE3NTkyNDU4NjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Denim",
      isOnSale: true,
      description: "Premium quality denim jeans with perfect fit and durability.",
      variants: [
        { id: "v3-1", color: "Blue", size: "28", stock: 18, sku: "PDJ-28-B" },
        { id: "v3-2", color: "Blue", size: "30", stock: 30, sku: "PDJ-30-B" },
        { id: "v3-3", color: "Blue", size: "32", stock: 35, sku: "PDJ-32-B" },
        { id: "v3-4", color: "Blue", size: "34", stock: 28, sku: "PDJ-34-B" },
        { id: "v3-5", color: "Blue", size: "36", stock: 20, sku: "PDJ-36-B" },
        { id: "v3-6", color: "Black", size: "28", stock: 15, sku: "PDJ-28-BK" },
        { id: "v3-7", color: "Black", size: "30", stock: 25, sku: "PDJ-30-BK" },
        { id: "v3-8", color: "Black", size: "32", stock: 30, sku: "PDJ-32-BK" },
        { id: "v3-9", color: "Black", size: "34", stock: 22, sku: "PDJ-34-BK" },
        { id: "v3-10", color: "Black", size: "36", stock: 18, sku: "PDJ-36-BK" },
      ],
      totalStock: 241,
      availableColors: ["Blue", "Black"],
      availableSizes: ["28", "30", "32", "34", "36"]
    },
    {
      id: "4",
      name: "Athletic Sneakers",
      price: 129.99,
      image: "https://images.unsplash.com/photo-1719523677291-a395426c1a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMGF0aGxldGljJTIwc2hvZXN8ZW58MXx8fHwxNzU5MjQ1ODYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Footwear",
      isNew: true,
      description: "High-performance athletic sneakers with superior comfort.",
      variants: [
        { id: "v4-1", color: "White", size: "7", stock: 15, sku: "AS-7-W" },
        { id: "v4-2", color: "White", size: "8", stock: 25, sku: "AS-8-W" },
        { id: "v4-3", color: "White", size: "9", stock: 30, sku: "AS-9-W" },
        { id: "v4-4", color: "White", size: "10", stock: 28, sku: "AS-10-W" },
        { id: "v4-5", color: "White", size: "11", stock: 20, sku: "AS-11-W" },
        { id: "v4-6", color: "Black", size: "7", stock: 12, sku: "AS-7-B" },
        { id: "v4-7", color: "Black", size: "8", stock: 22, sku: "AS-8-B" },
        { id: "v4-8", color: "Black", size: "9", stock: 28, sku: "AS-9-B" },
        { id: "v4-9", color: "Black", size: "10", stock: 25, sku: "AS-10-B" },
        { id: "v4-10", color: "Black", size: "11", stock: 18, sku: "AS-11-B" },
      ],
      totalStock: 223,
      availableColors: ["White", "Black"],
      availableSizes: ["7", "8", "9", "10", "11"]
    },
    {
      id: "21",
      name: "Premium Cotton T-Shirt",
      price: 34.99,
      originalPrice: 44.99,
      image: "https://images.unsplash.com/photo-1503256575996-7cbe509190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwbWVufGVufDF8fHx8MTc1OTM1MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Men's Clothing",
      isOnSale: true,
      isNew: true,
      description: "Premium quality cotton t-shirt available in multiple vibrant colors. Each color variant comes with its own detailed product photos.",
      variants: [
        { id: "v21-1", color: "Blue", size: "S", stock: 20, sku: "PCT-S-BL", images: [
          "https://images.unsplash.com/photo-1503256575996-7cbe509190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwbWVufGVufDF8fHx8MTc1OTM1MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1650314094468-b8f9594c5a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwYmFja3xlbnwxfHx8fDE3NTkzNTM3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-2", color: "Blue", size: "M", stock: 35, sku: "PCT-M-BL", images: [
          "https://images.unsplash.com/photo-1503256575996-7cbe509190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwbWVufGVufDF8fHx8MTc1OTM1MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1650314094468-b8f9594c5a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwYmFja3xlbnwxfHx8fDE3NTkzNTM3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-3", color: "Blue", size: "L", stock: 30, sku: "PCT-L-BL", images: [
          "https://images.unsplash.com/photo-1503256575996-7cbe509190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwbWVufGVufDF8fHx8MTc1OTM1MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1650314094468-b8f9594c5a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwYmFja3xlbnwxfHx8fDE3NTkzNTM3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-4", color: "Blue", size: "XL", stock: 22, sku: "PCT-XL-BL", images: [
          "https://images.unsplash.com/photo-1503256575996-7cbe509190b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwbWVufGVufDF8fHx8MTc1OTM1MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1650314094468-b8f9594c5a46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwdHNoaXJ0JTIwYmFja3xlbnwxfHx8fDE3NTkzNTM3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-5", color: "Black", size: "S", stock: 18, sku: "PCT-S-BK", images: [
          "https://images.unsplash.com/photo-1667744565777-fa2eb22adeeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkzNTM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1662103627854-ae7551d1eddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMGRldGFpbHxlbnwxfHx8fDE3NTkzNTM3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-6", color: "Black", size: "M", stock: 32, sku: "PCT-M-BK", images: [
          "https://images.unsplash.com/photo-1667744565777-fa2eb22adeeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkzNTM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1662103627854-ae7551d1eddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMGRldGFpbHxlbnwxfHx8fDE3NTkzNTM3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-7", color: "Black", size: "L", stock: 28, sku: "PCT-L-BK", images: [
          "https://images.unsplash.com/photo-1667744565777-fa2eb22adeeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkzNTM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1662103627854-ae7551d1eddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMGRldGFpbHxlbnwxfHx8fDE3NTkzNTM3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-8", color: "Black", size: "XL", stock: 20, sku: "PCT-XL-BK", images: [
          "https://images.unsplash.com/photo-1667744565777-fa2eb22adeeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkzNTM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1662103627854-ae7551d1eddb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMHRzaGlydCUyMGRldGFpbHxlbnwxfHx8fDE3NTkzNTM3MjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-9", color: "Red", size: "S", stock: 16, sku: "PCT-S-RD", images: [
          "https://images.unsplash.com/photo-1634849112476-88cb7e60392b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0c2hpcnQlMjBtZW58ZW58MXx8fHwxNzU5MzUzNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1611211081285-bd02a70f8b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0c2hpcnQlMjBmb2xkfGVufDF8fHx8MTc1OTM1MzcyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-10", color: "Red", size: "M", stock: 28, sku: "PCT-M-RD", images: [
          "https://images.unsplash.com/photo-1634849112476-88cb7e60392b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0c2hpcnQlMjBtZW58ZW58MXx8fHwxNzU5MzUzNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1611211081285-bd02a70f8b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0c2hpcnQlMjBmb2xkfGVufDF8fHx8MTc1OTM1MzcyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-11", color: "Red", size: "L", stock: 24, sku: "PCT-L-RD", images: [
          "https://images.unsplash.com/photo-1634849112476-88cb7e60392b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0c2hpcnQlMjBtZW58ZW58MXx8fHwxNzU5MzUzNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1611211081285-bd02a70f8b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0c2hpcnQlMjBmb2xkfGVufDF8fHx8MTc1OTM1MzcyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-12", color: "Red", size: "XL", stock: 18, sku: "PCT-XL-RD", images: [
          "https://images.unsplash.com/photo-1634849112476-88cb7e60392b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0c2hpcnQlMjBtZW58ZW58MXx8fHwxNzU5MzUzNzE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1611211081285-bd02a70f8b27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjB0c2hpcnQlMjBmb2xkfGVufDF8fHx8MTc1OTM1MzcyM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-13", color: "Green", size: "S", stock: 14, sku: "PCT-S-GR", images: [
          "https://images.unsplash.com/photo-1545292621-377089fbcbb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkzNTM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1669199583326-c104a1e18135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRzaGlydCUyMGRldGFpbHxlbnwxfHx8fDE3NTkzNTM3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-14", color: "Green", size: "M", stock: 26, sku: "PCT-M-GR", images: [
          "https://images.unsplash.com/photo-1545292621-377089fbcbb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkzNTM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1669199583326-c104a1e18135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRzaGlydCUyMGRldGFpbHxlbnwxfHx8fDE3NTkzNTM3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-15", color: "Green", size: "L", stock: 22, sku: "PCT-L-GR", images: [
          "https://images.unsplash.com/photo-1545292621-377089fbcbb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkzNTM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1669199583326-c104a1e18135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRzaGlydCUyMGRldGFpbHxlbnwxfHx8fDE3NTkzNTM3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-16", color: "Green", size: "XL", stock: 16, sku: "PCT-XL-GR", images: [
          "https://images.unsplash.com/photo-1545292621-377089fbcbb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRzaGlydCUyMG1lbnxlbnwxfHx8fDE3NTkzNTM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1669199583326-c104a1e18135?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHRzaGlydCUyMGRldGFpbHxlbnwxfHx8fDE3NTkzNTM3MjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-17", color: "White", size: "S", stock: 22, sku: "PCT-S-WH", images: [
          "https://images.unsplash.com/photo-1722782048747-77a545ee8c52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1lbiUyMGNsb3NlfGVufDF8fHx8MTc1OTM1MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1667544707240-598d5e4f4c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMHRleHR1cmV8ZW58MXx8fHwxNzU5MzUzNzI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-18", color: "White", size: "M", stock: 38, sku: "PCT-M-WH", images: [
          "https://images.unsplash.com/photo-1722782048747-77a545ee8c52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1lbiUyMGNsb3NlfGVufDF8fHx8MTc1OTM1MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1667544707240-598d5e4f4c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMHRleHR1cmV8ZW58MXx8fHwxNzU5MzUzNzI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-19", color: "White", size: "L", stock: 33, sku: "PCT-L-WH", images: [
          "https://images.unsplash.com/photo-1722782048747-77a545ee8c52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1lbiUyMGNsb3NlfGVufDF8fHx8MTc1OTM1MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1667544707240-598d5e4f4c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMHRleHR1cmV8ZW58MXx8fHwxNzU5MzUzNzI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] },
        { id: "v21-20", color: "White", size: "XL", stock: 25, sku: "PCT-XL-WH", images: [
          "https://images.unsplash.com/photo-1722782048747-77a545ee8c52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMG1lbiUyMGNsb3NlfGVufDF8fHx8MTc1OTM1MzcxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
          "https://images.unsplash.com/photo-1667544707240-598d5e4f4c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHRzaGlydCUyMHRleHR1cmV8ZW58MXx8fHwxNzU5MzUzNzI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        ] }
      ],
      totalStock: 455,
      availableColors: ["Blue", "Black", "Red", "Green", "White"],
      availableSizes: ["S", "M", "L", "XL"]
    },
    {
      id: "5",
      name: "Casual Button-Up Shirt",
      price: 59.99,
      image: "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXR0b24lMjBzaGlydCUyMGNhc3VhbHxlbnwxfHx8fDE3NTkyNDU4NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Men's Clothing",
      description: "A versatile button-up shirt perfect for casual or semi-formal occasions.",
      variants: [
        { id: "v5-1", color: "Blue", size: "S", stock: 18, sku: "CBS-S-BL" },
        { id: "v5-2", color: "Blue", size: "M", stock: 28, sku: "CBS-M-BL" },
        { id: "v5-3", color: "Blue", size: "L", stock: 25, sku: "CBS-L-BL" },
        { id: "v5-4", color: "Blue", size: "XL", stock: 20, sku: "CBS-XL-BL" },
        { id: "v5-5", color: "White", size: "S", stock: 20, sku: "CBS-S-W" },
        { id: "v5-6", color: "White", size: "M", stock: 30, sku: "CBS-M-W" },
        { id: "v5-7", color: "White", size: "L", stock: 27, sku: "CBS-L-W" },
        { id: "v5-8", color: "White", size: "XL", stock: 22, sku: "CBS-XL-W" },
      ],
      totalStock: 190,
      availableColors: ["Blue", "White"],
      availableSizes: ["S", "M", "L", "XL"]
    },
    {
      id: "6",
      name: "Summer Floral Dress",
      price: 69.99,
      originalPrice: 89.99,
      image: "https://images.unsplash.com/photo-1578404449256-0de908ee34ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9yYWwlMjBkcmVzcyUyMHN1bW1lcnxlbnwxfHx8fDE3NTkyNDU4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Women's Clothing",
      isOnSale: true,
      description: "Bright and beautiful summer dress with floral patterns.",
      variants: [
        { id: "v6-1", color: "Floral", size: "XS", stock: 15, sku: "SFD-XS-F" },
        { id: "v6-2", color: "Floral", size: "S", stock: 22, sku: "SFD-S-F" },
        { id: "v6-3", color: "Floral", size: "M", stock: 28, sku: "SFD-M-F" },
        { id: "v6-4", color: "Floral", size: "L", stock: 20, sku: "SFD-L-F" },
      ],
      totalStock: 85,
      availableColors: ["Floral"],
      availableSizes: ["XS", "S", "M", "L"]
    },
    {
      id: "7",
      name: "Vintage Denim Jacket",
      price: 99.99,
      image: "https://images.unsplash.com/photo-1563339387-0ba9892a3f84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW5pbSUyMGphY2tldCUyMHZpbnRhZ2V8ZW58MXx8fHwxNzU5MTMwMTgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Denim",
      isNew: true,
      description: "Classic vintage-style denim jacket for timeless fashion.",
      variants: [
        { id: "v7-1", color: "Light Blue", size: "S", stock: 12, sku: "VDJ-S-LB" },
        { id: "v7-2", color: "Light Blue", size: "M", stock: 20, sku: "VDJ-M-LB" },
        { id: "v7-3", color: "Light Blue", size: "L", stock: 18, sku: "VDJ-L-LB" },
        { id: "v7-4", color: "Light Blue", size: "XL", stock: 15, sku: "VDJ-XL-LB" },
        { id: "v7-5", color: "Dark Blue", size: "S", stock: 10, sku: "VDJ-S-DB" },
        { id: "v7-6", color: "Dark Blue", size: "M", stock: 18, sku: "VDJ-M-DB" },
        { id: "v7-7", color: "Dark Blue", size: "L", stock: 16, sku: "VDJ-L-DB" },
        { id: "v7-8", color: "Dark Blue", size: "XL", stock: 13, sku: "VDJ-XL-DB" },
      ],
      totalStock: 122,
      availableColors: ["Light Blue", "Dark Blue"],
      availableSizes: ["S", "M", "L", "XL"]
    },
    {
      id: "8",
      name: "Running Shoes",
      price: 109.99,
      originalPrice: 139.99,
      image: "https://images.unsplash.com/photo-1709258228137-19a8c193be39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBzcG9ydHxlbnwxfHx8fDE3NTkyNDA4MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Footwear",
      isOnSale: true,
      description: "Lightweight running shoes designed for optimal performance.",
      variants: [
        { id: "v8-1", color: "Gray", size: "7", stock: 14, sku: "RS-7-G" },
        { id: "v8-2", color: "Gray", size: "8", stock: 20, sku: "RS-8-G" },
        { id: "v8-3", color: "Gray", size: "9", stock: 25, sku: "RS-9-G" },
        { id: "v8-4", color: "Gray", size: "10", stock: 22, sku: "RS-10-G" },
        { id: "v8-5", color: "Gray", size: "11", stock: 18, sku: "RS-11-G" },
        { id: "v8-6", color: "Blue", size: "7", stock: 12, sku: "RS-7-B" },
        { id: "v8-7", color: "Blue", size: "8", stock: 18, sku: "RS-8-B" },
        { id: "v8-8", color: "Blue", size: "9", stock: 23, sku: "RS-9-B" },
        { id: "v8-9", color: "Blue", size: "10", stock: 20, sku: "RS-10-B" },
        { id: "v8-10", color: "Blue", size: "11", stock: 16, sku: "RS-11-B" },
      ],
      totalStock: 188,
      availableColors: ["Gray", "Blue"],
      availableSizes: ["7", "8", "9", "10", "11"]
    },
    {
      id: "9",
      name: "Men's Polo Shirt",
      price: 45.99,
      image: "https://images.unsplash.com/photo-1706007647543-460bfa7db776?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2xvJTIwc2hpcnQlMjBtZW58ZW58MXx8fHwxNzU5MTM1NTI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Men's Clothing",
      isNew: true,
      description: "Classic polo shirt with modern fit and premium cotton fabric.",
      variants: [
        { id: "v9-1", color: "Navy", size: "S", stock: 20, sku: "PS-S-N" },
        { id: "v9-2", color: "Navy", size: "M", stock: 30, sku: "PS-M-N" },
        { id: "v9-3", color: "Navy", size: "L", stock: 28, sku: "PS-L-N" },
        { id: "v9-4", color: "Navy", size: "XL", stock: 22, sku: "PS-XL-N" },
        { id: "v9-5", color: "White", size: "S", stock: 18, sku: "PS-S-W" },
        { id: "v9-6", color: "White", size: "M", stock: 28, sku: "PS-M-W" },
        { id: "v9-7", color: "White", size: "L", stock: 25, sku: "PS-L-W" },
        { id: "v9-8", color: "White", size: "XL", stock: 20, sku: "PS-XL-W" },
      ],
      totalStock: 191,
      availableColors: ["Navy", "White"],
      availableSizes: ["S", "M", "L", "XL"]
    },
    {
      id: "10",
      name: "Men's Chino Pants",
      price: 69.99,
      originalPrice: 89.99,
      image: "https://images.unsplash.com/photo-1586605728676-f0375b3af670?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlubyUyMHBhbnRzJTIwYmVpZ2V8ZW58MXx8fHwxNzU5MjQ1ODcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Men's Clothing",
      isOnSale: true,
      description: "Comfortable and stylish chino pants for everyday wear.",
      variants: [
        { id: "v10-1", color: "Beige", size: "30", stock: 18, sku: "CP-30-BE" },
        { id: "v10-2", color: "Beige", size: "32", stock: 28, sku: "CP-32-BE" },
        { id: "v10-3", color: "Beige", size: "34", stock: 25, sku: "CP-34-BE" },
        { id: "v10-4", color: "Beige", size: "36", stock: 20, sku: "CP-36-BE" },
        { id: "v10-5", color: "Navy", size: "30", stock: 16, sku: "CP-30-N" },
        { id: "v10-6", color: "Navy", size: "32", stock: 26, sku: "CP-32-N" },
        { id: "v10-7", color: "Navy", size: "34", stock: 23, sku: "CP-34-N" },
        { id: "v10-8", color: "Navy", size: "36", stock: 18, sku: "CP-36-N" },
      ],
      totalStock: 174,
      availableColors: ["Beige", "Navy"],
      availableSizes: ["30", "32", "34", "36"]
    },
    {
      id: "11",
      name: "Women's Blouse",
      price: 54.99,
      image: "https://images.unsplash.com/photo-1685338336656-e10a7bb3e12a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMGJsb3VzZSUyMGZhc2hpb258ZW58MXx8fHwxNzU5MjQ1ODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Women's Clothing",
      isNew: true,
      description: "Elegant blouse perfect for professional and casual settings.",
      variants: [
        { id: "v11-1", color: "White", size: "XS", stock: 15, sku: "WB-XS-W" },
        { id: "v11-2", color: "White", size: "S", stock: 22, sku: "WB-S-W" },
        { id: "v11-3", color: "White", size: "M", stock: 28, sku: "WB-M-W" },
        { id: "v11-4", color: "White", size: "L", stock: 20, sku: "WB-L-W" },
        { id: "v11-5", color: "Pink", size: "XS", stock: 12, sku: "WB-XS-P" },
        { id: "v11-6", color: "Pink", size: "S", stock: 20, sku: "WB-S-P" },
        { id: "v11-7", color: "Pink", size: "M", stock: 25, sku: "WB-M-P" },
        { id: "v11-8", color: "Pink", size: "L", stock: 18, sku: "WB-L-P" },
      ],
      totalStock: 160,
      availableColors: ["White", "Pink"],
      availableSizes: ["XS", "S", "M", "L"]
    },
    {
      id: "12",
      name: "Women's Skirt",
      price: 49.99,
      image: "https://images.unsplash.com/photo-1637227314917-3c0f595c3596?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNraXJ0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkyMjIxOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Women's Clothing",
      description: "A-line skirt with modern silhouette and comfortable fit.",
      variants: [
        { id: "v12-1", color: "Black", size: "XS", stock: 14, sku: "WS-XS-B" },
        { id: "v12-2", color: "Black", size: "S", stock: 20, sku: "WS-S-B" },
        { id: "v12-3", color: "Black", size: "M", stock: 25, sku: "WS-M-B" },
        { id: "v12-4", color: "Black", size: "L", stock: 18, sku: "WS-L-B" },
        { id: "v12-5", color: "Gray", size: "XS", stock: 12, sku: "WS-XS-G" },
        { id: "v12-6", color: "Gray", size: "S", stock: 18, sku: "WS-S-G" },
        { id: "v12-7", color: "Gray", size: "M", stock: 22, sku: "WS-M-G" },
        { id: "v12-8", color: "Gray", size: "L", stock: 16, sku: "WS-L-G" },
      ],
      totalStock: 145,
      availableColors: ["Black", "Gray"],
      availableSizes: ["XS", "S", "M", "L"]
    },
    {
      id: "13",
      name: "Slim Fit Denim",
      price: 74.99,
      image: "https://images.unsplash.com/photo-1555689502-c4b22d76c56f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGltJTIwZml0JTIwamVhbnN8ZW58MXx8fHwxNzU5MjQ1ODczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Denim",
      description: "Modern slim fit denim jeans for a contemporary look.",
      variants: [
        { id: "v13-1", color: "Dark Blue", size: "28", stock: 15, sku: "SFD-28-DB" },
        { id: "v13-2", color: "Dark Blue", size: "30", stock: 25, sku: "SFD-30-DB" },
        { id: "v13-3", color: "Dark Blue", size: "32", stock: 30, sku: "SFD-32-DB" },
        { id: "v13-4", color: "Dark Blue", size: "34", stock: 25, sku: "SFD-34-DB" },
        { id: "v13-5", color: "Dark Blue", size: "36", stock: 18, sku: "SFD-36-DB" },
        { id: "v13-6", color: "Black", size: "28", stock: 12, sku: "SFD-28-B" },
        { id: "v13-7", color: "Black", size: "30", stock: 22, sku: "SFD-30-B" },
        { id: "v13-8", color: "Black", size: "32", stock: 28, sku: "SFD-32-B" },
        { id: "v13-9", color: "Black", size: "34", stock: 23, sku: "SFD-34-B" },
        { id: "v13-10", color: "Black", size: "36", stock: 16, sku: "SFD-36-B" },
      ],
      totalStock: 214,
      availableColors: ["Dark Blue", "Black"],
      availableSizes: ["28", "30", "32", "34", "36"]
    },
    {
      id: "14",
      name: "Casual Sneakers",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1582231640349-6ea6881fabeb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBzbmVha2VycyUyMHdoaXRlfGVufDF8fHx8MTc1OTIzMjgwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Footwear",
      description: "Versatile sneakers perfect for everyday wear.",
      variants: [
        { id: "v14-1", color: "White", size: "7", stock: 18, sku: "CS-7-W" },
        { id: "v14-2", color: "White", size: "8", stock: 25, sku: "CS-8-W" },
        { id: "v14-3", color: "White", size: "9", stock: 30, sku: "CS-9-W" },
        { id: "v14-4", color: "White", size: "10", stock: 28, sku: "CS-10-W" },
        { id: "v14-5", color: "White", size: "11", stock: 20, sku: "CS-11-W" },
        { id: "v14-6", color: "Gray", size: "7", stock: 15, sku: "CS-7-G" },
        { id: "v14-7", color: "Gray", size: "8", stock: 22, sku: "CS-8-G" },
        { id: "v14-8", color: "Gray", size: "9", stock: 28, sku: "CS-9-G" },
        { id: "v14-9", color: "Gray", size: "10", stock: 25, sku: "CS-10-G" },
        { id: "v14-10", color: "Gray", size: "11", stock: 18, sku: "CS-11-G" },
      ],
      totalStock: 229,
      availableColors: ["White", "Gray"],
      availableSizes: ["7", "8", "9", "10", "11"]
    },
    {
      id: "15",
      name: "Leather Boots",
      price: 159.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1638158980051-f7e67291efed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYm9vdHMlMjBicm93bnxlbnwxfHx8fDE3NTkxNTYxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Footwear",
      isOnSale: true,
      description: "Premium leather boots with timeless design.",
      variants: [
        { id: "v15-1", color: "Brown", size: "7", stock: 12, sku: "LB-7-BR" },
        { id: "v15-2", color: "Brown", size: "8", stock: 18, sku: "LB-8-BR" },
        { id: "v15-3", color: "Brown", size: "9", stock: 22, sku: "LB-9-BR" },
        { id: "v15-4", color: "Brown", size: "10", stock: 20, sku: "LB-10-BR" },
        { id: "v15-5", color: "Brown", size: "11", stock: 15, sku: "LB-11-BR" },
        { id: "v15-6", color: "Black", size: "7", stock: 10, sku: "LB-7-B" },
        { id: "v15-7", color: "Black", size: "8", stock: 16, sku: "LB-8-B" },
        { id: "v15-8", color: "Black", size: "9", stock: 20, sku: "LB-9-B" },
        { id: "v15-9", color: "Black", size: "10", stock: 18, sku: "LB-10-B" },
        { id: "v15-10", color: "Black", size: "11", stock: 13, sku: "LB-11-B" },
      ],
      totalStock: 164,
      availableColors: ["Brown", "Black"],
      availableSizes: ["7", "8", "9", "10", "11"]
    },
    {
      id: "16",
      name: "Leather Wallet",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1627123424574-724758594e93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwd2FsbGV0fGVufDF8fHx8MTc1OTI0NTg3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Accessories",
      description: "Genuine leather wallet with multiple card slots.",
      variants: [
        { id: "v16-1", color: "Brown", size: "One Size", stock: 50, sku: "LW-OS-BR" },
        { id: "v16-2", color: "Black", size: "One Size", stock: 60, sku: "LW-OS-B" },
      ],
      totalStock: 110,
      availableColors: ["Brown", "Black"],
      availableSizes: ["One Size"]
    },
    {
      id: "17",
      name: "Designer Sunglasses",
      price: 149.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1718967807816-414e2f9bc95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTkyMjU1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Accessories",
      isOnSale: true,
      description: "Stylish sunglasses with UV protection.",
      variants: [
        { id: "v17-1", color: "Black", size: "One Size", stock: 45, sku: "DS-OS-B" },
        { id: "v17-2", color: "Tortoise", size: "One Size", stock: 35, sku: "DS-OS-T" },
      ],
      totalStock: 80,
      availableColors: ["Black", "Tortoise"],
      availableSizes: ["One Size"]
    },
    {
      id: "18",
      name: "Classic Watch",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1667375565651-b660b574d1a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cmlzdCUyMHdhdGNoJTIwY2xhc3NpY3xlbnwxfHx8fDE3NTkyNDU4NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Accessories",
      isNew: true,
      description: "Elegant timepiece with leather strap and water resistance.",
      variants: [
        { id: "v18-1", color: "Silver", size: "One Size", stock: 30, sku: "CW-OS-S" },
        { id: "v18-2", color: "Gold", size: "One Size", stock: 25, sku: "CW-OS-G" },
      ],
      totalStock: 55,
      availableColors: ["Silver", "Gold"],
      availableSizes: ["One Size"]
    },
    {
      id: "19",
      name: "Leather Belt",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1664286074176-5206ee5dc878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwYmVsdHxlbnwxfHx8fDE3NTkyNDU4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Accessories",
      description: "Premium leather belt with classic buckle.",
      variants: [
        { id: "v19-1", color: "Brown", size: "32", stock: 20, sku: "LB-32-BR" },
        { id: "v19-2", color: "Brown", size: "34", stock: 25, sku: "LB-34-BR" },
        { id: "v19-3", color: "Brown", size: "36", stock: 22, sku: "LB-36-BR" },
        { id: "v19-4", color: "Brown", size: "38", stock: 18, sku: "LB-38-BR" },
        { id: "v19-5", color: "Black", size: "32", stock: 22, sku: "LB-32-B" },
        { id: "v19-6", color: "Black", size: "34", stock: 28, sku: "LB-34-B" },
        { id: "v19-7", color: "Black", size: "36", stock: 24, sku: "LB-36-B" },
        { id: "v19-8", color: "Black", size: "38", stock: 20, sku: "LB-38-B" },
      ],
      totalStock: 179,
      availableColors: ["Brown", "Black"],
      availableSizes: ["32", "34", "36", "38"]
    },
    {
      id: "20",
      name: "Tote Bag",
      price: 59.99,
      originalPrice: 79.99,
      image: "https://images.unsplash.com/photo-1590084955567-ba857f41d437?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3RlJTIwYmFnJTIwY2FudmFzfGVufDF8fHx8MTc1OTE4MTc5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Accessories",
      isOnSale: true,
      description: "Spacious canvas tote bag perfect for daily use.",
      variants: [
        { id: "v20-1", color: "Beige", size: "One Size", stock: 40, sku: "TB-OS-BE" },
        { id: "v20-2", color: "Black", size: "One Size", stock: 45, sku: "TB-OS-B" },
        { id: "v20-3", color: "Navy", size: "One Size", stock: 35, sku: "TB-OS-N" },
      ],
      totalStock: 120,
      availableColors: ["Beige", "Black", "Navy"],
      availableSizes: ["One Size"]
    },
    {
      id: "22",
      name: "Urban Hoodie",
      price: 79.99,
      image: "https://images.unsplash.com/photo-1688111421205-a0a85415b224?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob29kaWUlMjBtZW4lMjBmYXNoaW9ufGVufDF8fHx8MTc1OTQxNDk0N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Men's Clothing",
      isNew: true,
      description: "Comfortable urban hoodie with modern streetwear style and premium fabric.",
      variants: [
        { id: "v22-1", color: "Black", size: "S", stock: 25, sku: "UH-S-B" },
        { id: "v22-2", color: "Black", size: "M", stock: 35, sku: "UH-M-B" },
        { id: "v22-3", color: "Black", size: "L", stock: 32, sku: "UH-L-B" },
        { id: "v22-4", color: "Black", size: "XL", stock: 28, sku: "UH-XL-B" },
        { id: "v22-5", color: "Gray", size: "S", stock: 22, sku: "UH-S-G" },
        { id: "v22-6", color: "Gray", size: "M", stock: 32, sku: "UH-M-G" },
        { id: "v22-7", color: "Gray", size: "L", stock: 30, sku: "UH-L-G" },
        { id: "v22-8", color: "Gray", size: "XL", stock: 26, sku: "UH-XL-G" },
        { id: "v22-9", color: "Navy", size: "S", stock: 20, sku: "UH-S-N" },
        { id: "v22-10", color: "Navy", size: "M", stock: 30, sku: "UH-M-N" },
        { id: "v22-11", color: "Navy", size: "L", stock: 28, sku: "UH-L-N" },
        { id: "v22-12", color: "Navy", size: "XL", stock: 24, sku: "UH-XL-N" },
      ],
      totalStock: 332,
      availableColors: ["Black", "Gray", "Navy"],
      availableSizes: ["S", "M", "L", "XL"]
    },
    {
      id: "23",
      name: "Leather Crossbody Bag",
      price: 69.99,
      originalPrice: 99.99,
      image: "https://images.unsplash.com/photo-1709899629440-64da054379d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9zc2JvZHklMjBiYWclMjBsZWF0aGVyfGVufDF8fHx8MTc1OTQxNDk0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      category: "Accessories",
      isOnSale: true,
      description: "Stylish leather crossbody bag perfect for daily essentials.",
      variants: [
        { id: "v23-1", color: "Brown", size: "One Size", stock: 40, sku: "LCB-OS-BR" },
        { id: "v23-2", color: "Black", size: "One Size", stock: 50, sku: "LCB-OS-B" },
        { id: "v23-3", color: "Tan", size: "One Size", stock: 35, sku: "LCB-OS-T" },
      ],
      totalStock: 125,
      availableColors: ["Brown", "Black", "Tan"],
      availableSizes: ["One Size"]
    }
  ]);

  const addProduct = (productData: Omit<ProductWithInventory, 'id' | 'totalStock'>) => {
    const newProduct: ProductWithInventory = {
      ...productData,
      id: `product-${Date.now()}`,
      totalStock: productData.variants.reduce((sum, v) => sum + v.stock, 0)
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<ProductWithInventory>) => {
    setProducts(prev => prev.map(product => {
      if (product.id === id) {
        const updated = { ...product, ...updates } as ProductWithInventory;
        if (updates.variants) {
          updated.totalStock = updates.variants.reduce((sum, v) => sum + v.stock, 0);
        }
        return updated;
      }
      return product;
    }));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const updateVariantStock = (productId: string, variantId: string, stock: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const updatedVariants = product.variants.map(v => 
          v.id === variantId ? { ...v, stock } : v
        );
        return {
          ...product,
          variants: updatedVariants,
          totalStock: updatedVariants.reduce((sum, v) => sum + v.stock, 0)
        };
      }
      return product;
    }));
  };

  const bulkUpdateVariantStock = (updates: { productId: string; variantId: string; stock: number }[]) => {
    setProducts(prev => prev.map(product => {
      const relevantUpdates = updates.filter(u => u.productId === product.id);
      if (relevantUpdates.length > 0) {
        const updatedVariants = product.variants.map(variant => {
          const update = relevantUpdates.find(u => u.variantId === variant.id);
          return update ? { ...variant, stock: update.stock } : variant;
        });
        return {
          ...product,
          variants: updatedVariants,
          totalStock: updatedVariants.reduce((sum, v) => sum + v.stock, 0)
        };
      }
      return product;
    }));
  };

  const recordSale = (items: SaleItem[], orderId: string) => {
    const sale: Sale = {
      id: `sale-${Date.now()}`,
      timestamp: new Date(),
      items,
      totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      orderId
    };

    setSales(prev => [sale, ...prev]);

    setProducts(prev => prev.map(product => {
      const saleItems = items.filter(item => item.productId === product.id);
      if (saleItems.length > 0) {
        const updatedVariants = product.variants.map(variant => {
          const saleItem = saleItems.find(item => 
            item.variantId === variant.id || 
            (item.color === variant.color && item.size === variant.size)
          );
          if (saleItem) {
            return {
              ...variant,
              stock: Math.max(0, variant.stock - saleItem.quantity)
            };
          }
          return variant;
        });
        return {
          ...product,
          variants: updatedVariants,
          totalStock: updatedVariants.reduce((sum, v) => sum + v.stock, 0)
        };
      }
      return product;
    }));
  };

  return (
    <SellerContext.Provider value={{
      products,
      sales,
      addProduct,
      updateProduct,
      deleteProduct,
      updateVariantStock,
      bulkUpdateVariantStock,
      recordSale,
      isSellerMode,
      setIsSellerMode
    }}>
      {children}
    </SellerContext.Provider>
  );
}

export function useSeller() {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error('useSeller must be used within a SellerProvider');
  }
  return context;
}
