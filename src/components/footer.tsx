import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Instagram, Twitter, Facebook, Mail } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../contexts/theme-context";

interface FooterProps {
  onCategoryChange: (category: string | null) => void;
  onQuickLinkClick: (link: string) => void;
  onFeedbackClick?: () => void;
}

export function Footer({ onCategoryChange, onQuickLinkClick, onFeedbackClick }: FooterProps) {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement;
    if (emailInput.value) {
      toast.success("Thank you for subscribing to our newsletter!");
      emailInput.value = '';
    }
  };
  const { theme } = useTheme();
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-black dark:text-white">JHF</h3>
            <p className="text-sm text-muted-foreground">
              Premium fashion for the modern lifestyle. Discover quality clothing that combines style and comfort.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-sky-700 dark:text-sky-300">{theme === 'dark' ? 'Stay Connected' : 'Follow Us'}</p>
              <div className="flex space-x-2">
              <Button variant="ghost" size="icon" className="hover-scale">
                <Instagram className="h-4 w-4 text-sky-700 dark:text-sky-300" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-scale">
                <Twitter className="h-4 w-4 text-sky-700 dark:text-sky-300" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-scale">
                <Facebook className="h-4 w-4 text-sky-700 dark:text-sky-300" />
              </Button>
              <Button variant="ghost" size="icon" className="hover-scale">
                <Mail className="h-4 w-4 text-sky-700 dark:text-sky-300" />
              </Button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-pink-700 dark:text-pink-300">{theme === 'dark' ? 'Useful Links' : 'Quick Links'}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onQuickLinkClick('about')} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onQuickLinkClick('contact')} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Contact
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onQuickLinkClick('size-guide')} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Size Guide
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onQuickLinkClick('shipping')} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onQuickLinkClick('returns')} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Returns
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onQuickLinkClick('privacy')} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onQuickLinkClick('terms')} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Terms of Service
                </button>
              </li>
              {onFeedbackClick && (
                <li>
                  <button 
                    onClick={onFeedbackClick} 
                    className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link font-medium"
                  >
                    📝 Share Feedback
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="font-semibold text-teal-700 dark:text-teal-300">{theme === 'dark' ? 'Browse Categories' : 'Categories'}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => {
                    onCategoryChange("Men's Clothing");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Men's Clothing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onCategoryChange("Women's Clothing");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Women's Clothing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onCategoryChange("Accessories");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Accessories
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onCategoryChange("Footwear");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Footwear
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    onCategoryChange("sale");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  className="text-muted-foreground hover:text-foreground transition-colors text-left cursor-link"
                >
                  Sale Items
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300">{theme === 'dark' ? 'Stay in the Loop' : 'Stay Updated'}</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for exclusive offers and new arrivals.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex space-x-2">
              <Input 
                name="email"
                placeholder="Enter your email" 
                type="email"
                className="flex-1 cursor-input"
                required
              />
              <Button type="submit" className="pulse-on-hover">Subscribe</Button>
            </form>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2024 JHF. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm">
            <button 
              onClick={() => onQuickLinkClick('privacy')}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-link"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => onQuickLinkClick('terms')}
              className="text-muted-foreground hover:text-foreground transition-colors cursor-link"
            >
              Terms of Service
            </button>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors cursor-link">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
