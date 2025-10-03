import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            Learn how we collect, use, and protect your personal information
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Last updated: October 1, 2025
              </p>
              <p>
                At JHF Clothing Store, we are committed to protecting your privacy and ensuring the security of your personal information.
              </p>
            </div>

            <div>
              <h3>1. Information We Collect</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Name, email address, and contact information</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely through third-party providers)</li>
                <li>Order history and preferences</li>
                <li>Account credentials</li>
                <li>Communications with customer support</li>
              </ul>
            </div>

            <div>
              <h3>2. How We Use Your Information</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and account</li>
                <li>Send you promotional materials (with your consent)</li>
                <li>Improve our products and services</li>
                <li>Prevent fraud and enhance security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h3>3. Information Sharing</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for transaction processing</li>
                <li>Shipping companies to deliver your orders</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </div>

            <div>
              <h3>4. Cookies and Tracking</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings.
              </p>
            </div>

            <div>
              <h3>5. Data Security</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </div>

            <div>
              <h3>6. Your Rights</h3>
              <p className="text-sm text-muted-foreground mt-2">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-sm text-muted-foreground">
                <li>Access and update your personal information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Object to certain data processing activities</li>
              </ul>
            </div>

            <div>
              <h3>7. Children's Privacy</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </div>

            <div>
              <h3>8. International Data Transfers</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </div>

            <div>
              <h3>9. Changes to This Policy</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h3>10. Contact Us</h3>
              <p className="text-sm text-muted-foreground mt-2">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-2 text-sm text-muted-foreground">
                <p>Email: privacy@jhfclothing.com</p>
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