import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Search, Package, AlertTriangle, CheckCircle, Edit2, Save, X, Layers } from "lucide-react";
import { ProductWithInventory, useSeller } from "../contexts/seller-context";
import { toast } from "sonner";

export function InventoryManagement() {
  const { products, updateVariantStock, bulkUpdateVariantStock } = useSeller();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState<string>('all');
  const [editingVariant, setEditingVariant] = useState<{ productId: string; variantId: string; stock: number } | null>(null);

  const categories = Array.from(new Set(products.map(p => p.category)));

  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');

  const allColors = Array.from(new Set(products.flatMap(p => p.availableColors)));
  const allSizes = Array.from(new Set(products.flatMap(p => p.availableSizes)));

  // Bulk update state
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedVariants, setSelectedVariants] = useState<Set<string>>(new Set());
  const [bulkStockValue, setBulkStockValue] = useState<number>(0);
  const [bulkAction, setBulkAction] = useState<'set' | 'increase' | 'decrease'>('set');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesColor = selectedColor === 'all' || product.availableColors.includes(selectedColor);
    const matchesSize = selectedSize === 'all' || product.availableSizes.includes(selectedSize);
    
    // Stock status filter - check if any variant matches the selected status
    let matchesStockStatus = true;
    if (selectedStockStatus !== 'all') {
      const hasMatchingVariant = product.variants.some(variant => {
        if (selectedStockStatus === 'out-of-stock') return variant.stock === 0;
        if (selectedStockStatus === 'low-stock') return variant.stock < 10 && variant.stock > 0;
        if (selectedStockStatus === 'in-stock') return variant.stock >= 10;
        return true;
      });
      matchesStockStatus = hasMatchingVariant;
    }
    
    return matchesSearch && matchesCategory && matchesColor && matchesSize && matchesStockStatus;
  });

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const, icon: AlertTriangle };
    if (stock < 10) return { label: 'Low Stock', variant: 'secondary' as const, icon: AlertTriangle };
    return { label: 'In Stock', variant: 'default' as const, icon: CheckCircle };
  };

  const handleEditStock = (productId: string, variantId: string, currentStock: number) => {
    setEditingVariant({ productId, variantId, stock: currentStock });
  };

  const handleSaveStock = () => {
    if (editingVariant) {
      updateVariantStock(editingVariant.productId, editingVariant.variantId, editingVariant.stock);
      toast.success('Stock updated successfully');
      setEditingVariant(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingVariant(null);
  };

  // Bulk update handlers
  const handleToggleVariant = (productId: string, variantId: string) => {
    const key = `${productId}-${variantId}`;
    setSelectedVariants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allVariantKeys = new Set<string>();
    filteredProducts.forEach(product => {
      product.variants
        .filter(variant => selectedColor === 'all' || variant.color === selectedColor)
        .filter(variant => selectedSize === 'all' || variant.size === selectedSize)
        .forEach(variant => {
          allVariantKeys.add(`${product.id}-${variant.id}`);
        });
    });
    setSelectedVariants(allVariantKeys);
  };

  const handleDeselectAll = () => {
    setSelectedVariants(new Set());
  };

  const handleBulkUpdate = () => {
    if (selectedVariants.size === 0) {
      toast.error('Please select at least one variant');
      return;
    }

    const updates: { productId: string; variantId: string; stock: number }[] = [];
    
    selectedVariants.forEach(key => {
      const [productId, variantId] = key.split('-');
      const product = products.find(p => p.id === productId);
      const variant = product?.variants.find(v => v.id === variantId);
      
      if (variant) {
        let newStock = variant.stock;
        
        switch (bulkAction) {
          case 'set':
            newStock = bulkStockValue;
            break;
          case 'increase':
            newStock = variant.stock + bulkStockValue;
            break;
          case 'decrease':
            newStock = Math.max(0, variant.stock - bulkStockValue);
            break;
        }
        
        updates.push({ productId, variantId, stock: newStock });
      }
    });

    bulkUpdateVariantStock(updates);
    toast.success(`Updated ${updates.length} variant${updates.length > 1 ? 's' : ''} successfully`);
    setSelectedVariants(new Set());
    setBulkMode(false);
  };

  const totalInventoryValue = products.reduce((sum, product) => 
    sum + (product.totalStock * product.price), 0
  );

  const totalItems = products.reduce((sum, product) => sum + product.totalStock, 0);
  const lowStockItems = products.reduce((sum, product) => 
    sum + product.variants.filter(v => v.stock < 10 && v.stock > 0).length, 0
  );
  const outOfStockItems = products.reduce((sum, product) => 
    sum + product.variants.filter(v => v.stock === 0).length, 0
  );

  // Get low stock items grouped by color
  const getLowStockByColor = () => {
    const lowStockByColor: { [color: string]: { productName: string; size: string; stock: number }[] } = {};
    
    products.forEach(product => {
      product.variants.forEach(variant => {
        if (variant.stock < 10 && variant.stock > 0) {
          if (!lowStockByColor[variant.color]) {
            lowStockByColor[variant.color] = [];
          }
          lowStockByColor[variant.color].push({
            productName: product.name,
            size: variant.size,
            stock: variant.stock
          });
        }
      });
    });
    
    return lowStockByColor;
  };

  const lowStockByColor = getLowStockByColor();

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-xs md:text-sm truncate">Total Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">{totalItems} total items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-xs md:text-sm">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Active products</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-xs md:text-sm truncate">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-orange-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground mt-1">Variants below 10 units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <CardTitle className="text-xs md:text-sm truncate">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold text-destructive">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground mt-1">Variants to restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Package className="w-4 h-4 md:w-5 md:h-5" />
            Inventory Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 md:space-y-4">
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full sm:w-[130px]">
                  <SelectValue placeholder="All Colors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colors</SelectItem>
                  {allColors.map(color => (
                    <SelectItem key={color} value={color}>{color}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  {allSizes.map(size => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStockStatus} onValueChange={setSelectedStockStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Levels</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="low-stock">{"Low Stock (< 10)"}</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Update Controls */}
            <div className="flex items-center gap-4">
              <Button
                variant={bulkMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setBulkMode(!bulkMode);
                  if (bulkMode) {
                    setSelectedVariants(new Set());
                  }
                }}
                className="gap-2"
              >
                <Layers className="w-4 h-4" />
                {bulkMode ? 'Exit Bulk Mode' : 'Bulk Update'}
              </Button>

              {bulkMode && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeselectAll}
                  >
                    Deselect All
                  </Button>
                  <div className="flex items-center gap-2 ml-auto">
                    <Select value={bulkAction} onValueChange={(v: 'set' | 'increase' | 'decrease') => setBulkAction(v)}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="set">Set to</SelectItem>
                        <SelectItem value="increase">Increase by</SelectItem>
                        <SelectItem value="decrease">Decrease by</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="0"
                      value={bulkStockValue}
                      onChange={(e) => setBulkStockValue(parseInt(e.target.value) || 0)}
                      className="w-24"
                      placeholder="0"
                    />
                    <Button
                      onClick={handleBulkUpdate}
                      disabled={selectedVariants.size === 0}
                      size="sm"
                    >
                      Apply ({selectedVariants.size})
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Low Stock Alert by Color */}
          {Object.keys(lowStockByColor).length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-2">
                    Low Stock Alert by Color
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(lowStockByColor).map(([color, items]) => (
                      <div key={color} className="space-y-1">
                        <div className="font-medium text-orange-800 dark:text-orange-200">
                          {color}:
                        </div>
                        <div className="ml-4 space-y-1">
                          {items.map((item, idx) => (
                            <div key={idx} className="text-sm text-orange-700 dark:text-orange-300">
                              • {item.productName} ({item.size}) - {item.stock} units remaining
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  {bulkMode && <TableHead className="w-12"></TableHead>}
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={bulkMode ? 9 : 8} className="text-center text-muted-foreground py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.flatMap((product) =>
                    product.variants
                      // Filter variants by selected color and size
                      .filter(variant => selectedColor === 'all' || variant.color === selectedColor)
                      .filter(variant => selectedSize === 'all' || variant.size === selectedSize)
                      // Filter variants by stock status
                      .filter(variant => {
                        if (selectedStockStatus === 'all') return true;
                        if (selectedStockStatus === 'out-of-stock') return variant.stock === 0;
                        if (selectedStockStatus === 'low-stock') return variant.stock < 10 && variant.stock > 0;
                        if (selectedStockStatus === 'in-stock') return variant.stock >= 10;
                        return true;
                      })
                      .map((variant) => {
                        const status = getStockStatus(variant.stock);
                        const StatusIcon = status.icon;
                        const isEditing = editingVariant?.productId === product.id && 
                                         editingVariant?.variantId === variant.id;
                        const variantKey = `${product.id}-${variant.id}`;
                        const isSelected = selectedVariants.has(variantKey);

                        return (
                          <TableRow key={variantKey}>
                          {bulkMode && (
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => handleToggleVariant(product.id, variant.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{variant.color}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{variant.size}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {variant.sku || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={editingVariant.stock}
                                onChange={(e) => setEditingVariant({
                                  ...editingVariant,
                                  stock: parseInt(e.target.value) || 0
                                })}
                                className="w-20 text-right"
                                autoFocus
                              />
                            ) : (
                              <span className="font-medium">{variant.stock}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={status.variant} className="gap-1">
                              <StatusIcon className="w-3 h-3" />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {!bulkMode && (
                              <>
                                {isEditing ? (
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={handleSaveStock}
                                    >
                                      <Save className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={handleCancelEdit}
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditStock(product.id, variant.id, variant.stock)}
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </Button>
                                )}
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
