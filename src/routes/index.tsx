import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Sparkles, HandCoins, Headphones, Award, ArrowRight, Star, Quote } from "lucide-react";
import { HotelSearchBar } from "@/components/site/search-bar";
import { HotelCard } from "@/components/site/hotel-card";
import { Button } from "@/components/ui/button";
import { hotels, destinations, offers } from "@/lib/hotels";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxemansio — Find Your Perfect Stay" },
      {
        name: "description",
        content:
          "Discover exceptional hotels, compare your options, and book your perfect stay with ease.",
      },
      { property: "og:title", content: "Luxemansio — Find Your Perfect Stay" },
      {
        property: "og:description",
        content: "Discover exceptional hotels, compare your options, and book your perfect stay with ease.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = hotels.filter((h) => h.featured);
  const recommended = hotels.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
            alt="Himalayan mountain resort view in Nepal"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/70 via-navy/50 to-navy/70" />
        </div>

        <div className="relative container-page py-24 md:py-36 lg:py-44">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/30 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              Handpicked luxury stays worldwide
            </span>
            <h1 className="mt-6 font-display text-4xl leading-tight text-white md:text-6xl lg:text-7xl">
              Find Your Perfect Stay <br />
              <span className="text-gold">with Luxemansio</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              Discover exceptional hotels, compare your options, and book your perfect stay with ease.
            </p>
          </div>

          <div className="relative mt-10 md:mt-14">
            <HotelSearchBar />
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <Section
        eyebrow="Curated Collection"
        title="Featured Hotels"
        subtitle="Standout properties chosen by our travel editors."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </Section>

      {/* DESTINATIONS */}
      <Section
        eyebrow="Explore"
        title="Popular Destinations"
        subtitle="From cliffside villages to timeless capitals."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <Link
              key={d.name}
              to="/hotels"
              search={{ destination: d.name } as never}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img
                src={d.image}
                alt={d.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs uppercase tracking-widest text-gold">{d.country}</p>
                <h3 className="mt-1 font-display text-2xl">{d.name}</h3>
                <p className="mt-1 text-sm text-white/80">{d.hotels} hotels</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* RECOMMENDED */}
      <Section
        eyebrow="For You"
        title="Recommended Stays"
        subtitle="Loved by travelers with taste like yours."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {recommended.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      </Section>

      {/* WHY */}
      <section className="mt-24 bg-secondary/60 py-20">
        <div className="container-page">
          <Heading
            eyebrow="Why Luxemansio"
            title="An experience worth booking"
            subtitle="Every detail thought through — so you can focus on the journey."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {[
              { icon: Award, title: "Best Hotel Selection", text: "Every property vetted by our editors." },
              { icon: ShieldCheck, title: "Secure Booking", text: "Bank-grade encryption on every reservation." },
              { icon: Sparkles, title: "Easy Reservations", text: "Book in under 60 seconds." },
              { icon: HandCoins, title: "Competitive Prices", text: "Best-rate promise on every stay." },
              { icon: Headphones, title: "Trusted Support", text: "Concierge team available 24/7." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl bg-card p-6 ring-1 ring-border/60">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-navy text-gold">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg text-navy">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <Section
        eyebrow="Guest Voices"
        title="Loved by travelers worldwide"
        subtitle="Real reviews from real Luxemansio guests."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              name: "Amelia R.",
              hotel: "Taj Lake Palace Udaipur",
              text: "The boat arrival at sunset was magical. Every detail felt like a royal experience. Absolutely worth every rupee.",
            },
            {
              name: "Kenji T.",
              hotel: "Park Hyatt Sydney",
              text: "Waking up to the Opera House view from our suite was unforgettable. Luxemansio made the booking seamless.",
            },
            {
              name: "Priya S.",
              hotel: "The Oberoi Amarvilas",
              text: "Curated options, transparent pricing, and a view of the Taj Mahal from our room. My go-to platform.",
            },
          ].map((r) => (
            <figure key={r.name} className="rounded-2xl bg-card p-8 ring-1 ring-border/60">
              <Quote className="h-6 w-6 text-gold" />
              <blockquote className="mt-4 text-sm text-foreground/85 leading-relaxed">
                "{r.text}"
              </blockquote>
              <div className="mt-6 flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold" />
                ))}
              </div>
              <figcaption className="mt-3 text-sm">
                <span className="font-medium text-navy">{r.name}</span>
                <span className="text-muted-foreground"> · {r.hotel}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* OFFERS */}
      <Section
        eyebrow="Special Offers"
        title="Enjoy more for less"
        subtitle="Limited-time packages crafted for memorable escapes."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {offers.map((o) => (
            <Link
              key={o.id}
              to="/offers"
              className="group relative overflow-hidden rounded-2xl"
            >
              <div className="aspect-[4/5]">
                <img
                  src={o.image}
                  alt={o.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-navy">
                  {o.tag}
                </span>
                <h3 className="mt-3 font-display text-xl">{o.title}</h3>
                <p className="mt-1 text-sm text-white/85">{o.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="mt-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-navy px-8 py-16 text-center text-navy-foreground md:px-16 md:py-24">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl md:text-5xl">
                Your next escape is a click away
              </h2>
              <p className="mt-4 text-white/75">
                Browse a curated selection of the world's finest hotels and book with confidence.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link to="/hotels">
                  <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 rounded-full px-8">
                    Browse Hotels <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/destinations">
                  <Button size="lg" variant="outline" className="rounded-full border-white/30 bg-transparent text-white hover:bg-white/10 px-8">
                    Explore Destinations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="container-page mt-24">
      <Heading eyebrow={eyebrow} title={title} subtitle={subtitle} />
      <div className="mt-10">{children}</div>
    </section>
  );
}

function Heading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl text-navy md:text-4xl">{title}</h2>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
