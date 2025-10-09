import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Bell, Check } from "lucide-react";
import { useUser } from "../contexts/user-context";
import { toast } from "sonner";

interface NotificationSubscriptionProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationSubscription({ isOpen, onClose }: NotificationSubscriptionProps) {
  const { user } = useUser();
  const [preferences, setPreferences] = useState({
    newArrivals: true,
    sales: true,
    orderUpdates: true,
    newsletter: false,
    recommendations: false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    localStorage.setItem(`notifications_${user?.email}`, JSON.stringify(preferences));
    toast.success('Notification preferences saved!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </DialogTitle>
          <DialogDescription>
            Choose what updates you'd like to receive from JHF Clothing Store
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="newArrivals"
              checked={preferences.newArrivals}
              onCheckedChange={() => handleToggle('newArrivals')}
            />
            <div className="flex-1">
              <Label htmlFor="newArrivals" className="cursor-pointer">
                New Arrivals
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new products are added
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="sales"
              checked={preferences.sales}
              onCheckedChange={() => handleToggle('sales')}
            />
            <div className="flex-1">
              <Label htmlFor="sales" className="cursor-pointer">
                Sales & Promotions
              </Label>
              <p className="text-sm text-muted-foreground">
                Be the first to know about exclusive deals
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="orderUpdates"
              checked={preferences.orderUpdates}
              onCheckedChange={() => handleToggle('orderUpdates')}
            />
            <div className="flex-1">
              <Label htmlFor="orderUpdates" className="cursor-pointer">
                Order Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Track your order status and delivery
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="newsletter"
              checked={preferences.newsletter}
              onCheckedChange={() => handleToggle('newsletter')}
            />
            <div className="flex-1">
              <Label htmlFor="newsletter" className="cursor-pointer">
                Newsletter
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive our weekly style tips and trends
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="recommendations"
              checked={preferences.recommendations}
              onCheckedChange={() => handleToggle('recommendations')}
            />
            <div className="flex-1">
              <Label htmlFor="recommendations" className="cursor-pointer">
                Personalized Recommendations
              </Label>
              <p className="text-sm text-muted-foreground">
                Get product suggestions based on your preferences
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="w-4 h-4 mr-2" />
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}