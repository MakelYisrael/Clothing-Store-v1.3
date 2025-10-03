import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { RotateCcw, Package, CreditCard, AlertCircle } from "lucide-react";

interface ReturnsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Returns({ isOpen, onClose }: ReturnsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Returns & Exchanges</DialogTitle>
          <DialogDescription>
            Our hassle-free return and exchange policy
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="mb-4">Our Return Policy</h3>
            <p className="text-muted-foreground mb-4">
              We want you to be completely satisfied with your purchase. If you're not happy with your order, 
              we offer easy returns and exchanges within 30 days of delivery.
            </p>

            <div className="grid gap-4">
              <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <RotateCcw className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="mb-1">30-Day Return Window</h4>
                  <p className="text-sm text-muted-foreground">
                    Items can be returned within 30 days of delivery for a full refund. Items must be 
                    unworn, unwashed, and in original condition with all tags attached.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <Package className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="mb-1">Free Return Shipping</h4>
                  <p className="text-sm text-muted-foreground">
                    We provide a prepaid return label for all domestic returns. Simply pack your items 
                    and drop them off at any authorized shipping location.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
                <CreditCard className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="mb-1">Fast Refunds</h4>
                  <p className="text-sm text-muted-foreground">
                    Refunds are processed within 5-7 business days of receiving your return. The refund 
                    will be credited to your original payment method.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-4">How to Return an Item</h3>
            <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
              <li>
                <strong>Log in to your account</strong> and navigate to your order history
              </li>
              <li>
                <strong>Select the order</strong> containing the item(s) you wish to return
              </li>
              <li>
                <strong>Click "Return Items"</strong> and follow the prompts to select items and reason for return
              </li>
              <li>
                <strong>Print your return label</strong> and packing slip
              </li>
              <li>
                <strong>Pack your items securely</strong> in the original packaging if possible
              </li>
              <li>
                <strong>Attach the return label</strong> and drop off at any authorized shipping location
              </li>
            </ol>
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-4">Exchanges</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Need a different size or color? We make exchanges easy:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                • <strong>Same-item exchanges:</strong> If you need a different size or color of the same item, 
                we'll ship the replacement immediately upon receiving your return request.
              </li>
              <li>
                • <strong>Different-item exchanges:</strong> Return your original item and place a new order 
                for the item you want. This ensures you get your new item as quickly as possible.
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-4">Items That Cannot Be Returned</h3>
            <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
              <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Underwear and intimate apparel (for hygiene reasons)</li>
                  <li>• Swimwear (unless unworn with hygiene liner intact)</li>
                  <li>• Earrings and body jewelry</li>
                  <li>• Items marked as "Final Sale"</li>
                  <li>• Gift cards</li>
                  <li>• Items worn, washed, or damaged by the customer</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-4">International Returns</h3>
            <p className="text-sm text-muted-foreground">
              International returns are accepted within 30 days. However, customers are responsible for 
              return shipping costs. Please contact our customer service team for assistance with 
              international returns.
            </p>
          </div>

          <div className="pt-4 border-t">
            <h3 className="mb-4">Damaged or Defective Items</h3>
            <p className="text-sm text-muted-foreground mb-2">
              If you receive a damaged or defective item, please contact us immediately:
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Take photos of the damaged item and packaging</li>
              <li>• Contact customer service within 48 hours of delivery</li>
              <li>• We'll provide a prepaid return label and send a replacement immediately</li>
            </ul>
          </div>

          <div className="pt-4 border-t bg-muted/30 -mx-6 px-6 -mb-6 pb-6">
            <h4 className="mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground">
              Our customer service team is here to help with any questions about returns or exchanges. 
              Contact us at support@jhf.com or call +1 (555) 123-4567.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}