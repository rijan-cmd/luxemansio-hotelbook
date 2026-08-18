import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Star, Users, BedDouble, Clock, Check, CreditCard, Baby, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNPR, startingPrice } from "@/lib/hotels";
import { useHotel } from "@/lib/cms";

export const Route = createFileRoute("/hotels/$id")({
  head: () => ({
    meta: [
      { title: "Hotel — Luxemansio" },
      { name: "description", content: "View photos, rooms, amenities and prices for this Luxemansio hotel." },
      { property: "og:title", content: "Hotel — Luxemansio" },
      { property: "og:description", content: "View photos, rooms, amenities and prices for this Luxemansio hotel." },
    ],
  }),
  component: HotelDetails,
});

function HotelDetails() {
  const { id } = Route.useParams();
  const { data: hotel, isLoading } = useHotel(id);
  const [active, setActive] = useState(0);

  if (isLoading) {
    return <div className="container-page py-24 text-center text-sm text-muted-foreground">Loading hotel…</div>;
  }

  if (!hotel) {
    return (
      <div className="container-page py-24 text-center">
        <p className="font-display text-2xl text-navy">Hotel not found</p>
        <Link to="/hotels" className="mt-4 inline-block text-sm text-gold">Browse all hotels</Link>
      </div>
    );
  }

  return (
    <>
      {/* GALLERY */}
      <section className="container-page mt-8">
        <div className="grid gap-2 md:grid-cols-4 md:grid-rows-2">
          <div className="md:col-span-2 md:row-span-2 aspect-[4/3] overflow-hidden rounded-2xl">
            <img src={hotel.images.gallery[active] ?? hotel.images.main} alt={hotel.name} className="h-full w-full object-cover" />
          </div>
          {hotel.images.gallery.slice(0, 4).map((g, i) => (
            <button
              key={g}
              onClick={() => setActive(i)}
              className={`aspect-[4/3] overflow-hidden rounded-2xl ring-2 transition ${
                active === i ? "ring-gold" : "ring-transparent"
              }`}
            >
              <img src={g} alt={`${hotel.name} photo ${i + 1}`} className="h-full w-full object-cover hover:scale-105 transition-transform" />
            </button>
          ))}
        </div>
      </section>

      {/* HEADER */}
      <section className="container-page mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="flex items-center gap-1 text-gold">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-gold" />
            ))}
          </div>
          <h1 className="mt-2 font-display text-4xl text-navy">{hotel.name}</h1>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {hotel.location}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="rounded-lg bg-navy px-2.5 py-1 text-sm font-semibold text-gold">
              {hotel.rating.toFixed(1)}
            </span>
            <span className="text-sm">
              <span className="font-medium">Exceptional</span>{" "}
              <span className="text-muted-foreground">· {hotel.reviews.toLocaleString()} reviews</span>
            </span>
          </div>

          <Tabs defaultValue="overview" className="mt-10">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
              <p>{hotel.description}</p>
              <p>
                Whether you're seeking sun-soaked mornings, cultural immersion, or moments of pure quiet,
                {" "}{hotel.name} is designed to make your stay effortless and unforgettable.
              </p>
            </TabsContent>

            <TabsContent value="amenities" className="mt-6">
              <div className="grid gap-3 sm:grid-cols-2">
                {[...hotel.amenities, ...hotel.facilities].map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-gold" />
                    {a}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rooms" className="mt-6 space-y-4">
              {hotel.rooms.map((r) => (
                <div key={r.id} className="grid gap-6 rounded-2xl bg-card p-4 ring-1 ring-border md:grid-cols-[220px_1fr_auto]">
                  <div className="aspect-[4/3] overflow-hidden rounded-xl">
                    <img src={r.image} alt={r.name} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl text-navy">{r.name}</h3>
                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{r.bed}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Up to {r.maxGuests} guests</span>
                      <span>{r.size}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.facilities.map((f) => (
                        <span key={f} className="rounded-full bg-secondary px-2 py-0.5 text-[11px]">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between gap-2">
                    <div className="text-right">
                      <p className="text-[11px] uppercase text-muted-foreground">From</p>
                      <p className="font-display text-2xl text-navy">{formatNPR(r.pricePerNight)}</p>
                      <p className="text-xs text-muted-foreground">per night</p>
                    </div>
                    <Button asChild className="bg-navy text-navy-foreground hover:bg-navy/90">
                      <Link to="/booking/$id" params={{ id: hotel.id }} search={{ room: r.id }}>
                        Select Room
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="policies" className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Clock className="h-4 w-4" /> Check-in
                </p>
                <p className="mt-2 text-sm text-muted-foreground">From {hotel.checkIn}</p>
              </div>
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Clock className="h-4 w-4" /> Check-out
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Until {hotel.checkOut}</p>
              </div>
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border sm:col-span-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <XCircle className="h-4 w-4" /> Cancellation
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{hotel.policies.cancellation}</p>
              </div>
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Baby className="h-4 w-4" /> Children
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{hotel.policies.children}</p>
              </div>
              <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <CreditCard className="h-4 w-4" /> Payment
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{hotel.policies.payment}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* PRICE CARD */}
        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl bg-card p-6 ring-1 ring-border shadow-lg">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Starting from</p>
          <p className="mt-1 font-display text-4xl text-navy">
            {formatNPR(startingPrice(hotel))}
            <span className="font-sans text-sm text-muted-foreground"> per night</span>
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Includes taxes & fees. Free cancellation up to 48h before check-in.
          </p>
          <Button asChild className="mt-6 w-full bg-gold text-gold-foreground hover:bg-gold/90" size="lg">
            <Link to="/booking/$id" params={{ id: hotel.id }} search={{ room: "normal" }}>
              Book Now
            </Link>
          </Button>
          <Link to="/contact" className="mt-3 block">
            <Button variant="outline" className="w-full" size="lg">Ask a Question</Button>
          </Link>
          <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" />Best-rate promise</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" />Secure payment</li>
            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-gold" />24/7 concierge</li>
          </ul>
        </aside>
      </section>
    </>
  );
}
