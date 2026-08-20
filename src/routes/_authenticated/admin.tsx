import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, LogOut, MapPin, Phone, Plus, ShieldCheck, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { TeamAvatar } from "@/components/site/team-section";
import { GalleryField, ImageField } from "@/components/admin/image-field";
import {
  imageUrl,
  isCurrentUserAdmin,
  useContactInfo,
  useDestinations,
  useTeamMembers,
  type ContactInfoRow,
  type DestinationRow,
  type HotelRow,
  type TeamMemberRow,
} from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Luxemansio" },
      {
        name: "description",
        content: "Manage Luxemansio hotels, destinations, team and contact details securely.",
      },
      { property: "og:title", content: "Admin Dashboard — Luxemansio" },
      { property: "og:description", content: "Manage Luxemansio website content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboard,
});

/* ────────────────────────────────────────────────────────── */

function AdminDashboard() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      setIsAdmin(await isCurrentUserAdmin());
      setChecking(false);
    })();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  if (checking) {
    return (
      <div className="container-page py-24 text-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-card p-8 text-center ring-1 ring-border shadow-lg">
          <ShieldCheck className="mx-auto h-8 w-8 text-gold" />
          <h1 className="mt-4 font-display text-2xl text-navy">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account does not have administrator permissions. Contact a Luxemansio
            administrator if you believe this is a mistake.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button variant="ghost" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
            <Link to="/" className="text-sm text-muted-foreground hover:text-navy">
              Back to Luxemansio
            </Link>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="container-page py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
            <ShieldCheck className="h-4 w-4" /> Admin Dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl text-navy">Manage your website</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Everything you change here appears on the public Luxemansio website right away.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/">View website</Link>
          </Button>
          <Button variant="ghost" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hotels" className="mt-10">
        <TabsList>
          <TabsTrigger value="hotels" className="gap-1.5">
            <Building2 className="h-4 w-4" /> Hotels
          </TabsTrigger>
          <TabsTrigger value="destinations" className="gap-1.5">
            <MapPin className="h-4 w-4" /> Destinations
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-1.5">
            <Users className="h-4 w-4" /> Team
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-1.5">
            <Phone className="h-4 w-4" /> Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hotels" className="mt-8">
          <HotelsManager />
        </TabsContent>
        <TabsContent value="destinations" className="mt-8">
          <DestinationsManager />
        </TabsContent>
        <TabsContent value="team" className="mt-8">
          <TeamManager />
        </TabsContent>
        <TabsContent value="contact" className="mt-8">
          <ContactManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ── shared bits ───────────────────────────────────────────── */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl bg-card p-6 ring-1 ring-border/60">{children}</div>;
}

const csv = (arr: string[]) => arr.join(", ");
const parseCsv = (v: string) =>
  v.split(",").map((s) => s.trim()).filter(Boolean);

/* ── hotels ────────────────────────────────────────────────── */

const emptyHotel = (): HotelRow => ({
  id: "",
  name: "",
  destination: "",
  city: "",
  location: "",
  stars: 5,
  rating: 4.8,
  reviews: 0,
  short_description: "",
  description: "",
  amenities: ["Free Wi-Fi", "Breakfast included", "Parking"],
  facilities: ["24/7 Front Desk", "Restaurant"],
  tags: [],
  view_label: "City View",
  price_normal: 6000,
  price_deluxe: 9000,
  price_suite: 15000,
  main_image: null,
  gallery: [],
  check_in: "2:00 PM",
  check_out: "12:00 PM",
  cancellation: "Free cancellation up to 24 hours before check-in.",
  breakfast: true,
  parking: true,
  featured: false,
  published: true,
});

function useAdminHotels() {
  const [rows, setRows] = useState<HotelRow[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const { data, error } = await supabase
      .from("hotels")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data ?? []) as unknown as HotelRow[]);
    setLoading(false);
  };
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { rows, loading, reload: load };
}

function HotelsManager() {
  const { rows, loading, reload } = useAdminHotels();
  const [editing, setEditing] = useState<HotelRow | null>(null);
  const qc = useQueryClient();

  const afterSave = async () => {
    setEditing(null);
    await reload();
    await qc.invalidateQueries();
  };

  const remove = async (h: HotelRow) => {
    if (!confirm(`Delete "${h.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("hotels").delete().eq("id", h.id);
    if (error) return toast.error(error.message);
    toast.success("Hotel deleted");
    await afterSave();
  };

  if (editing) {
    return <HotelForm hotel={editing} onCancel={() => setEditing(null)} onSaved={afterSave} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${rows.length} hotel${rows.length === 1 ? "" : "s"}`}
        </p>
        <Button onClick={() => setEditing(emptyHotel())} className="gap-1.5 bg-navy text-navy-foreground hover:bg-navy/90">
          <Plus className="h-4 w-4" /> Add hotel
        </Button>
      </div>

      <div className="mt-6 grid gap-4">
        {rows.map((h) => (
          <div
            key={h.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-border/60"
          >
            <div className="h-16 w-24 overflow-hidden rounded-lg bg-muted">
              {h.main_image && (
                <img src={imageUrl(h.main_image) ?? ""} alt={h.name} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="min-w-48 flex-1">
              <p className="font-display text-lg text-navy">{h.name || "Untitled hotel"}</p>
              <p className="text-xs text-muted-foreground">
                {h.destination} · {h.stars}★ · {h.published ? "Published" : "Hidden"}
                {h.featured ? " · Featured" : ""}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(h)}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={() => remove(h)}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
        {!loading && rows.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="font-display text-lg text-navy">No hotels yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Add your first property to publish it on the website.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function HotelForm({
  hotel,
  onCancel,
  onSaved,
}: {
  hotel: HotelRow;
  onCancel: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const [f, setF] = useState<HotelRow>(hotel);
  const [saving, setSaving] = useState(false);
  const set = <K extends keyof HotelRow>(k: K, v: HotelRow[K]) => setF((p) => ({ ...p, [k]: v }));

  const save = async () => {
    if (!f.name.trim() || !f.destination.trim()) {
      return toast.error("Hotel name and destination are required");
    }
    setSaving(true);
    const { id, ...payload } = f;
    const body = { ...payload, city: f.city || f.destination };
    const query = id
      ? supabase.from("hotels").update(body as never).eq("id", id)
      : supabase.from("hotels").insert(body as never);
    const { error } = await query;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(id ? "Hotel updated" : "Hotel added");
    await onSaved();
  };

  return (
    <Panel>
      <h2 className="font-display text-2xl text-navy">{f.id ? "Edit hotel" : "New hotel"}</h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Field label="Hotel name">
          <Input value={f.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="Destination (must match a destination name)">
          <Input value={f.destination} onChange={(e) => set("destination", e.target.value)} />
        </Field>
        <Field label="City">
          <Input value={f.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
        <Field label="Location / address line">
          <Input value={f.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
        <Field label="Stars (1-5)">
          <Input
            type="number"
            min={1}
            max={5}
            value={f.stars}
            onChange={(e) => set("stars", Number(e.target.value))}
          />
        </Field>
        <Field label="Guest rating (0-5)">
          <Input
            type="number"
            step="0.1"
            min={0}
            max={5}
            value={f.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
          />
        </Field>
        <Field label="Number of reviews">
          <Input type="number" min={0} value={f.reviews} onChange={(e) => set("reviews", Number(e.target.value))} />
        </Field>
        <Field label="Room view label (e.g. Lake View)">
          <Input value={f.view_label} onChange={(e) => set("view_label", e.target.value)} />
        </Field>
      </div>

      <div className="mt-5 grid gap-5">
        <Field label="Short description (shown on cards)">
          <Textarea rows={2} value={f.short_description} onChange={(e) => set("short_description", e.target.value)} />
        </Field>
        <Field label="Full description">
          <Textarea rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Field label="Normal room price (NPR / night)">
          <Input type="number" value={f.price_normal} onChange={(e) => set("price_normal", Number(e.target.value))} />
        </Field>
        <Field label="Deluxe room price (NPR / night)">
          <Input type="number" value={f.price_deluxe} onChange={(e) => set("price_deluxe", Number(e.target.value))} />
        </Field>
        <Field label="Suite price (NPR / night)">
          <Input type="number" value={f.price_suite} onChange={(e) => set("price_suite", Number(e.target.value))} />
        </Field>
      </div>

      <div className="mt-5 grid gap-5">
        <Field label="Amenities (comma separated)">
          <Input value={csv(f.amenities ?? [])} onChange={(e) => set("amenities", parseCsv(e.target.value))} />
        </Field>
        <Field label="Facilities (comma separated)">
          <Input value={csv(f.facilities ?? [])} onChange={(e) => set("facilities", parseCsv(e.target.value))} />
        </Field>
        <Field label="Tags (comma separated)">
          <Input value={csv(f.tags ?? [])} onChange={(e) => set("tags", parseCsv(e.target.value))} />
        </Field>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <Field label="Check-in time">
          <Input value={f.check_in} onChange={(e) => set("check_in", e.target.value)} />
        </Field>
        <Field label="Check-out time">
          <Input value={f.check_out} onChange={(e) => set("check_out", e.target.value)} />
        </Field>
        <Field label="Cancellation policy">
          <Input value={f.cancellation} onChange={(e) => set("cancellation", e.target.value)} />
        </Field>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ImageField
          label="Main photo"
          folder="hotels"
          value={f.main_image}
          onChange={(p) => set("main_image", p)}
          className="h-44 w-full"
        />
        <div className="flex flex-col justify-center gap-4">
          <ToggleRow label="Breakfast included" checked={f.breakfast} onChange={(v) => set("breakfast", v)} />
          <ToggleRow label="Parking available" checked={f.parking} onChange={(v) => set("parking", v)} />
          <ToggleRow label="Show as featured on the homepage" checked={f.featured} onChange={(v) => set("featured", v)} />
          <ToggleRow label="Published (visible to visitors)" checked={f.published} onChange={(v) => set("published", v)} />
        </div>
      </div>

      <div className="mt-6">
        <GalleryField folder="hotels" value={f.gallery ?? []} onChange={(g) => set("gallery", g)} />
      </div>

      <div className="mt-8 flex gap-2">
        <Button onClick={save} disabled={saving} className="bg-navy text-navy-foreground hover:bg-navy/90">
          {saving ? "Saving…" : "Save hotel"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </Panel>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3 text-sm">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}

/* ── destinations ──────────────────────────────────────────── */

function DestinationsManager() {
  const { data: _pub } = useDestinations();
  const qc = useQueryClient();
  const [rows, setRows] = useState<DestinationRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    setRows((data ?? []) as unknown as DestinationRow[]);
    setLoading(false);
  };
  useEffect(() => {
    void load();
  }, []);

  const patch = (id: string, p: Partial<DestinationRow>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...p } : r)));

  const save = async (d: DestinationRow) => {
    const { id, ...payload } = d;
    const { error } = await supabase.from("destinations").update(payload as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Destination saved");
    await qc.invalidateQueries();
  };

  const add = async () => {
    const { error } = await supabase.from("destinations").insert({
      name: "New destination",
      country: "Nepal",
      blurb: "",
      sort_order: rows.length + 1,
      published: false,
    } as never);
    if (error) return toast.error(error.message);
    await load();
  };

  const remove = async (d: DestinationRow) => {
    if (!confirm(`Delete "${d.name}"?`)) return;
    const { error } = await supabase.from("destinations").delete().eq("id", d.id);
    if (error) return toast.error(error.message);
    await load();
    await qc.invalidateQueries();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? "Loading…" : `${rows.length} destination${rows.length === 1 ? "" : "s"}`}
        </p>
        <Button onClick={add} className="gap-1.5 bg-navy text-navy-foreground hover:bg-navy/90">
          <Plus className="h-4 w-4" /> Add destination
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {rows.map((d) => (
          <Panel key={d.id}>
            <div className="grid gap-4">
              <Field label="Name">
                <Input value={d.name} onChange={(e) => patch(d.id, { name: e.target.value })} />
              </Field>
              <Field label="Country">
                <Input value={d.country} onChange={(e) => patch(d.id, { country: e.target.value })} />
              </Field>
              <Field label="Short blurb">
                <Textarea rows={2} value={d.blurb} onChange={(e) => patch(d.id, { blurb: e.target.value })} />
              </Field>
              <Field label="Display order">
                <Input
                  type="number"
                  value={d.sort_order}
                  onChange={(e) => patch(d.id, { sort_order: Number(e.target.value) })}
                />
              </Field>
              <ImageField
                label="Photo"
                folder="destinations"
                value={d.image}
                onChange={(p) => patch(d.id, { image: p })}
                className="h-36 w-full"
              />
              <ToggleRow
                label="Published"
                checked={d.published}
                onChange={(v) => patch(d.id, { published: v })}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={() => save(d)} className="bg-navy text-navy-foreground hover:bg-navy/90">
                  Save
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5 text-destructive" onClick={() => remove(d)}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}

/* ── team ──────────────────────────────────────────────────── */

function TeamManager() {
  const { data: members = [], refetch } = useTeamMembers();
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Record<string, TeamMemberRow>>({});

  const rows = members.map((m) => draft[m.id] ?? m);
  const patch = (m: TeamMemberRow, p: Partial<TeamMemberRow>) =>
    setDraft((prev) => ({ ...prev, [m.id]: { ...(prev[m.id] ?? m), ...p } }));

  const save = async (m: TeamMemberRow) => {
    const { id, ...payload } = m;
    const { error } = await supabase.from("team_members").update(payload as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`${m.name} updated`);
    await refetch();
    await qc.invalidateQueries({ queryKey: ["team_members"] });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {rows.map((m) => (
        <Panel key={m.id}>
          <div className="flex items-start gap-4">
            <TeamAvatar member={m} className="h-20 w-20 shrink-0" />
            <div className="grid flex-1 gap-4">
              <Field label="Name">
                <Input value={m.name} onChange={(e) => patch(m, { name: e.target.value })} />
              </Field>
              <Field label="Role / title">
                <Input value={m.title} onChange={(e) => patch(m, { title: e.target.value })} />
              </Field>
              <Field label="Description">
                <Textarea rows={3} value={m.description} onChange={(e) => patch(m, { description: e.target.value })} />
              </Field>
              <ImageField
                label="Photo"
                folder="team"
                value={m.storage_path}
                onChange={(p) => patch(m, { storage_path: p })}
                className="h-32 w-32 rounded-full"
              />
              <div>
                <Button size="sm" onClick={() => save(m)} className="bg-navy text-navy-foreground hover:bg-navy/90">
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}

/* ── contact ───────────────────────────────────────────────── */

function ContactManager() {
  const { data, refetch } = useContactInfo();
  const qc = useQueryClient();
  const [f, setF] = useState<ContactInfoRow | null>(null);
  useEffect(() => {
    if (data) setF(data);
  }, [data]);

  if (!f) return <p className="text-sm text-muted-foreground">Loading…</p>;

  const set = <K extends keyof ContactInfoRow>(k: K, v: ContactInfoRow[K]) =>
    setF((p) => (p ? { ...p, [k]: v } : p));

  const save = async () => {
    const { id, ...payload } = f;
    const { error } = await supabase.from("contact_info").update(payload as never).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Contact details updated");
    await refetch();
    await qc.invalidateQueries({ queryKey: ["contact_info"] });
  };

  return (
    <Panel>
      <div className="grid max-w-2xl gap-5">
        <Field label="Email address">
          <Input value={f.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone number">
          <Input value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Address">
          <Textarea rows={2} value={f.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="Map embed URL">
          <Input value={f.map_embed_url} onChange={(e) => set("map_embed_url", e.target.value)} />
        </Field>
        <div>
          <Button onClick={save} className="bg-navy text-navy-foreground hover:bg-navy/90">
            Save contact details
          </Button>
        </div>
      </div>
    </Panel>
  );
}
