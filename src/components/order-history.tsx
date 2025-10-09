import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Button } from './ui/button';
import { useUser } from '../contexts/user-context';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { OrderTracking, TrackingInfo } from './order-tracking';
import { Package } from 'lucide-react';

interface OrderHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrderHistory({ isOpen, onClose }: OrderHistoryProps) {
  const { orders } = useUser();
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedOrderTracking, setSelectedOrderTracking] = useState<TrackingInfo | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'pending':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const handleTrackOrder = (order: any) => {
    // Generate mock tracking data
    const trackingInfo: TrackingInfo = {
      orderId: order.id,
      trackingNumber: order.trackingNumber || `TRK${Date.now().toString().slice(-9)}`,
      carrier: order.carrier || 'FedEx',
      carrierPhone: '1-800-463-3339',
      carrierWebsite: 'https://www.fedex.com/en-us/tracking.html',
      currentStatus: order.status === 'processing' ? 'processing' 
                   : order.status === 'shipped' ? 'shipped' 
                   : order.status === 'delivered' ? 'delivered'
                   : 'ordered',
      estimatedDelivery: order.estimatedDelivery || 'January 10, 2025',
      shippedDate: order.status === 'shipped' || order.status === 'delivered' ? order.date : undefined,
      deliveredDate: order.status === 'delivered' ? 'December 18, 2024' : undefined,
      shippingAddress: {
        name: order.shippingAddress.name || 'John Doe',
        street: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
      },
      trackingEvents: generateTrackingEvents(
        order.status,
        order.date,
        order.shippingAddress?.city
      ),
    };

    setSelectedOrderTracking(trackingInfo);
    setIsTrackingOpen(true);
  };

  // Update function signature to accept shippingCity
  const generateTrackingEvents = (status: string, orderDate: string, shippingCity?: string) => {
    const events = [
      {
        status: 'Order Placed',
        description: 'Your order has been confirmed and is being prepared',
        location: 'JHF Store',
        date: orderDate,
        time: '10:30 AM',
      },
    ];

    if (status === 'processing' || status === 'shipped' || status === 'delivered') {
      events.push({
        status: 'Processing',
        description: 'Order is being processed and packaged',
        location: 'JHF Warehouse, New York',
        date: orderDate,
        time: '2:15 PM',
      });
    }

    if (status === 'shipped' || status === 'delivered') {
      events.push({
        status: 'Shipped',
        description: 'Package has been picked up by carrier',
        location: 'New York Distribution Center',
        date: orderDate,
        time: '6:45 PM',
      });
      events.push({
        status: 'In Transit',
        description: 'Package is on the way to your location',
        location: 'Regional Sorting Facility',
        date: 'Dec 22, 2024',
        time: '8:30 AM',
      });
    }

    if (status === 'delivered') {
      events.push({
        status: 'Out for Delivery',
        description: 'Package is out for delivery',
        location: 'Local Delivery Station',
        date: 'Dec 23, 2024',
        time: '7:00 AM',
      });
      events.push({
        status: 'Delivered',
        description: 'Package delivered successfully',
        location: shippingCity || 'Your Address',
        date: 'Dec 23, 2024',
        time: '2:30 PM',
      });
    }

    return events.reverse(); // Show most recent first
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Order History</SheetTitle>
          <SheetDescription>
            View all your past orders and track their status
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No orders found</p>
              <p className="text-sm text-muted-foreground mt-2">
                Start shopping to see your orders here
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order {order.id}</h4>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Shipping to:</p>
                  <p>
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                </div>

                {/* Track Order Button */}
                {(order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') && (
                  <Button 
                    variant="outline" 
                    className="w-full mt-2"
                    onClick={() => handleTrackOrder(order)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Track Order
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </SheetContent>

      {/* Order Tracking Modal */}
      <OrderTracking
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        trackingInfo={selectedOrderTracking}
      />
    </Sheet>
  );
}