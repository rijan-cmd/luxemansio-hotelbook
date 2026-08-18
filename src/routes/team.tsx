import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TeamSection } from "@/components/site/team-section";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Our Team — Luxemansio" },
      { name: "description", content: "Meet the founders behind Luxemansio — a team combining technology, creativity, strategy, and entrepreneurship to redefine luxury travel booking." },
      { property: "og:title", content: "Our Team — Luxemansio" },
      { property: "og:description", content: "Meet the founders behind Luxemansio — a team combining technology, creativity, strategy, and entrepreneurship." },
    ],
  }),
  component: Team,
});




function Team() {
  return (
    <>
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-navy/70" />
        </div>
        <div className="relative container-page py-24 md:py-32 text-white">
          <p className="text-xs uppercase tracking-widest text-gold">The People</p>
          <h1 className="mt-3 font-display text-4xl md:text-6xl max-w-3xl">
            Meet the Team Behind Luxemansio
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Four minds combining technology, creativity, strategy, and entrepreneurship to create a better way to discover exceptional stays.
          </p>
        </div>
      </section>

      <TeamSection />


      <section className="container-page mt-20 md:mt-28">
        <div className="rounded-3xl bg-secondary/60 px-6 py-16 md:px-12 text-center">
          <p className="text-xs uppercase tracking-widest text-gold">Our Purpose</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl text-navy">
            Built with Purpose. Designed for Discovery.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-foreground/85 leading-relaxed">
            Luxemansio brings together technology, business strategy, creativity, and marketing to create a modern luxury hotel discovery and booking experience.
          </p>
          <div className="mt-8">
            <Link to="/">
              <Button className="bg-navy text-navy-foreground hover:bg-navy/90 rounded-full px-6">
                Explore Luxemansio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
