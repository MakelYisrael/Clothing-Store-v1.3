import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Terms and conditions for using JHF Clothing Store services
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: October 1, 2025
              </p>
              <p>
                Welcome to JHF Clothing Store. By accessing or using our website and services, you agree to be bound by these Terms of Service.
              </p>
            </div>

            <div>
              <h3>1. Acceptance of Terms</h3>
              <p className="text-sm text-muted-foreground mt-2">
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div>
              <h3>2. Use of Our Services</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You must be at least 18 years old to make purchases on our website. You agree to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use our services only for lawful purposes</li>
                <li>Not engage in fraudulent activities</li>
                <li>Not interfere with the proper functioning of our website</li>
              </ul>
            </div>

            <div>
              <h3>3. Product Information</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We strive to provide accurate product descriptions, pricing, and availability information. However:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>We do not guarantee that product descriptions are error-free</li>
                <li>Colors may vary from what you see on your screen</li>
                <li>We reserve the right to correct pricing errors</li>
                <li>Product availability is subject to change without notice</li>
              </ul>
            </div>

            <div>
              <h3>4. Orders and Payments</h3>
              <p className="text-sm text-muted-foreground mt-2">
                By placing an order, you agree that:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>You are making an offer to purchase products</li>
                <li>We reserve the right to refuse or cancel orders</li>
                <li>Payment must be received before order processing</li>
                <li>All prices are in USD unless otherwise stated</li>
                <li>You are responsible for applicable taxes and duties</li>
              </ul>
            </div>

            <div>
              <h3>5. Shipping and Delivery</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Shipping times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs. Risk of loss passes to you upon delivery to the carrier.
              </p>
            </div>

            <div>
              <h3>6. Returns and Refunds</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Please refer to our Returns Policy for detailed information about returns, exchanges, and refunds. Not all products may be eligible for return.
              </p>
            </div>

            <div>
              <h3>7. Intellectual Property</h3>
              <p className="text-sm text-muted-foreground mt-2">
                All content on this website, including text, graphics, logos, images, and software, is the property of JHF Clothing Store and protected by copyright and trademark laws. You may not:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Reproduce, distribute, or modify our content without permission</li>
                <li>Use our trademarks without authorization</li>
                <li>Create derivative works from our content</li>
              </ul>
            </div>

            <div>
              <h3>8. User Accounts</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You are responsible for maintaining the confidentiality of your account and password. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </div>

            <div>
              <h3>9. User Content and Reviews</h3>
              <p className="text-sm text-muted-foreground mt-2">
                By submitting reviews or other content, you grant us a non-exclusive, royalty-free license to use, reproduce, and display such content. You agree that your content will:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Not violate any laws or third-party rights</li>
                <li>Not contain offensive or inappropriate material</li>
                <li>Be accurate and not misleading</li>
              </ul>
            </div>

            <div>
              <h3>10. Limitation of Liability</h3>
              <p className="text-sm text-muted-foreground mt-2">
                To the maximum extent permitted by law, JHF Clothing Store shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
              </p>
            </div>

            <div>
              <h3>11. Warranty Disclaimer</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Our products are provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including merchantability and fitness for a particular purpose.
              </p>
            </div>

            <div>
              <h3>12. Indemnification</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You agree to indemnify and hold harmless JHF Clothing Store from any claims, damages, or expenses arising from your use of our services or violation of these terms.
              </p>
            </div>

            <div>
              <h3>13. Modifications to Terms</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of modified terms.
              </p>
            </div>

            <div>
              <h3>14. Governing Law</h3>
              <p className="text-sm text-muted-foreground mt-2">
                These terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h3>15. Contact Information</h3>
              <p className="text-sm text-muted-foreground mt-2">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Email: legal@jhfclothing.com</p>
                <p>Phone: 1-800-JHF-SHOP</p>
                <p>Address: 123 Fashion Avenue, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}