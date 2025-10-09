import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Star, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../contexts/user-context";

interface CustomerFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackCategory = "product" | "shipping" | "service" | "website" | "other";

interface FeedbackData {
  id: string;
  userId?: string;
  userName?: string;
  userEmail: string;
  category: FeedbackCategory;
  rating: number;
  message: string;
  date: string;
}

const feedbackCategories = [
  { value: "product", label: "Product Quality", icon: "📦" },
  { value: "shipping", label: "Shipping & Delivery", icon: "🚚" },
  { value: "service", label: "Customer Service", icon: "💬" },
  { value: "website", label: "Website Experience", icon: "💻" },
  { value: "other", label: "Other", icon: "💭" },
];

export function CustomerFeedback({ isOpen, onClose }: CustomerFeedbackProps) {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [category, setCategory] = useState<FeedbackCategory>("product");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!message.trim()) {
      toast.error("Please provide your feedback");
      return;
    }

    if (!email.trim()) {
      toast.error("Please provide your email");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const feedback: FeedbackData = {
      id: `feedback-${Date.now()}`,
      userId: user?.id,
      userName: user?.name,
      userEmail: email,
      category,
      rating,
      message: message.trim(),
      date: new Date().toISOString(),
    };

    // Store feedback in localStorage (in real app, send to backend)
    const existingFeedback = JSON.parse(localStorage.getItem("customer-feedback") || "[]");
    localStorage.setItem("customer-feedback", JSON.stringify([...existingFeedback, feedback]));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Show success message and reset after delay
    setTimeout(() => {
      toast.success("Thank you for your feedback!");
      handleClose();
    }, 2000);
  };

  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setCategory("product");
    setMessage("");
    setEmail(user?.email || "");
    setIsSubmitted(false);
    onClose();
  };

  const renderStars = () => {
    return (
      <div className="flex gap-2 justify-center md:justify-start">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full p-1"
          >
            <Star
              className={`h-8 w-8 md:h-10 md:w-10 transition-colors ${
                star <= (hoveredRating || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <MessageSquare className="h-6 w-6 text-primary" />
            Share Your Feedback
          </DialogTitle>
          <DialogDescription>
            We'd love to hear about your experience shopping with JHF
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 md:py-12 text-center animate-scale-in">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 md:h-20 md:w-20 text-green-500" />
            </div>
            <h3 className="text-xl md:text-2xl mb-2">Thank You!</h3>
            <p className="text-muted-foreground">
              Your feedback has been submitted successfully.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              We appreciate you taking the time to share your thoughts.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section */}
            <div className="space-y-3">
              <Label className="text-base">How would you rate your experience?</Label>
              {renderStars()}
              {rating > 0 && (
                <p className="text-sm text-muted-foreground text-center md:text-left">
                  {rating === 1 && "We're sorry to hear that. We'll do better."}
                  {rating === 2 && "We appreciate your honesty. We'll improve."}
                  {rating === 3 && "Thank you! We're working to do better."}
                  {rating === 4 && "Great! We're glad you had a good experience."}
                  {rating === 5 && "Wonderful! We're thrilled you loved it!"}
                </p>
              )}
            </div>

            {/* Category Section */}
            <div className="space-y-3">
              <Label className="text-base">What's your feedback about?</Label>
              <RadioGroup
                value={category}
                onValueChange={(value) => setCategory(value as FeedbackCategory)}
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {feedbackCategories.map((cat) => (
                  <div key={cat.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={cat.value} id={cat.value} />
                    <Label
                      htmlFor={cat.value}
                      className="flex items-center gap-2 cursor-pointer font-normal"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Message Section */}
            <div className="space-y-3">
              <Label htmlFor="message" className="text-base">
                Tell us more about your experience
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your thoughts, suggestions, or concerns..."
                className="min-h-[120px] md:min-h-[150px] resize-none"
                required
              />
              <p className="text-xs text-muted-foreground">
                {message.length}/1000 characters
              </p>
            </div>

            {/* Email Section */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base">
                Your Email {!user && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={!!user}
              />
              {user && (
                <p className="text-xs text-muted-foreground">
                  We'll use your account email to follow up if needed
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={isSubmitting || rating === 0 || !message.trim() || !email.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Feedback
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
