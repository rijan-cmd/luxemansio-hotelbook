import { createFileRoute, Link } from "@tanstack/react-router";
import { useDestinations } from "@/lib/cms";

export const Route = createFileRoute("/destinations")({
  head: () => ({
    meta: [
      { title: "Destinations — Luxemansio" },
      { name: "description", content: "Explore top destinations around the world with Luxemansio." },
      { property: "og:title", content: "Destinations — Luxemansio" },
      { property: "og:description", content: "Explore top destinations around the world." },
    ],
  }),
  component: Destinations,
});

function Destinations() {
  const { data: destinations = [], isLoading } = useDestinations();
  return (
    <div className="container-page py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Where to next</p>
      <h1 className="mt-2 font-display text-4xl text-navy md:text-5xl">Popular Destinations</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Timeless capitals, sun-drenched islands, and mountain hideaways — curated for the discerning traveler.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d) => (
          <Link
            key={d.id}
            to="/hotels"
            search={{ destination: d.name } as never}
            className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <img
              src={d.image}
              alt={d.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-xs uppercase tracking-widest text-gold">{d.country}</p>
              <h2 className="mt-1 font-display text-3xl">{d.name}</h2>
              <p className="mt-1 text-sm text-white/80">{d.hotels} hotels available</p>
            </div>
          </Link>
        ))}
      </div>

      {!isLoading && destinations.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="font-display text-xl text-navy">No destinations published yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Please check back soon.</p>
        </div>
      )}
    </div>
  );
}
