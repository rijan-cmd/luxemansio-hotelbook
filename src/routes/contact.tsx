import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useContactInfo } from "@/lib/cms";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Luxemansio" },
      { name: "description", content: "Get in touch with Luxemansio's concierge team." },
      { property: "og:title", content: "Contact Us — Luxemansio" },
      { property: "og:description", content: "Get in touch with Luxemansio's concierge team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data: info } = useContactInfo();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent — we'll be in touch shortly.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="container-page py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Get in touch</p>
      <h1 className="mt-2 font-display text-4xl text-navy md:text-5xl">We're here to help</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Whether you're planning a trip or need help with an existing booking, our concierge team is a message away.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="rounded-2xl bg-card p-8 ring-1 ring-border">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label>Subject</Label>
              <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label>Message</Label>
              <Textarea rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required className="mt-1" />
            </div>
          </div>
          <Button type="submit" className="mt-6 bg-navy text-navy-foreground hover:bg-navy/90">
            Send message
          </Button>
        </form>

        <aside className="space-y-4">
          <InfoCard icon={<Mail />} title="Email" text={info?.email ?? "concierge@luxemansio.com"} />
          <InfoCard icon={<Phone />} title="Phone" text={info?.phone ?? "+977 1 4000 000 · 24/7"} />
          <InfoCard icon={<MapPin />} title="Headquarters" text={info?.address ?? "Kathmandu, Nepal"} />
          <div className="overflow-hidden rounded-2xl ring-1 ring-border">
            <iframe
              title="Map"
              src={
                info?.map_embed_url ||
                "https://www.openstreetmap.org/export/embed.html?bbox=85.30%2C27.69%2C85.34%2C27.72&layer=mapnik"
              }
              className="h-56 w-full border-0"
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl bg-card p-5 ring-1 ring-border">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-gold">{icon}</div>
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{title}</p>
          <p className="mt-0.5 text-sm font-medium">{text}</p>
        </div>
      </div>
    </div>
  );
}
