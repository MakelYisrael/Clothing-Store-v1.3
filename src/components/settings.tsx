import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { useUser } from "../contexts/user-context";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { User, Bell, Lock, Palette, MessageSquare, Mail, Shield, Trash2, Eye, EyeOff, Plus, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { listAddresses, addAddress, deleteAddress, setDefaultAddress, Address } from "../services/addresses";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackClick: () => void;
}

interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  newArrivals: boolean;
  priceDrops: boolean;
  newsletter: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export function Settings({ isOpen, onClose, onFeedbackClick }: SettingsProps) {
  const { user, updateUserProfile } = useUser();
  const { theme, setTheme } = useTheme();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddr, setNewAddr] = useState<Address>({ name: "", street: "", city: "", state: "", zipCode: "", country: "", phone: "", isDefault: false });

  const loadAddresses = async () => {
    if (!user?.id) { setAddresses([]); return; }
    const list = await listAddresses(user.id);
    setAddresses(list);
  };

  useEffect(() => {
    loadAddresses();
  }, [user?.id]);

  // Personal Info State
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.email.split('@')[0] || "");
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Notification Preferences State
  const [notifications, setNotifications] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('notification-preferences');
    return saved ? JSON.parse(saved) : {
      orderUpdates: true,
      promotions: true,
      newArrivals: true,
      priceDrops: true,
      newsletter: false,
      emailNotifications: true,
      pushNotifications: false,
    };
  });

  const handleSavePersonalInfo = () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error("Please enter a valid email");
      return;
    }

    updateUserProfile({ name, email });
    toast.success("Personal information updated successfully");
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // In a real app, this would verify current password and update
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleNotificationToggle = (key: keyof NotificationPreferences) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('notification-preferences', JSON.stringify(updated));
    toast.success("Notification preferences updated");
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme} mode`);
  };

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account deletion is not available in demo mode");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="account">
              <User className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <Mail className="h-4 w-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Palette className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="johndoe"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Username cannot be changed
                    </p>
                  </div>

                  <Button onClick={handleSavePersonalInfo} className="w-full md:w-auto">
                    Save Changes
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Account Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Type:</span>
                    <span>{user?.isSeller ? 'Seller Account' : 'Buyer Account'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member Since:</span>
                    <span>January 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email Verified:</span>
                    <span className="text-green-600">✓ Verified</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Feedback
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Help us improve your experience by sharing your thoughts
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    onClose();
                    onFeedbackClick();
                  }}
                  className="w-full md:w-auto"
                >
                  Share Feedback
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose what updates you'd like to receive via email
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="order-updates">Order Updates</Label>
                    <p className="text-xs text-muted-foreground">
                      Get notified about your order status
                    </p>
                  </div>
                  <Switch
                    id="order-updates"
                    checked={notifications.orderUpdates}
                    onCheckedChange={() => handleNotificationToggle('orderUpdates')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="promotions">Promotions & Deals</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive exclusive offers and discounts
                    </p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={notifications.promotions}
                    onCheckedChange={() => handleNotificationToggle('promotions')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-arrivals">New Arrivals</Label>
                    <p className="text-xs text-muted-foreground">
                      Be the first to know about new products
                    </p>
                  </div>
                  <Switch
                    id="new-arrivals"
                    checked={notifications.newArrivals}
                    onCheckedChange={() => handleNotificationToggle('newArrivals')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="price-drops">Price Drop Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Get alerts when wishlist items go on sale
                    </p>
                  </div>
                  <Switch
                    id="price-drops"
                    checked={notifications.priceDrops}
                    onCheckedChange={() => handleNotificationToggle('priceDrops')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="newsletter">Weekly Newsletter</Label>
                    <p className="text-xs text-muted-foreground">
                      Style tips, trends, and curated collections
                    </p>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={notifications.newsletter}
                    onCheckedChange={() => handleNotificationToggle('newsletter')}
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Communication Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={notifications.emailNotifications}
                    onCheckedChange={() => handleNotificationToggle('emailNotifications')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notif">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">
                      Receive browser push notifications
                    </p>
                  </div>
                  <Switch
                    id="push-notif"
                    checked={notifications.pushNotifications}
                    onCheckedChange={() => handleNotificationToggle('pushNotifications')}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6 mt-6">
            {!user ? (
              <Alert>
                <AlertDescription>Sign in to manage your addresses.</AlertDescription>
              </Alert>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Saved Addresses</h3>
                  <div className="space-y-3">
                    {addresses.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No addresses saved yet.</p>
                    ) : (
                      addresses.map((addr) => (
                        <div key={addr.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="font-medium flex items-center gap-2">
                              {addr.isDefault && (
                                <span className="inline-flex items-center text-green-600 text-xs font-semibold">
                                  <CheckCircle2 className="h-4 w-4 mr-1" /> Default
                                </span>
                              )}
                              <span>{addr.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {!addr.isDefault && (
                                <Button size="sm" variant="outline" onClick={async () => {
                                  await setDefaultAddress(user.id, addr.id!);
                                  await loadAddresses();
                                  toast.success("Default address set");
                                }}>Set Default</Button>
                              )}
                              <Button size="icon" variant="ghost" onClick={async () => {
                                await deleteAddress(user.id, addr.id!);
                                await loadAddresses();
                                toast.success("Address deleted");
                              }}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>{addr.street}</div>
                            <div>{addr.city}, {addr.state} {addr.zipCode}</div>
                            <div>{addr.country}</div>
                            {addr.phone && <div>Phone: {addr.phone}</div>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Add New Address</h3>
                  <form className="space-y-3" onSubmit={async (e) => {
                    e.preventDefault();
                    if (!newAddr.name || !newAddr.street || !newAddr.city || !newAddr.state || !newAddr.zipCode || !newAddr.country) {
                      toast.error("Please fill all required fields");
                      return;
                    }
                    const created = await addAddress(user.id, newAddr);
                    if (newAddr.isDefault && created?.id) {
                      await setDefaultAddress(user.id, created.id);
                    }
                    setNewAddr({ name: "", street: "", city: "", state: "", zipCode: "", country: "", phone: "", isDefault: false });
                    await loadAddresses();
                    toast.success("Address saved");
                  }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Full Name</Label>
                        <Input value={newAddr.name} onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })} required />
                      </div>
                      <div className="space-y-1">
                        <Label>Phone (optional)</Label>
                        <Input value={newAddr.phone || ""} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <Label>Street Address</Label>
                        <Input value={newAddr.street} onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} required />
                      </div>
                      <div className="space-y-1">
                        <Label>City</Label>
                        <Input value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} required />
                      </div>
                      <div className="space-y-1">
                        <Label>State</Label>
                        <Input value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} required />
                      </div>
                      <div className="space-y-1">
                        <Label>ZIP Code</Label>
                        <Input value={newAddr.zipCode} onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })} required />
                      </div>
                      <div className="space-y-1">
                        <Label>Country</Label>
                        <Input value={newAddr.country} onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })} required />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Checkbox id="defaultAddr" checked={newAddr.isDefault} onCheckedChange={(v) => setNewAddr({ ...newAddr, isDefault: Boolean(v) })} />
                      <Label htmlFor="defaultAddr">Set as default</Label>
                    </div>
                    <Button type="submit" className="mt-2">
                      <Plus className="h-4 w-4 mr-2" /> Save Address
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Appearance</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Customize how JHF looks to you
              </p>

              <div className="space-y-4">
                <Label>Theme</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('light')}
                    className="h-24 flex flex-col gap-2"
                  >
                    <div className="h-12 w-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                      ☀️
                    </div>
                    Light Mode
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => handleThemeChange('dark')}
                    className="h-24 flex flex-col gap-2"
                  >
                    <div className="h-12 w-12 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
                      🌙
                    </div>
                    Dark Mode
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Shopping Preferences</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your shopping experience
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Save items for later</Label>
                    <p className="text-xs text-muted-foreground">
                      Keep items in cart between sessions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show recommendations</Label>
                    <p className="text-xs text-muted-foreground">
                      See personalized product suggestions
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Change Password</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Update your password to keep your account secure
              </p>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password (min. 8 characters)"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button onClick={handleChangePassword} className="w-full md:w-auto">
                  Update Password
                </Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button variant="outline" disabled>
                Enable 2FA (Coming Soon)
              </Button>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-2 text-destructive flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Delete Account
              </h3>
              <Alert className="mb-4">
                <AlertDescription>
                  Deleting your account is permanent and cannot be undone. All your data, orders, and preferences will be permanently deleted.
                </AlertDescription>
              </Alert>
              <Button variant="destructive" onClick={handleDeleteAccount}>
                Delete My Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
