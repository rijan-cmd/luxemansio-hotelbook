import { Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNPR, startingPrice, type Hotel } from "@/lib/hotels";

export function HotelCard({ hotel }: { hotel: Hotel }) {
  const from = startingPrice(hotel);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/60 transition-all hover:shadow-xl hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={hotel.images.main}
          alt={`${hotel.name}, ${hotel.location}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-navy shadow">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-gold text-gold" />
          ))}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-navy/90 px-2.5 py-1 text-xs font-semibold text-gold">
          {hotel.rating.toFixed(1)}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg text-navy">{hotel.name}</h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" /> {hotel.location}
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          <span className="font-semibold text-navy">{hotel.rating.toFixed(1)}</span> guest rating ·{" "}
          {hotel.reviews.toLocaleString()} reviews
        </p>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{hotel.shortDescription}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {hotel.rooms.map((r) => (
            <span
              key={r.id}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] text-secondary-foreground"
            >
              {r.category}
            </span>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-3 pt-1">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">From</p>
            <p className="font-display text-2xl text-navy">
              {formatNPR(from)}
              <span className="font-sans text-xs text-muted-foreground"> per night</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/hotels/$id" params={{ id: hotel.id }}>
                View Details
              </Link>
            </Button>
            <Button asChild size="sm" className="bg-navy text-navy-foreground hover:bg-navy/90">
              <Link to="/booking/$id" params={{ id: hotel.id }} search={{ room: "normal" }}>
                Book Now
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
