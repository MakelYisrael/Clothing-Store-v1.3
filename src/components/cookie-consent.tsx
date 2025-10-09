import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X } from "lucide-react";

interface CookieConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setIsVisible(false);
    onDecline();
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom">
      <Card className="max-w-4xl mx-auto p-6 shadow-2xl border-2">
        <div className="flex items-start gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">🍪 Cookie Notice</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-6 w-6"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
              By clicking "Accept All Cookies", you consent to our use of cookies. You can manage your preferences 
              or learn more in our Privacy Policy.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAccept} size="sm">
                Accept All Cookies
              </Button>
              <Button onClick={handleDecline} variant="outline" size="sm">
                Decline Optional Cookies
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // This would open cookie settings in a real implementation
                  handleClose();
                }}
              >
                Manage Preferences
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Hook to check if cookies are accepted
export function useCookieConsent() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem('cookieConsent');
    setConsent(storedConsent as 'accepted' | 'declined' | null);
  }, []);

  return consent;
}