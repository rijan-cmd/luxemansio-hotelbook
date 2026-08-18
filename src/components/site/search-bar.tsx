import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Calendar, Users, BedDouble, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HotelSearchBar({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/hotels",
      search: { destination, checkIn, checkOut, guests, rooms } as never,
    });
  };

  return (
    <form
      onSubmit={submit}
      className={`grid gap-3 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5 md:grid-cols-[1.4fr_1fr_1fr_0.9fr_0.9fr_auto] md:gap-2 md:p-3 ${
        compact ? "" : ""
      }`}
    >
      <Field icon={<MapPin className="h-4 w-4" />} label="Destination">
        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="City or hotel"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </Field>
      <Field icon={<Calendar className="h-4 w-4" />} label="Check-in">
        <input
          type="date"
          value={checkIn}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </Field>
      <Field icon={<Calendar className="h-4 w-4" />} label="Check-out">
        <input
          type="date"
          value={checkOut}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full bg-transparent text-sm outline-none"
        />
      </Field>
      <Field icon={<Users className="h-4 w-4" />} label="Guests">
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full bg-transparent text-sm outline-none"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>
          ))}
        </select>
      </Field>
      <Field icon={<BedDouble className="h-4 w-4" />} label="Rooms">
        <select
          value={rooms}
          onChange={(e) => setRooms(Number(e.target.value))}
          className="w-full bg-transparent text-sm outline-none"
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>{n} room{n > 1 ? "s" : ""}</option>
          ))}
        </select>
      </Field>
      <Button
        type="submit"
        className="h-full min-h-12 rounded-xl bg-navy px-6 text-navy-foreground hover:bg-navy/90 gap-2"
      >
        <Search className="h-4 w-4" />
        <span className="font-medium">Search</span>
      </Button>
    </form>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 rounded-xl border border-border/60 px-3 py-2 focus-within:border-gold focus-within:ring-1 focus-within:ring-gold/40">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}
