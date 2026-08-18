/**
 * Luxemansio hotel inventory — Nepal beachhead market.
 * All prices are in NPR (रू) and must stay within रू 2,000 – रू 9,500 per night.
 */

export const MIN_PRICE = 2000;
export const MAX_PRICE = 9500;

export const CURRENCY = "रू";

export function formatNPR(amount: number) {
  return `${CURRENCY} ${Math.round(amount).toLocaleString("en-IN")}`;
}

export type RoomCategory = "Normal" | "Deluxe" | "Suite";

export interface Room {
  id: string;
  category: RoomCategory;
  name: string;
  bed: string;
  maxGuests: number;
  size: string;
  facilities: string[];
  pricePerNight: number;
  image: string;
}

/**
 * Per-hotel image set. EVERY hotel owns its own copy of this object, so
 * replacing one hotel's photo can never affect another hotel.
 *
 * To swap in a real photo, just paste a new URL (or an imported asset URL)
 * over the existing string below in SPECS.
 */
export interface HotelImages {
  /** Main / hero photo shown on cards and at the top of the detail page. */
  main: string;
  /** 4-6 photos shown in the detail-page gallery. */
  gallery: string[];
  /** One photo per room category. */
  rooms: {
    normal: string;
    deluxe: string;
    suite: string;
  };
}

export interface Policies {
  checkIn: string;
  checkOut: string;
  cancellation: string;
  children: string;
  payment: string;
  breakfast: boolean;
  parking: boolean;
  wifi: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  destination: string;
  city: string;
  country: "Nepal";
  location: string;
  stars: number;
  /** Guest rating out of 5 */
  rating: number;
  reviews: number;
  price: number;
  shortDescription: string;
  description: string;
  amenities: string[];
  facilities: string[];
  policies: Policies;
  /** The hotel's own image set — see HotelImages. */
  images: HotelImages;
  /** convenience alias for images.main */
  image: string;
  /** convenience alias for images.gallery */
  gallery: string[];
  featured?: boolean;
  tags: string[];
  rooms: Room[];
  /** legacy convenience fields used across the UI */
  checkIn: string;
  checkOut: string;
}

const img = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const ROOM_CATEGORIES: RoomCategory[] = ["Normal", "Deluxe", "Suite"];

export const AMENITY_FILTERS = [
  "Free Wi-Fi",
  "Breakfast included",
  "Parking",
  "Swimming pool",
  "Restaurant",
  "Air conditioning",
  "Heating",
  "Mountain view",
  "Lake view",
  "Family friendly",
];

export const offers = [
  {
    id: "early-bird",
    title: "Early Bird — Save 20%",
    description: "Book 30 days ahead on any stay in Nepal and save a fifth of your room rate.",
    tag: "Limited Time",
    image: img("photo-1551882547-ff40c63fe5fa", 900),
  },
  {
    id: "chitwan-safari",
    title: "Chitwan Safari Weekend",
    description: "Two nights in Sauraha with a jeep safari, canoe ride and Tharu culture evening.",
    tag: "Adventure",
    image: img("photo-1516426122078-c23e76319801", 900),
  },
  {
    id: "nagarkot-sunrise",
    title: "Nagarkot Sunrise Escape",
    description: "A ridge-top night with 5:30 AM sunrise tea and a guided walk to Changunarayan.",
    tag: "Weekend",
    image: img("photo-1519681393784-d120267933ba", 900),
  },
];

export function startingPrice(h: Hotel) {
  return Math.min(...h.rooms.map((r) => r.pricePerNight));
}
