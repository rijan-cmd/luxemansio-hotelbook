import { createFileRoute } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Luxemansio" },
      { name: "description", content: "Frequently asked questions about booking, payments, cancellations and support." },
      { property: "og:title", content: "FAQ — Luxemansio" },
      { property: "og:description", content: "Answers to the most common questions." },
    ],
  }),
  component: FAQ,
});

const faqs = [
  { q: "How do I book a hotel?", a: "Use the search bar on the homepage to enter your destination and dates. Browse results, open a hotel, choose a room and complete the secure checkout." },
  { q: "How do I cancel a booking?", a: "Sign in to your account and open the booking. Eligible reservations can be cancelled with a single click, free of charge up to 48h before check-in." },
  { q: "What payment methods do you accept?", a: "We accept all major credit and debit cards, Apple Pay, Google Pay, and select regional wallets." },
  { q: "When will I receive booking confirmation?", a: "Immediately. A confirmation with your booking reference is emailed the moment payment is authorized." },
  { q: "What are the standard check-in and check-out times?", a: "Times vary by property but most hotels welcome guests from 3:00 PM and ask you to depart by 12:00 PM." },
  { q: "How do refunds work?", a: "Refunds for eligible cancellations are processed within 5–10 business days to your original payment method." },
  { q: "How do I contact customer support?", a: "Our concierge team is reachable 24/7 by email at concierge@luxemansio.com or by phone at +1 (800) 555-0110." },
];

function FAQ() {
  return (
    <div className="container-page py-16">
      <p className="text-xs uppercase tracking-widest text-gold">Help center</p>
      <h1 className="mt-2 font-display text-4xl text-navy md:text-5xl">Frequently asked questions</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Everything you need to know about booking, payments, and support.
      </p>

      <div className="mt-10 mx-auto max-w-3xl rounded-2xl bg-card ring-1 ring-border p-2 md:p-4">
        <Accordion type="single" collapsible>
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`i-${i}`}>
              <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
