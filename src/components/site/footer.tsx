import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logoAsset from "@/assets/luxemansio-logo.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-navy text-navy-foreground">
      <div className="container-page py-16 grid gap-12 lg:grid-cols-4">
        <div>
          <img
            src={logoAsset.url}
            alt="Luxemansio — Elevate Every Space"
            className="w-56 max-w-full"
            loading="lazy"
          />
          <p className="mt-4 text-sm text-white/70 leading-relaxed">
            Discover exceptional stays around the world. Curated luxury hotels, honest reviews, effortless booking.
          </p>
          <div className="mt-6 flex gap-3">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full border border-white/20 hover:bg-gold hover:text-navy hover:border-gold transition-colors"
                aria-label="Social"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide text-gold uppercase">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/hotels" className="hover:text-gold">Browse Hotels</Link></li>
            <li><Link to="/destinations" className="hover:text-gold">Destinations</Link></li>
            <li><Link to="/offers" className="hover:text-gold">Special Offers</Link></li>
            <li><Link to="/about" className="hover:text-gold">About Us</Link></li>
            <li><Link to="/team" className="hover:text-gold">Our Team</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide text-gold uppercase">Support</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link to="/contact" className="hover:text-gold">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:text-gold">FAQ</Link></li>
            <li><Link to="/faq" className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/faq" className="hover:text-gold">Terms & Conditions</Link></li>
            <li><Link to="/faq" className="hover:text-gold">Cancellation Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold tracking-wide text-gold uppercase">Stay Inspired</h4>
          <p className="mt-4 text-sm text-white/70">
            Join our newsletter for exclusive offers and travel stories.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex gap-2"
          >
            <Input
              type="email"
              placeholder="Your email"
              className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
            />
            <Button type="submit" className="bg-gold text-gold-foreground hover:bg-gold/90">
              Join
            </Button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-6 text-xs text-white/50 flex flex-wrap gap-2 justify-between">
          <span>© {new Date().getFullYear()} Luxemansio. All rights reserved.</span>
          <span className="flex gap-4">
            <Link to="/admin/login" className="hover:text-gold">
              Staff Login
            </Link>
            Crafted for discerning travelers.
          </span>
        </div>
      </div>
    </footer>
  );
}
