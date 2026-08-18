import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBookings, type StoredBooking } from "@/lib/booking-store";
import { formatNPR } from "@/lib/hotels";

export const Route = createFileRoute("/confirmation")({
  head: () => ({
    meta: [
      { title: "Booking Confirmed — Luxemansio" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    ref: typeof s.ref === "string" ? s.ref : "",
  }),
  component: Confirmation,
});

function Confirmation() {
  const { ref } = Route.useSearch();
  const [booking, setBooking] = useState<StoredBooking | null>(null);

  useEffect(() => {
    const b = getBookings().find((x) => x.reference === ref);
    setBooking(b || null);
  }, [ref]);

  if (!booking) {
    return (
      <div className="container-page py-24 text-center">
        <p className="font-display text-2xl text-navy">Booking not found</p>
        <Link to="/hotels" className="mt-4 inline-block">
          <Button>Browse Hotels</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/20 text-gold">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-navy">Booking Confirmed</h1>
        <p className="mt-3 text-muted-foreground">
          Thank you, {booking.guestName.split(" ")[0]}. A confirmation has been sent to {booking.guestEmail}.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-navy px-4 py-1.5 text-sm text-navy-foreground">
          Reference: <span className="font-mono font-semibold text-gold">{booking.reference}</span>
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-card p-8 ring-1 ring-border shadow-lg">
        <h2 className="font-display text-xl text-navy">Reservation details</h2>
        {booking.hotelImage && (
          <img
            src={booking.hotelImage}
            alt={booking.hotelName}
            className="mt-4 h-44 w-full rounded-xl object-cover"
          />
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Item label="Hotel" value={booking.hotelName} />
          <Item label="Room" value={booking.roomName} />
          <Item label="Check-in" value={booking.checkIn} />
          <Item label="Check-out" value={booking.checkOut} />
          <Item label="Nights" value={String(booking.nights)} />
          <Item label="Guests" value={String(booking.guests)} />
          <Item label="Rooms" value={String(booking.rooms)} />
          <Item label="Guest" value={booking.guestName} />
          <Item label="Email" value={booking.guestEmail} />
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-border pt-6">
          <span className="font-display text-lg">Total paid</span>
          <span className="font-display text-2xl text-navy">{formatNPR(booking.total)}</span>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
        <Link to="/account"><Button variant="outline">View my bookings</Button></Link>
        <Link to="/hotels"><Button className="bg-navy text-navy-foreground hover:bg-navy/90">Book another stay</Button></Link>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}
