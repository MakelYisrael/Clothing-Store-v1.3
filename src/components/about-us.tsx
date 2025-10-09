import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AboutUsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutUs({ isOpen, onClose }: AboutUsProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>About JHF</DialogTitle>
          <DialogDescription>
            Learn about our story, mission, and commitment to quality fashion
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative h-64 w-full overflow-hidden rounded-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="JHF Store"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4">
            <h3>Our Story</h3>
            <p className="text-muted-foreground">
              Founded in 2020, JHF has grown from a small boutique to a premier destination for modern fashion. 
              We believe in creating clothing that combines timeless style with contemporary comfort, making you look 
              and feel your best every day.
            </p>

            <h3>Our Mission</h3>
            <p className="text-muted-foreground">
              At JHF, we're committed to providing high-quality, stylish clothing that fits seamlessly into your lifestyle. 
              We carefully curate each collection to ensure our customers have access to the latest trends while maintaining 
              our commitment to quality and sustainability.
            </p>

            <h3>Our Values</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Quality First:</strong> We never compromise on the quality of our products</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Customer Satisfaction:</strong> Your happiness is our priority</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Sustainability:</strong> We're committed to ethical and sustainable practices</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span><strong>Innovation:</strong> We continuously evolve to meet your needs</span>
              </li>
            </ul>

            <h3>Why Choose Us?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="mb-2">Premium Quality</h4>
                <p className="text-sm text-muted-foreground">
                  Every item is carefully selected and inspected to meet our high standards
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="mb-2">Fast Shipping</h4>
                <p className="text-sm text-muted-foreground">
                  Free shipping on orders over $50 with delivery within 3-5 business days
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="mb-2">Easy Returns</h4>
                <p className="text-sm text-muted-foreground">
                  Not satisfied? Return within 30 days for a full refund, no questions asked
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="mb-2">24/7 Support</h4>
                <p className="text-sm text-muted-foreground">
                  Our customer service team is always here to help you
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}