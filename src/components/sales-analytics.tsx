import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import type { PieLabelRenderProps } from "recharts";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { Sale, useSeller } from "../contexts/seller-context";
import { useTheme } from "../contexts/theme-context";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
// Simple date formatting function
const formatDate = (date: Date, formatStr: string) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const d = new Date(date);
  
  if (formatStr === 'MMM dd') {
    return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`;
  } else if (formatStr === 'MMM dd, yyyy HH:mm') {
    return `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}, ${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return date.toISOString();
};

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export function SalesAnalytics() {
  const { sales, products } = useSeller();
  const { theme } = useTheme();

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalOrders = sales.length;
    const totalItemsSold = sales.reduce((sum, sale) => 
      sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate revenue change (last 7 days vs previous 7 days)
    const now = new Date();
    const last7Days = sales.filter(s => {
      const saleDate = new Date(s.timestamp);
      const daysDiff = (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7;
    });
    const previous7Days = sales.filter(s => {
      const saleDate = new Date(s.timestamp);
      const daysDiff = (now.getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff > 7 && daysDiff <= 14;
    });

    const last7DaysRevenue = last7Days.reduce((sum, s) => sum + s.totalAmount, 0);
    const previous7DaysRevenue = previous7Days.reduce((sum, s) => sum + s.totalAmount, 0);
    const revenueChange = previous7DaysRevenue > 0 
      ? ((last7DaysRevenue - previous7DaysRevenue) / previous7DaysRevenue) * 100 
      : 0;

    return {
      totalRevenue,
      totalOrders,
      totalItemsSold,
      averageOrderValue,
      revenueChange
    };
  }, [sales]);

  // Sales over time (last 30 days)
  const salesOverTime = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: formatDate(date, 'MMM dd'),
        revenue: 0,
        orders: 0
      };
    });

    sales.forEach(sale => {
      const saleDate = new Date(sale.timestamp);
      const daysDiff = Math.floor((new Date().getTime() - saleDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff < 30) {
        const index = 29 - daysDiff;
        if (index >= 0 && index < 30) {
          last30Days[index].revenue += sale.totalAmount;
          last30Days[index].orders += 1;
        }
      }
    });

    return last30Days;
  }, [sales]);

  // Top selling products
  const topProducts = useMemo(() => {
    const productSales: { [key: string]: { name: string; quantity: number; revenue: number; category: string } } = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
            category: item.category
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
  }, [sales]);

  // Revenue by category
  const revenueByCategory = useMemo(() => {
    const categoryRevenue: { [key: string]: number } = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (!categoryRevenue[item.category]) {
          categoryRevenue[item.category] = 0;
        }
        categoryRevenue[item.category] += item.price * item.quantity;
      });
    });

    return Object.entries(categoryRevenue)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [sales]);

  // Sales by color
  const salesByColor = useMemo(() => {
    const colorSales: { [key: string]: number } = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (item.color) {
          if (!colorSales[item.color]) {
            colorSales[item.color] = 0;
          }
          colorSales[item.color] += item.quantity;
        }
      });
    });

    return Object.entries(colorSales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [sales]);

  // Sales by size
  const salesBySize = useMemo(() => {
    const sizeSales: { [key: string]: number } = {};

    sales.forEach(sale => {
      sale.items.forEach(item => {
        if (item.size) {
          if (!sizeSales[item.size]) {
            sizeSales[item.size] = 0;
          }
          sizeSales[item.size] += item.quantity;
        }
      });
    });

    return Object.entries(sizeSales)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [sales]);

  // Recent transactions
  const recentTransactions = useMemo(() => {
    return sales.slice(0, 10);
  }, [sales]);

    function renderPieLabel(props: PieLabelRenderProps) {
        const { cx, cy, midAngle, innerRadius, outerRadius, percent, name } = props;
        const RADIAN = Math.PI / 180;

        const ir = typeof innerRadius === "number" ? innerRadius : 0;
        const or = typeof outerRadius === "number" ? outerRadius : 0;
        const cxNum = typeof cx === "number" ? cx : 0;
        const cyNum = typeof cy === "number" ? cy : 0;
        const mid = typeof midAngle === "number" ? midAngle : 0;
        const pct = typeof percent === "number" ? percent : 0;

        const radius = ir + (or - ir) * 0.5;
        const x = cxNum + radius * Math.cos(-mid * RADIAN);
        const y = cyNum + radius * Math.sin(-mid * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill={theme === 'light' ? 'hsl(var(--primary))' : 'hsl(var(--foreground))'}
                textAnchor={x > cxNum ? "start" : "end"}
                dominantBaseline="central"
                style={{ fontSize: "12px", fontWeight: 500 }}
            >
                {`${name}: ${(pct! * 100).toFixed(0)}%`}
            </text>
        );
    }


  return (
    <div className="space-y-4 md:space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm truncate">Total Revenue</CardTitle>
              <DollarSign className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">${metrics.totalRevenue.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs mt-1">
              {metrics.revenueChange >= 0 ? (
                <ArrowUpRight className="w-3 h-3 text-green-600 shrink-0" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-600 shrink-0" />
              )}
              <span className={metrics.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(metrics.revenueChange).toFixed(1)}%
              </span>
              <span className="text-muted-foreground hidden sm:inline">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm truncate">Total Orders</CardTitle>
              <ShoppingCart className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{metrics.totalOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm truncate">Items Sold</CardTitle>
              <Package className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">{metrics.totalItemsSold}</div>
            <p className="text-xs text-muted-foreground mt-1">Total units sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 md:pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs md:text-sm truncate">Avg Order Value</CardTitle>
              <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground shrink-0" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-lg md:text-2xl font-bold">${metrics.averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-3 md:space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="revenue" className="text-xs md:text-sm">Revenue Trends</TabsTrigger>
          <TabsTrigger value="products" className="text-xs md:text-sm">Top Products</TabsTrigger>
          <TabsTrigger value="categories" className="text-xs md:text-sm">By Category</TabsTrigger>
          <TabsTrigger value="variants" className="text-xs md:text-sm">By Variant</TabsTrigger>
        </TabsList>

        {/* Revenue Over Time */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Last 30 days sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesOverTime}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    style={{ fontSize: '12px' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    style={{ fontSize: '12px' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => `${value.toFixed(2)}`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    position={{ y: 0 }}
                    allowEscapeViewBox={{ x: false, y: true }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={CHART_COLORS[0]} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders Over Time</CardTitle>
              <CardDescription>Number of orders per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    style={{ fontSize: '12px' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    style={{ fontSize: '12px' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    position={{ y: 0 }}
                    allowEscapeViewBox={{ x: false, y: true }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2}
                    dot={{ r: 3, fill: CHART_COLORS[1], stroke: CHART_COLORS[1] }}
                    activeDot={{ r: 4, fill: CHART_COLORS[1], stroke: CHART_COLORS[1] }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Top Products */}
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Products ranked by units sold</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    type="number" 
                    stroke="hsl(var(--muted-foreground))" 
                    style={{ fontSize: '12px' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={150} 
                    stroke="hsl(var(--muted-foreground))" 
                    style={{ fontSize: '12px' }}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => 
                      name === 'revenue' ? `${value.toFixed(2)}` : value
                    }
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))'
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    cursor={{ fill: 'hsl(var(--accent))' }}
                  />
                  <Legend wrapperStyle={{ color: 'hsl(var(--foreground))' }} />
                  <Bar dataKey="quantity" fill={CHART_COLORS[0]} name="Units Sold" />
                  <Bar dataKey="revenue" fill={CHART_COLORS[1]} name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue by Category */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Category</CardTitle>
                <CardDescription>Sales distribution across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={revenueByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderPieLabel}  // 👈 cleaner + safe
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      >
                       {revenueByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                       ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `${value.toFixed(2)}`}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      wrapperStyle={{ outline: 'none', zIndex: 1000 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Detailed breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueByCategory.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-muted-foreground">${category.value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales by Variant */}
        <TabsContent value="variants" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales by Color</CardTitle>
                <CardDescription>Most popular product colors</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesByColor}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      position={{ y: 0 }}
                      allowEscapeViewBox={{ x: false, y: true }}
                    />
                    <Bar dataKey="value" fill={CHART_COLORS[2]} name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Size</CardTitle>
                <CardDescription>Most popular product sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={salesBySize}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="name" 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      style={{ fontSize: '12px' }}
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }}
                      labelStyle={{ color: 'hsl(var(--foreground))' }}
                      itemStyle={{ color: 'hsl(var(--foreground))' }}
                      position={{ y: 0 }}
                      allowEscapeViewBox={{ x: false, y: true }}
                    />
                    <Bar dataKey="value" fill={CHART_COLORS[3]} name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Recent Transactions
          </CardTitle>
          <CardDescription>Latest sales activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No sales yet
                    </TableCell>
                  </TableRow>
                ) : (
                  recentTransactions.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.orderId}</TableCell>
                      <TableCell>{formatDate(new Date(sale.timestamp), 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {sale.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="truncate max-w-[200px]">
                              {item.productName} {item.color && `(${item.color})`}
                            </div>
                          ))}
                          {sale.items.length > 2 && (
                            <div className="text-muted-foreground text-xs">
                              +{sale.items.length - 2} more
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${sale.totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
