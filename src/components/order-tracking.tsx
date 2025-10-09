import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent } from "./ui/card";
import { 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  Copy,
  ExternalLink,
  Phone,
  Mail,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export interface TrackingEvent {
  status: string;
  description: string;
  location: string;
  date: string;
  time: string;
}

export interface TrackingInfo {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  carrierPhone: string;
  carrierWebsite: string;
  currentStatus: 'ordered' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
  estimatedDelivery: string;
  shippedDate?: string;
  deliveredDate?: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  trackingEvents: TrackingEvent[];
}

interface OrderTrackingProps {
  isOpen: boolean;
  onClose: () => void;
  trackingInfo: TrackingInfo | null;
}

const statusSteps = [
  { key: 'ordered', label: 'Order Placed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out-for-delivery', label: 'Out for Delivery', icon: MapPin },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

export function OrderTracking({ isOpen, onClose, trackingInfo }: OrderTrackingProps) {
  const [expandedEvents, setExpandedEvents] = useState(false);

  if (!trackingInfo) return null;

  const getCurrentStepIndex = () => {
    const index = statusSteps.findIndex(step => step.key === trackingInfo.currentStatus);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingInfo.trackingNumber);
    toast.success("Tracking number copied to clipboard");
  };

  const handleOpenCarrierWebsite = () => {
    window.open(trackingInfo.carrierWebsite, '_blank');
  };

  const getStatusColor = (status: string) => {
    return 'border-gray-300 dark:border-gray-700';
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Track Your Order
          </DialogTitle>
          <DialogDescription>
            Order #{trackingInfo.orderId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status Card */}
          <Card className={`border-l-4 ${getStatusColor(trackingInfo.currentStatus)}`}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getStatusBadgeVariant(trackingInfo.currentStatus)} className="capitalize">
                      {trackingInfo.currentStatus.replace('-', ' ')}
                    </Badge>
                    {trackingInfo.currentStatus === 'delivered' && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {trackingInfo.currentStatus === 'delivered' 
                      ? `Delivered on ${trackingInfo.deliveredDate}`
                      : `Estimated delivery: ${trackingInfo.estimatedDelivery}`
                    }
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Tracking #:</span>
                    <code className="text-sm bg-muted px-2 py-1 rounded">
                      {trackingInfo.trackingNumber}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCopyTracking}
                      className="h-8 w-8"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Timeline */}
          <div className="space-y-4">
            <h3 className="font-medium">Shipping Progress</h3>
            
            {/* Desktop Timeline */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted">
                  <div 
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center">
                        <div
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10
                            ${isCompleted 
                              ? 'bg-primary text-primary-foreground shadow-lg' 
                              : 'bg-muted text-muted-foreground'
                            }
                            ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}
                          `}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="mt-3 text-center max-w-[100px]">
                          <p className={`text-sm ${isCompleted ? 'font-medium' : 'text-muted-foreground'}`}>
                            {step.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Timeline */}
            <div className="md:hidden space-y-3">
              {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.key} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                          ${isCompleted 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted text-muted-foreground'
                          }
                          ${isCurrent ? 'ring-4 ring-primary/20' : ''}
                        `}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div 
                          className={`w-0.5 h-12 ${isCompleted ? 'bg-primary' : 'bg-muted'}`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p className={`${isCompleted ? 'font-medium' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Current Status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator />

          {/* Carrier Information */}
          <div className="space-y-3">
            <h3 className="font-medium">Carrier Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{trackingInfo.carrier}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{trackingInfo.carrierPhone}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleOpenCarrierWebsite}
                      className="w-full mt-2"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Track on Carrier Website
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Delivery Address
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>{trackingInfo.shippingAddress.name}</p>
                      <p>{trackingInfo.shippingAddress.street}</p>
                      <p>
                        {trackingInfo.shippingAddress.city}, {trackingInfo.shippingAddress.state} {trackingInfo.shippingAddress.zipCode}
                      </p>
                      <p>{trackingInfo.shippingAddress.country}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator />

          {/* Tracking Events */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Tracking History</h3>
              {trackingInfo.trackingEvents.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpandedEvents(!expandedEvents)}
                >
                  {expandedEvents ? 'Show Less' : 'Show All'}
                  <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${expandedEvents ? 'rotate-90' : ''}`} />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {(expandedEvents ? trackingInfo.trackingEvents : trackingInfo.trackingEvents.slice(0, 3)).map((event, index) => (
                <Card key={index} className="hover:bg-accent/50 transition-colors">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center min-w-[60px]">
                        <div className="text-sm font-medium">{event.time}</div>
                        <div className="text-xs text-muted-foreground">{event.date}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{event.status}</p>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Help Section */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Need Help?</p>
                  <p className="text-sm text-muted-foreground">
                    If you have any questions about your delivery, please contact our customer support team.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Support
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
