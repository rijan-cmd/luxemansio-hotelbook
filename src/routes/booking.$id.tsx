import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, Users, CreditCard, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getHotel, formatNPR } from "@/lib/hotels";
import { saveBooking, generateRef, getUser } from "@/lib/booking-store";
import { toast } from "sonner";

interface Search {
  room?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
}

export const Route = createFileRoute("/booking/$id")({
  loader: ({ params }) => {
    const hotel = getHotel(params.id);
    if (!hotel) throw notFound();
    return { hotel };
  },
  validateSearch: (s: Record<string, unknown>): Search => ({
    room: typeof s.room === "string" ? s.room : undefined,
    checkIn: typeof s.checkIn === "string" ? s.checkIn : undefined,
    checkOut: typeof s.checkOut === "string" ? s.checkOut : undefined,
    guests: typeof s.guests === "number" ? s.guests : undefined,
    rooms: typeof s.rooms === "number" ? s.rooms : undefined,
  }),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Book ${loaderData.hotel.name} — Luxemansio` },
          { name: "description", content: `Complete your reservation at ${loaderData.hotel.name}.` },
          { name: "robots", content: "noindex" },
        ]
      : [{ title: "Booking — Luxemansio" }, { name: "robots", content: "noindex" }],
  }),
  component: BookingPage,
});

function BookingPage() {
  const { hotel } = Route.useLoaderData() as { hotel: import("@/lib/hotels").Hotel };
  const search = Route.useSearch();
  const navigate = useNavigate();

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const [checkIn, setCheckIn] = useState(search.checkIn || today);
  const [checkOut, setCheckOut] = useState(search.checkOut || tomorrow);
  const [guests, setGuests] = useState(search.guests || 2);
  const [roomCount, setRoomCount] = useState(search.rooms || 1);
  const [roomId, setRoomId] = useState(search.room || hotel.rooms[0].id);
  const user = typeof window !== "undefined" ? getUser() : null;
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const room = hotel.rooms.find((r) => r.id === roomId) || hotel.rooms[0];

  const nights = useMemo(() => {
    const ms = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    return Math.max(1, Math.round(ms / 86400000));
  }, [checkIn, checkOut]);

  const roomTotal = room.pricePerNight * nights * roomCount;
  const taxes = Math.round(roomTotal * 0.12);
  const total = roomTotal + taxes;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please enter your name and email");
      return;
    }
    const ref = generateRef();
    saveBooking({
      reference: ref,
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.images.main,
      hotelLocation: hotel.location,
      roomName: room.name,
      checkIn,
      checkOut,
      nights,
      guests,
      rooms: roomCount,
      total,
      guestName: name,
      guestEmail: email,
      createdAt: new Date().toISOString(),
      status: "confirmed",
    });
    navigate({ to: "/confirmation", search: { ref } as never });
  };

  return (
    <div className="container-page mt-10 mb-24">
      <p className="text-xs uppercase tracking-widest text-gold">Complete your booking</p>
      <h1 className="mt-2 font-display text-3xl text-navy md:text-4xl">Reserve your stay at {hotel.name}</h1>

      <form onSubmit={submit} className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          {/* STAY DETAILS */}
          <Section title="Stay details">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Check-in</Label>
                <div className="relative mt-1">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div>
                <Label>Check-out</Label>
                <div className="relative mt-1">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div>
                <Label>Guests</Label>
                <Select value={String(guests)} onValueChange={(v) => setGuests(Number(v))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} guest{n > 1 ? "s" : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Room type</Label>
                <Select value={roomId} onValueChange={setRoomId}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {hotel.rooms.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name} — {formatNPR(r.pricePerNight)}/night
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Number of rooms</Label>
                <Select value={String(roomCount)} onValueChange={(v) => setRoomCount(Number(v))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} room{n > 1 ? "s" : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          {/* CUSTOMER */}
          <Section title="Guest information">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label>Full name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="mt-1" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@email.com" className="mt-1" required />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" className="mt-1" />
              </div>
              <div className="sm:col-span-2">
                <Label>Special requests (optional)</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Airport pickup, dietary preferences, celebrations…" className="mt-1" rows={3} />
              </div>
            </div>
          </Section>

          {/* PAYMENT */}
          <Section title="Secure payment" icon={<Lock className="h-4 w-4 text-gold" />}>
            <div className="grid gap-4">
              <div>
                <Label>Card number</Label>
                <div className="relative mt-1">
                  <CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={card} onChange={(e) => setCard(e.target.value)} placeholder="•••• •••• •••• ••••" className="pl-9" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Expiry</Label>
                  <Input value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" className="mt-1" />
                </div>
                <div>
                  <Label>CVV</Label>
                  <Input value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" className="mt-1" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" /> Your payment is encrypted end-to-end.
              </p>
            </div>
          </Section>
        </div>

        {/* SUMMARY */}
        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl bg-card p-6 ring-1 ring-border shadow-lg">
          <div className="flex gap-3">
            <img src={hotel.images.main} alt={hotel.name} className="h-20 w-20 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="font-display text-lg text-navy truncate">{hotel.name}</p>
              <p className="text-xs text-muted-foreground">{hotel.location}</p>
              <p className="mt-1 text-xs">{room.name}</p>
            </div>
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <Row label="Check-in" value={checkIn} />
            <Row label="Check-out" value={checkOut} />
            <Row label="Nights" value={String(nights)} />
            <Row label={<span className="flex items-center gap-1"><Users className="h-3 w-3" />Guests</span>} value={String(guests)} />
            <Row label="Rooms" value={String(roomCount)} />
          </div>

          <div className="mt-6 border-t border-border pt-4 space-y-2 text-sm">
            <Row
              label={`${formatNPR(room.pricePerNight)} × ${nights} night${nights > 1 ? "s" : ""} × ${roomCount} room${roomCount > 1 ? "s" : ""}`}
              value={formatNPR(roomTotal)}
            />
            <Row label="Taxes & fees (12%)" value={formatNPR(taxes)} />
          </div>

          <div className="mt-4 border-t border-border pt-4 flex items-baseline justify-between">
            <span className="font-display text-lg text-navy">Total</span>
            <span className="font-display text-2xl text-navy">{formatNPR(total)}</span>
          </div>

          <Button type="submit" size="lg" className="mt-6 w-full bg-gold text-gold-foreground hover:bg-gold/90">
            Confirm & Pay
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
            <Check className="h-3 w-3 text-gold" /> Free cancellation until 48h before check-in
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By continuing you agree to our <Link to="/faq" className="underline">terms</Link>.
          </p>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
      <h2 className="font-display text-xl text-navy flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: string }) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}
