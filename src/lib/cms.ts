/**
 * Luxemansio CMS data layer.
 *
 * All public content (hotels, destinations, team, contact) is stored in the
 * Lovable Cloud database and managed from the Admin Dashboard. Visitors read
 * it; only administrators can write it (enforced by database policies).
 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MAX_PRICE, MIN_PRICE, type Hotel, type Room } from "@/lib/hotels";

export const IMAGE_BUCKET = "site-images";

/** Public URL for an image stored in the private admin bucket. */
export function imageUrl(path?: string | null) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  return `/api/public/image/${path}`;
}

/* ── row types ─────────────────────────────────────────────── */

export interface HotelRow {
  id: string;
  name: string;
  destination: string;
  city: string;
  location: string;
  stars: number;
  rating: number;
  reviews: number;
  short_description: string;
  description: string;
  amenities: string[];
  facilities: string[];
  tags: string[];
  view_label: string;
  price_normal: number;
  price_deluxe: number;
  price_suite: number;
  main_image: string | null;
  gallery: string[];
  check_in: string;
  check_out: string;
  cancellation: string;
  breakfast: boolean;
  parking: boolean;
  featured: boolean;
  published: boolean;
}

export interface DestinationRow {
  id: string;
  name: string;
  country: string;
  blurb: string;
  image: string | null;
  sort_order: number;
  published: boolean;
}

export interface TeamMemberRow {
  id: string;
  name: string;
  title: string;
  description: string;
  photo_url: string | null;
  storage_path: string | null;
  sort_order: number;
}

export interface ContactInfoRow {
  id: string;
  email: string;
  phone: string;
  address: string;
  map_embed_url: string;
}

const PLACEHOLDER = "/placeholder.svg";
const clamp = (n: number) => Math.min(MAX_PRICE, Math.max(MIN_PRICE, Number(n) || MIN_PRICE));

/** Maps a database row onto the Hotel shape the existing public UI expects. */
export function rowToHotel(r: HotelRow): Hotel {
  const main = imageUrl(r.main_image) ?? PLACEHOLDER;
  const gallery = (r.gallery ?? []).map((g) => imageUrl(g) ?? PLACEHOLDER);
  const view = r.view_label || "City View";

  const rooms: Room[] = [
    {
      id: "normal",
      category: "Normal",
      name: "Normal Room",
      bed: "Double or Twin Bed",
      maxGuests: 2,
      size: "22 m²",
      facilities: ["Free Wi-Fi", "Private Bathroom", "Flat-screen TV", "Daily Housekeeping"],
      pricePerNight: clamp(r.price_normal),
      image: gallery[0] ?? main,
    },
    {
      id: "deluxe",
      category: "Deluxe",
      name: "Deluxe Room",
      bed: "Queen or King Bed",
      maxGuests: 2,
      size: "32 m²",
      facilities: ["Free Wi-Fi", "Private Bathroom", view, "Air Conditioning / Heating", "Minibar", "Work Desk"],
      pricePerNight: clamp(r.price_deluxe),
      image: gallery[1] ?? main,
    },
    {
      id: "suite",
      category: "Suite",
      name: "Suite",
      bed: "King Bed + Living Area",
      maxGuests: 4,
      size: "48 m²",
      facilities: ["Free Wi-Fi", "Premium Bathroom", view, "Separate Sitting Area", "Bathtub", "Room Service"],
      pricePerNight: clamp(r.price_suite),
      image: gallery[2] ?? main,
    },
  ];

  return {
    id: r.id,
    name: r.name,
    destination: r.destination,
    city: r.city || r.destination,
    country: "Nepal",
    location: r.location,
    stars: r.stars,
    rating: Number(r.rating),
    reviews: r.reviews,
    price: rooms[0].pricePerNight,
    shortDescription: r.short_description,
    description: r.description,
    amenities: r.amenities ?? [],
    facilities: r.facilities ?? [],
    policies: {
      checkIn: r.check_in,
      checkOut: r.check_out,
      cancellation: r.cancellation,
      children: "Children under 5 stay free when using existing bedding. Extra bed on request.",
      payment: "Pay at the hotel or online. Cards, eSewa, Khalti and cash (NPR) accepted.",
      breakfast: r.breakfast,
      parking: r.parking,
      wifi: true,
    },
    images: {
      main,
      gallery: gallery.length ? gallery : [main],
      rooms: { normal: rooms[0].image, deluxe: rooms[1].image, suite: rooms[2].image },
    },
    image: main,
    gallery: gallery.length ? gallery : [main],
    featured: r.featured,
    tags: r.tags ?? [],
    rooms,
    checkIn: r.check_in,
    checkOut: r.check_out,
  };
}

export interface PublicDestination {
  id: string;
  name: string;
  country: string;
  blurb: string;
  image: string;
  hotels: number;
}

/* ── public reads ──────────────────────────────────────────── */

async function fetchHotels(): Promise<Hotel[]> {
  const { data, error } = await supabase
    .from("hotels")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as unknown as HotelRow[]).map(rowToHotel);
}

export function useHotels() {
  return useQuery({ queryKey: ["hotels"], queryFn: fetchHotels });
}

export function useHotel(id: string) {
  return useQuery({
    queryKey: ["hotel", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("hotels").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data ? rowToHotel(data as unknown as HotelRow) : null;
    },
  });
}

export function useDestinations() {
  return useQuery({
    queryKey: ["destinations"],
    queryFn: async (): Promise<PublicDestination[]> => {
      const [{ data, error }, hotelCounts] = await Promise.all([
        supabase
          .from("destinations")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true }),
        supabase.from("hotels").select("destination").eq("published", true),
      ]);
      if (error) throw error;
      const counts = new Map<string, number>();
      for (const h of (hotelCounts.data ?? []) as { destination: string }[]) {
        counts.set(h.destination, (counts.get(h.destination) ?? 0) + 1);
      }
      return (data as unknown as DestinationRow[]).map((d) => ({
        id: d.id,
        name: d.name,
        country: d.country,
        blurb: d.blurb,
        image: imageUrl(d.image) ?? PLACEHOLDER,
        hotels: counts.get(d.name) ?? 0,
      }));
    },
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["team_members"],
    queryFn: async (): Promise<TeamMemberRow[]> => {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as unknown as TeamMemberRow[];
    },
  });
}

export function useContactInfo() {
  return useQuery({
    queryKey: ["contact_info"],
    queryFn: async (): Promise<ContactInfoRow | null> => {
      const { data, error } = await supabase
        .from("contact_info")
        .select("*")
        .eq("id", "main")
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as ContactInfoRow) ?? null;
    },
  });
}

/* ── admin helpers (write access enforced by database policies) ── */

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userData.user.id,
    _role: "admin",
  });
  if (error) return false;
  return Boolean(data);
}

/** Uploads an image to the private admin bucket and returns its storage path. */
export async function uploadImage(folder: string, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from(IMAGE_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (error) throw error;
  return path;
}

export async function deleteImage(path?: string | null) {
  if (!path) return;
  await supabase.storage.from(IMAGE_BUCKET).remove([path]);
}
