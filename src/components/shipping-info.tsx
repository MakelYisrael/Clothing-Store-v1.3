import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Truck, Package, MapPin, Clock } from "lucide-react";

interface ShippingInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShippingInfo({ isOpen, onClose }: ShippingInfoProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Shipping Information</DialogTitle>
          <DialogDescription>
            Delivery options, shipping times, and tracking information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="mb-4">Shipping Options</h3>
            
            <div className="grid gap-4">
              <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <Truck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="mb-1">Standard Shipping</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Delivery within 5-7 business days
                  </p>
                  <p className="text-sm">
                    <strong>$5.99</strong> or <strong>FREE</strong> on orders over $50
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="mb-1">Express Shipping</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Delivery within 2-3 business days
                  </p>
                  <p className="text-sm">
                    <strong>$12.99</strong> flat rate
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="mb-1">Next Day Delivery</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Order by 12 PM for next day delivery
                  </p>
                  <p className="text-sm">
                    <strong>$24.99</strong> flat rate
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-4">International Shipping</h3>
            <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  We ship to over 50 countries worldwide. International delivery times vary by location:
                </p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Canada: 7-10 business days</li>
                  <li>• Europe: 10-14 business days</li>
                  <li>• Asia: 12-16 business days</li>
                  <li>• Australia: 10-14 business days</li>
                </ul>
                <p className="text-sm mt-2">
                  Shipping costs calculated at checkout based on destination and order weight.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-4">Order Processing</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                Orders are typically processed within 1-2 business days. You'll receive a confirmation email 
                with tracking information once your order has shipped.
              </p>
              <p>
                <strong>Processing Times:</strong>
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Standard orders: 1-2 business days</li>
                <li>• Sale items: 2-3 business days</li>
                <li>• Custom or personalized items: 3-5 business days</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-4">Tracking Your Order</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                Once your order ships, you'll receive an email with a tracking number. You can also track 
                your order by logging into your account and viewing your order history.
              </p>
              <p>
                Please allow 24 hours after receiving your tracking number for the information to appear 
                in the carrier's system.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-4">Delivery Issues</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                If you experience any issues with your delivery, such as damaged or missing items, 
                please contact our customer service team within 48 hours of receiving your order.
              </p>
              <p>
                We're committed to resolving any shipping issues quickly and to your satisfaction.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}