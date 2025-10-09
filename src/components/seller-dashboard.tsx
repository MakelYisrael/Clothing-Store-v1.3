import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ProductManagement } from "./product-management";
import { InventoryManagement } from "./inventory-management";
import { SalesAnalytics } from "./sales-analytics";
import { 
  Store, 
  Package, 
  BarChart3, 
  ArrowLeft,
  ShoppingBag,
  TrendingUp
} from "lucide-react";
import { useSeller } from "../contexts/seller-context";

interface SellerDashboardProps {
  onBackToBuyer: () => void;
}

export function SellerDashboard({ onBackToBuyer }: SellerDashboardProps) {
  const { products, sales } = useSeller();
  const [activeTab, setActiveTab] = useState('overview');

  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.totalStock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.totalStock), 0);
  const lowStockProducts = products.filter(p => p.totalStock < 50).length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalOrders = sales.length;

  return (
    <div className="min-h-screen bg-muted/30 pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-background text-foreground border-b sticky top-0 z-40">
        <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-4 min-w-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={onBackToBuyer}
                className="gap-1 md:gap-2 shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Store</span>
                <span className="sm:hidden">Back</span>
              </Button>
              <div className="h-6 w-px bg-border hidden sm:block" />
              <div className="flex items-center gap-2 min-w-0">
                <Store className="w-5 h-5 md:w-6 md:h-6 shrink-0 text-foreground" />
                <div className="min-w-0">
                  <h1 className="font-bold text-sm md:text-base truncate text-foreground">Seller Dashboard</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">JHF Clothing Store</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="overview" className="flex-col gap-1 py-2 px-1 md:flex-row md:gap-2 md:py-2.5 md:px-4">
              <BarChart3 className="w-4 h-4 md:mr-0" />
              <span className="text-xs md:text-sm">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-col gap-1 py-2 px-1 md:flex-row md:gap-2 md:py-2.5 md:px-4">
              <TrendingUp className="w-4 h-4 md:mr-0" />
              <span className="text-xs md:text-sm">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex-col gap-1 py-2 px-1 md:flex-row md:gap-2 md:py-2.5 md:px-4">
              <ShoppingBag className="w-4 h-4 md:mr-0" />
              <span className="text-xs md:text-sm">Products</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex-col gap-1 py-2 px-1 md:flex-row md:gap-2 md:py-2.5 md:px-4">
              <Package className="w-4 h-4 md:mr-0" />
              <span className="text-xs md:text-sm">Inventory</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 md:space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
              <Card>
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-xs md:text-sm text-muted-foreground">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground mt-1 md:mt-2">All time sales</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-xs md:text-sm text-muted-foreground">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{totalOrders}</div>
                  <p className="text-xs text-muted-foreground mt-1 md:mt-2">Completed orders</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-xs md:text-sm text-muted-foreground">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{totalProducts}</div>
                  <p className="text-xs text-muted-foreground mt-1 md:mt-2">Active listings</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-xs md:text-sm text-muted-foreground">Total Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold">{totalStock}</div>
                  <p className="text-xs text-muted-foreground mt-1 md:mt-2">Units in inventory</p>
                </CardContent>
              </Card>

              <Card className="col-span-2 md:col-span-1">
                <CardHeader className="pb-2 md:pb-3">
                  <CardTitle className="text-xs md:text-sm text-muted-foreground">Low Stock Alert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg md:text-2xl font-bold text-orange-600">{lowStockProducts}</div>
                  <p className="text-xs text-muted-foreground mt-1 md:mt-2">Need restocking</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from(new Set(products.map(p => p.category))).map(category => {
                      const categoryProducts = products.filter(p => p.category === category);
                      const categoryStock = categoryProducts.reduce((sum, p) => sum + p.totalStock, 0);
                      const percentage = (categoryProducts.length / totalProducts) * 100;
                      
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{category}</span>
                            <span className="text-muted-foreground">
                              {categoryProducts.length} products ({categoryStock} units)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New Arrivals</span>
                      <span className="font-bold">{products.filter(p => p.isNew).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">On Sale</span>
                      <span className="font-bold">{products.filter(p => p.isOnSale).length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Regular Price</span>
                      <span className="font-bold">
                        {products.filter(p => !p.isOnSale && !p.isNew).length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-sm font-medium">Total Active</span>
                      <span className="font-bold text-lg">{totalProducts}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Low Stock */}
            {lowStockProducts > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-600">Low Stock Alert</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {products
                      .filter(p => p.totalStock < 50)
                      .slice(0, 5)
                      .map(product => {
                        // Get low stock variants by color
                        const lowStockByColor = product.variants
                          .filter(v => v.stock < 10 && v.stock > 0)
                          .reduce((acc, v) => {
                            if (!acc[v.color]) acc[v.color] = [];
                            acc[v.color].push(v);
                            return acc;
                          }, {} as { [color: string]: typeof product.variants });

                        return (
                          <div key={product.id} className="p-3 border rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground">{product.category}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-orange-600">{product.totalStock} units</div>
                                <div className="text-xs text-muted-foreground">
                                  {product.variants.length} variants
                                </div>
                              </div>
                            </div>
                            {Object.keys(lowStockByColor).length > 0 && (
                              <div className="text-sm border-t pt-2">
                                <div className="font-medium text-orange-600 mb-1">Low Stock by Color:</div>
                                <div className="space-y-1 ml-3">
                                  {Object.entries(lowStockByColor).map(([color, variants]) => (
                                    <div key={color}>
                                      <span className="font-medium text-orange-700 dark:text-orange-300">
                                        {product.name} - {color}:
                                      </span>{' '}
                                      <span className="text-muted-foreground text-xs">
                                        {variants.reduce((sum, v) => sum + v.stock, 0)} units 
                                        {' '}({variants.length} size{variants.length !== 1 ? 's' : ''})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <SalesAnalytics />
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <InventoryManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
