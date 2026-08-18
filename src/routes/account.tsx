import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import { cancelBooking, getBookings, getUser, setUser, type StoredBooking, type StoredUser } from "@/lib/booking-store";
import { formatNPR } from "@/lib/hotels";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [{ title: "My Account — Luxemansio" }, { name: "robots", content: "noindex" }],
  }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const [user, setLocalUser] = useState<StoredUser | null>(null);
  const [bookings, setBookings] = useState<StoredBooking[]>([]);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      navigate({ to: "/login" });
      return;
    }
    setLocalUser(u);
    setBookings(getBookings());
  }, [navigate]);

  const refresh = () => setBookings(getBookings());

  const doCancel = (ref: string) => {
    cancelBooking(ref);
    refresh();
    toast.success("Booking cancelled");
  };

  const logout = () => {
    setUser(null);
    navigate({ to: "/" });
  };

  if (!user) return null;

  const upcoming = bookings.filter((b) => b.status === "confirmed" && new Date(b.checkIn) >= new Date());
  const past = bookings.filter((b) => b.status !== "confirmed" || new Date(b.checkIn) < new Date());

  return (
    <div className="container-page py-16">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">My account</p>
          <h1 className="mt-2 font-display text-3xl text-navy md:text-4xl">Welcome, {user.name.split(" ")[0]}</h1>
        </div>
        <Button variant="outline" onClick={logout} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      <Tabs defaultValue="upcoming" className="mt-10">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="history">History ({past.length})</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {upcoming.length === 0 ? (
            <EmptyState />
          ) : (
            upcoming.map((b) => <BookingRow key={b.reference} b={b} onCancel={() => doCancel(b.reference)} />)
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-4">
          {past.length === 0 ? (
            <p className="text-sm text-muted-foreground">No past bookings yet.</p>
          ) : (
            past.map((b) => <BookingRow key={b.reference} b={b} />)
          )}
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <ProfileForm user={user} onSave={(u) => { setUser(u); setLocalUser(u); toast.success("Profile updated"); }} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BookingRow({ b, onCancel }: { b: StoredBooking; onCancel?: () => void }) {
  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex gap-4">
          {b.hotelImage && (
            <img src={b.hotelImage} alt={b.hotelName} className="h-24 w-32 shrink-0 rounded-xl object-cover" />
          )}
          <div>
          <div className="flex items-center gap-2">
            <p className="font-display text-lg text-navy">{b.hotelName}</p>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
              b.status === "confirmed" ? "bg-gold/20 text-navy" : "bg-destructive/10 text-destructive"
            }`}>{b.status}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {b.roomName} · {b.rooms} room{b.rooms > 1 ? "s" : ""} · {b.nights} night{b.nights > 1 ? "s" : ""} · {b.guests} guest{b.guests > 1 ? "s" : ""}
          </p>
          <p className="mt-1 text-sm">{b.checkIn} → {b.checkOut}</p>
          <p className="mt-2 text-xs text-muted-foreground">Ref: <span className="font-mono">{b.reference}</span></p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl text-navy">{formatNPR(b.total)}</p>
          <div className="mt-3 flex gap-2 justify-end">
            <Link to="/hotels/$id" params={{ id: b.hotelId }}>
              <Button size="sm" variant="outline">View hotel</Button>
            </Link>
            {onCancel && b.status === "confirmed" && (
              <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center">
      <p className="font-display text-xl text-navy">No upcoming bookings</p>
      <p className="mt-1 text-sm text-muted-foreground">Ready to plan your next escape?</p>
      <Link to="/hotels" className="mt-4 inline-block">
        <Button className="bg-navy text-navy-foreground hover:bg-navy/90">Browse hotels</Button>
      </Link>
    </div>
  );
}

function ProfileForm({ user, onSave }: { user: StoredUser; onSave: (u: StoredUser) => void }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave({ name, email }); }}
      className="max-w-md rounded-2xl bg-card p-6 ring-1 ring-border space-y-4"
    >
      <div>
        <Label>Full name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
      </div>
      <Button type="submit" className="bg-navy text-navy-foreground hover:bg-navy/90">Save changes</Button>
    </form>
  );
}
