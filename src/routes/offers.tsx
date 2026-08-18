import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { offers } from "@/lib/hotels";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Special Offers — Luxemansio" },
      { name: "description", content: "Exclusive luxury hotel offers, curated seasonally." },
      { property: "og:title", content: "Special Offers — Luxemansio" },
      { property: "og:description", content: "Exclusive luxury hotel offers." },
    ],
  }),
  component: Offers,
});

function Offers() {
  return (
    <div className="container-page py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Limited time</p>
      <h1 className="mt-2 font-display text-4xl text-navy md:text-5xl">Special Offers</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Handpicked packages to make your next stay even more memorable.
      </p>

      <div className="mt-12 grid gap-8">
        {offers.map((o, i) => (
          <div
            key={o.id}
            className={`grid gap-6 overflow-hidden rounded-2xl bg-card ring-1 ring-border md:grid-cols-2 ${
              i % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
            }`}
          >
            <div className="aspect-[4/3] md:aspect-auto">
              <img src={o.image} alt={o.title} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-12">
              <span className="w-fit rounded-full bg-gold/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-navy">
                {o.tag}
              </span>
              <h2 className="mt-3 font-display text-3xl text-navy">{o.title}</h2>
              <p className="mt-3 text-muted-foreground">{o.description}</p>
              <div className="mt-6">
                <Link to="/hotels">
                  <Button className="bg-navy text-navy-foreground hover:bg-navy/90">Explore Stays</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
