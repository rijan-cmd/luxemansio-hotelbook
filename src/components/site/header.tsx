import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUser, setUser, type StoredUser } from "@/lib/booking-store";
import markAsset from "@/assets/luxemansio-mark.png.asset.json";

const nav = [
  { to: "/", label: "Home" },
  { to: "/destinations", label: "Destinations" },
  { to: "/hotels", label: "Hotels" },
  { to: "/offers", label: "Offers" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Our Team" },
  { to: "/account", label: "My Bookings" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [user, setLocalUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setLocalUser(getUser());
    const h = () => setLocalUser(getUser());
    window.addEventListener("luxemansio-auth", h);
    return () => window.removeEventListener("luxemansio-auth", h);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="container-page flex h-18 items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={markAsset.url}
            alt="Luxemansio logo"
            className="h-10 w-10 object-contain"
          />
          <span className="font-display text-xl tracking-wide text-navy">
            Luxemansio
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm text-foreground/80 hover:text-navy transition-colors"
              activeProps={{ className: "text-navy font-medium" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <Link to="/account">
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                {user.name.split(" ")[0]}
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" size="sm" className="rounded-full px-5">Sign Up</Button>
              </Link>
            </>
          )}
          <Link to="/hotels">
            <Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90 rounded-full px-5">
              Book Now
            </Button>
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md hover:bg-accent"
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-page py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-foreground/80"
              >
                {n.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3">
              {user ? (
                <Link to="/account" onClick={() => setOpen(false)} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">My Account</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Sign Up</Button>
                  </Link>
                </>
              )}
              <Link to="/hotels" onClick={() => setOpen(false)} className="flex-1">
                <Button size="sm" className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
