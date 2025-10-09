import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface AccountRecoveryProps {
  isOpen: boolean;
  onClose: () => void;
}

type RecoveryStep = 'select' | 'enter-email' | 'verify-code' | 'reset-password' | 'success';
type RecoveryType = 'password' | 'username';

export function AccountRecovery({ isOpen, onClose }: AccountRecoveryProps) {
  const [currentStep, setCurrentStep] = useState<RecoveryStep>('select');
  const [recoveryType, setRecoveryType] = useState<RecoveryType>('password');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recoveredUsername, setRecoveredUsername] = useState('');

  const handleClose = () => {
    // Reset all states
    setCurrentStep('select');
    setRecoveryType('password');
    setEmail('');
    setVerificationCode('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRecoveredUsername('');
    onClose();
  };

  const handleSelectRecoveryType = (type: RecoveryType) => {
    setRecoveryType(type);
    setCurrentStep('enter-email');
  };

  const handleSendVerificationCode = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(`Verification code sent to ${email}`);
      setCurrentStep('verify-code');
    }, 1500);
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code');
      return;
    }

    if (verificationCode.length !== 6) {
      toast.error('Verification code must be 6 digits');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Mock verification - in real app, verify with backend
      if (verificationCode === '123456') {
        toast.success('Code verified successfully');
        
        if (recoveryType === 'password') {
          setCurrentStep('reset-password');
        } else {
          // For username recovery, show the username
          setRecoveredUsername('john.doe'); // Mock username
          setCurrentStep('success');
        }
      } else {
        toast.error('Invalid verification code. Try 123456 for demo.');
      }
    }, 1000);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Password reset successfully');
      setCurrentStep('success');
    }, 1500);
  };

  const handleResendCode = () => {
    toast.success(`Verification code resent to ${email}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Account Recovery
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'select' && 'Choose what you need help with'}
            {currentStep === 'enter-email' && `Recover your ${recoveryType}`}
            {currentStep === 'verify-code' && 'Verify your email'}
            {currentStep === 'reset-password' && 'Create a new password'}
            {currentStep === 'success' && 'Recovery complete'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step 1: Select Recovery Type */}
          {currentStep === 'select' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid gap-3">
                <Card 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleSelectRecoveryType('password')}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <Lock className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Reset Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Create a new password for your account
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleSelectRecoveryType('username')}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Forgot Username</h3>
                        <p className="text-sm text-muted-foreground">
                          Retrieve your username via email
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  You'll need access to your registered email address to continue.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Step 2: Enter Email */}
          {currentStep === 'enter-email' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="recovery-email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendVerificationCode();
                      }
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll send a verification code to this email address.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('select')}
                  disabled={loading}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSendVerificationCode}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Sending...' : 'Send Code'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Verify Code */}
          {currentStep === 'verify-code' && (
            <div className="space-y-4 animate-fade-in">
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>
                  We sent a 6-digit code to <strong>{email}</strong>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setVerificationCode(value);
                  }}
                  maxLength={6}
                  disabled={loading}
                  className="text-center text-lg tracking-widest"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleVerifyCode();
                    }
                  }}
                />
                <p className="text-sm text-muted-foreground text-center">
                  Demo code: <code className="bg-muted px-2 py-1 rounded">123456</code>
                </p>
              </div>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm"
                >
                  Didn't receive the code? Resend
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('enter-email')}
                  disabled={loading}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleVerifyCode}
                  disabled={loading || verificationCode.length !== 6}
                  className="flex-1"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Reset Password */}
          {currentStep === 'reset-password' && (
            <div className="space-y-4 animate-fade-in">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={loading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleResetPassword();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Alert>
                <ShieldCheck className="h-4 w-4" />
                <AlertDescription>
                  Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep('verify-code')}
                  disabled={loading}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {currentStep === 'success' && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20">
                  <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>

              {recoveryType === 'password' ? (
                <>
                  <div>
                    <h3 className="font-medium mb-2">Password Reset Successful!</h3>
                    <p className="text-sm text-muted-foreground">
                      Your password has been successfully reset. You can now log in with your new password.
                    </p>
                  </div>
                  <Button onClick={handleClose} className="w-full">
                    Go to Login
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-medium mb-2">Username Retrieved!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your username has been sent to <strong>{email}</strong>
                    </p>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Your Username:</p>
                          <p className="font-medium text-lg">{recoveredUsername}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <Button onClick={handleClose} className="w-full">
                    Go to Login
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Help Section */}
        {currentStep !== 'success' && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              Need more help?{' '}
              <Button
                variant="link"
                className="p-0 h-auto text-sm"
                onClick={() => {
                  handleClose();
                  toast.info('Contact support at support@jhfstore.com');
                }}
              >
                Contact Support
              </Button>
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
