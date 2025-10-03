import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export interface FilterOptions {
  searchQuery: string;
  categories: string[];
  colors: string[];
  priceRange: [number, number];
  onSale: boolean;
  newArrivals: boolean;
  minRating: number;
  sortBy: 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

interface SearchAndFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  categories: string[];
  colors?: string[]; // Available colors
  hideCategories?: boolean; // New prop to conditionally hide categories filter
}

export function SearchAndFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  categories,
  colors = [],
  hideCategories = false
}: SearchAndFiltersProps) {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const updateFilters = (updates: Partial<FilterOptions>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    updateFilters({ categories: newCategories });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...filters.colors, color]
      : filters.colors.filter(c => c !== color);
    updateFilters({ colors: newColors });
  };

  const activeFiltersCount = 
    filters.categories.length +
    filters.colors.length +
    (filters.onSale ? 1 : 0) +
    (filters.newArrivals ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 200 ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={filters.searchQuery}
          onChange={(e) => updateFilters({ searchQuery: e.target.value })}
          className="pl-10"
        />
      </div>

      {/* Filters and Sort */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your product search
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Categories - Hidden on category pages */}
                {!hideCategories && (
                  <div>
                    <h4 className="font-medium mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={filters.categories.includes(category)}
                            onCheckedChange={(checked) => 
                              handleCategoryChange(category, checked as boolean)
                            }
                          />
                          <Label htmlFor={category} className="text-sm">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Colors Filter */}
                {colors.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Colors</h4>
                    <div className="space-y-2">
                      {colors.map((color) => (
                        <div key={color} className="flex items-center space-x-2">
                          <Checkbox
                            id={`color-${color}`}
                            checked={filters.colors.includes(color)}
                            onCheckedChange={(checked) => 
                              handleColorChange(color, checked as boolean)
                            }
                          />
                          <Label htmlFor={`color-${color}`} className="text-sm">
                            {color}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range */}
                <div>
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                      max={200}
                      min={0}
                      step={5}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Special Filters */}
                <div>
                  <h4 className="font-medium mb-3">Special Offers</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="on-sale"
                        checked={filters.onSale}
                        onCheckedChange={(checked) => updateFilters({ onSale: checked as boolean })}
                      />
                      <Label htmlFor="on-sale" className="text-sm">
                        On Sale
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="new-arrivals"
                        checked={filters.newArrivals}
                        onCheckedChange={(checked) => updateFilters({ newArrivals: checked as boolean })}
                      />
                      <Label htmlFor="new-arrivals" className="text-sm">
                        New Arrivals
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <h4 className="font-medium mb-3">Minimum Rating</h4>
                  <Select
                    value={filters.minRating.toString()}
                    onValueChange={(value) => updateFilters({ minRating: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any rating</SelectItem>
                      <SelectItem value="3">3+ stars</SelectItem>
                      <SelectItem value="4">4+ stars</SelectItem>
                      <SelectItem value="5">5 stars only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear Filters */}
                <Button 
                  variant="outline" 
                  onClick={onClearFilters}
                  className="w-full pulse-on-hover"
                  disabled={activeFiltersCount === 0}
                >
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilters({ sortBy: value as FilterOptions['sortBy'] })}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name A-Z</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map((category) => (
            <Badge key={category} variant="secondary" className="text-xs">
              {category}
              <button
                onClick={() => handleCategoryChange(category, false)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.colors.map((color) => (
            <Badge key={color} variant="secondary" className="text-xs">
              {color}
              <button
                onClick={() => handleColorChange(color, false)}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.onSale && (
            <Badge variant="secondary" className="text-xs">
              On Sale
              <button
                onClick={() => updateFilters({ onSale: false })}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.newArrivals && (
            <Badge variant="secondary" className="text-xs">
              New Arrivals
              <button
                onClick={() => updateFilters({ newArrivals: false })}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.minRating > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filters.minRating}+ stars
              <button
                onClick={() => updateFilters({ minRating: 0 })}
                className="ml-1 hover:bg-secondary-foreground/20 rounded-full"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}