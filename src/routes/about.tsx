import { createFileRoute } from "@tanstack/react-router";
import { Globe, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { TeamSection } from "@/components/site/team-section";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Luxemansio" },
      { name: "description", content: "Luxemansio's mission is to make luxury hotel booking simple, transparent, and delightful." },
      { property: "og:title", content: "About Us — Luxemansio" },
      { property: "og:description", content: "Luxury hotel booking, thoughtfully designed." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
        <div className="relative container-page py-24 md:py-32 text-white">
          <p className="text-xs uppercase tracking-widest text-gold">About Luxemansio</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl max-w-2xl">
            Thoughtful travel, effortlessly booked.
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Luxemansio is a modern hotel booking platform on a mission to make discovering and reserving
            exceptional accommodations simple, convenient, and reliable — wherever your journey takes you.
          </p>
        </div>
      </section>

      <section className="container-page mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Our story</p>
          <h2 className="mt-2 font-display text-3xl text-navy">Travel, reimagined for the modern guest</h2>
          <div className="mt-6 space-y-4 text-foreground/85 leading-relaxed">
            <p>
              We built Luxemansio because we believe booking a beautiful stay should feel as considered
              as the stay itself. No cluttered pages, no hidden fees, no guesswork — just a curated
              collection of hotels and a booking experience worthy of them.
            </p>
            <p>
              From beachfront villas to alpine chalets and heritage city palaces, every property on
              Luxemansio is vetted by our team of travel editors.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: Sparkles, title: "Curated selection", text: "Only the properties we would book ourselves." },
            { icon: ShieldCheck, title: "Trusted", text: "Secure payments and honest, verified reviews." },
            { icon: Globe, title: "Global reach", text: "Stays in over 90 countries and growing." },
            { icon: Heart, title: "Human support", text: "Real concierge help, day or night." },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl bg-card p-6 ring-1 ring-border">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-navy text-gold">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg text-navy">{v.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="rounded-3xl bg-secondary/60 p-12 text-center">
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { n: "600+", l: "Curated hotels" },
              { n: "90+", l: "Countries" },
              { n: "1.2M", l: "Happy guests" },
              { n: "4.9★", l: "Average rating" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-4xl text-navy">{s.n}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeamSection />
    </>
  );
}
