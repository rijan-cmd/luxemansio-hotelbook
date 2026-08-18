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

/* ── shared image pools per destination ─────────────────────────── */
const POOLS: Record<string, string[]> = {
  Kathmandu: [
    "photo-1605640840605-14ac1855827b",
    "photo-1566073771259-6a8506099945",
    "photo-1590490360182-c33d57733427",
    "photo-1631049307264-da0ec9d70304",
    "photo-1618773928121-c32242e63f39",
    "photo-1584132967334-10e028bd69f7",
  ],
  Pokhara: [
    "photo-1551882547-ff40c63fe5fa",
    "photo-1571401835393-8c5f35328320",
    "photo-1590490360182-c33d57733427",
    "photo-1578683010236-d716f9a3f461",
    "photo-1596178065887-1198b6148b2b",
    "photo-1611892440504-42a792e24d32",
  ],
  Chitwan: [
    "photo-1516426122078-c23e76319801",
    "photo-1587061949409-02df41d5e562",
    "photo-1582610116397-edb318620f90",
    "photo-1618221195710-dd6b41faaea6",
    "photo-1540541338287-41700207dee6",
    "photo-1505873242700-f289a29e1e0f",
  ],
  Lumbini: [
    "photo-1548013146-72479768bada",
    "photo-1552832230-c0197dd311b5",
    "photo-1600585154340-be6161a56a0c",
    "photo-1522708323590-d24dbb6b0267",
    "photo-1631049307264-da0ec9d70304",
    "photo-1600607687920-4e2a09cf159d",
  ],
  Nagarkot: [
    "photo-1519681393784-d120267933ba",
    "photo-1506905925346-21bda4d32df4",
    "photo-1551632436-cbf8dd35adfa",
    "photo-1587061949409-02df41d5e562",
    "photo-1600566753086-00f18fb6b3ea",
    "photo-1445019980597-93fa8acb246c",
  ],
  Bandipur: [
    "photo-1464822759023-fed622ff2c3b",
    "photo-1470071459604-3b5ec3a7fe05",
    "photo-1502005229762-cf1b2da7c5d6",
    "photo-1493809842364-78817add7ffb",
    "photo-1600210492486-724fe5c67fb0",
    "photo-1449844908441-8829872d2607",
  ],
  Bhaktapur: [
    "photo-1567337710282-00832b415979",
    "photo-1590073844006-33379778ae09",
    "photo-1595576508898-0ad5c879a061",
    "photo-1606402179428-a57976d71fa4",
    "photo-1584132915807-fd1f5fbc078f",
    "photo-1616486338812-3dadae4b4ace",
  ],
  Dhulikhel: [
    "photo-1518602164578-cd0074062767",
    "photo-1483729558449-99ef09a8c325",
    "photo-1571003123894-1f0594d2b5d9",
    "photo-1522798514-97ceb8c4f1c8",
    "photo-1578683010236-d716f9a3f461",
    "photo-1517320964276-a002fa203177",
  ],
};

interface Spec {
  id: string;
  name: string;
  destination: keyof typeof POOLS;
  images: HotelImages;
  location: string;
  stars: number;
  rating: number;
  reviews: number;
  prices: [number, number, number];
  short: string;
  description: string;
  amenities: string[];
  facilities: string[];
  tags: string[];
  view: string;
  featured?: boolean;
  breakfast?: boolean;
  parking?: boolean;
  cancellation?: string;
  checkIn?: string;
  checkOut?: string;
}

const clamp = (n: number) => Math.min(MAX_PRICE, Math.max(MIN_PRICE, n));

function build(s: Spec): Hotel {
  const rooms: Room[] = [
    {
      id: "normal",
      category: "Normal",
      name: "Normal Room",
      bed: "Double or Twin Bed",
      maxGuests: 2,
      size: "22 m²",
      facilities: ["Free Wi-Fi", "Private Bathroom", "Flat-screen TV", "Daily Housekeeping"],
      pricePerNight: clamp(s.prices[0]),
      image: s.images.rooms.normal,
    },
    {
      id: "deluxe",
      category: "Deluxe",
      name: "Deluxe Room",
      bed: "Queen or King Bed",
      maxGuests: 2,
      size: "32 m²",
      facilities: ["Free Wi-Fi", "Private Bathroom", s.view, "Air Conditioning / Heating", "Minibar", "Work Desk"],
      pricePerNight: clamp(s.prices[1]),
      image: s.images.rooms.deluxe,
    },
    {
      id: "suite",
      category: "Suite",
      name: "Suite",
      bed: "King Bed + Living Area",
      maxGuests: 4,
      size: "48 m²",
      facilities: ["Free Wi-Fi", "Premium Bathroom", s.view, "Separate Sitting Area", "Bathtub", "Room Service"],
      pricePerNight: clamp(s.prices[2]),
      image: s.images.rooms.suite,
    },
  ];

  return {
    id: s.id,
    name: s.name,
    destination: s.destination,
    city: s.destination,
    country: "Nepal",
    location: s.location,
    stars: s.stars,
    rating: s.rating,
    reviews: s.reviews,
    price: rooms[0].pricePerNight,
    shortDescription: s.short,
    description: s.description,
    amenities: s.amenities,
    facilities: s.facilities,
    policies: {
      checkIn: s.checkIn ?? "2:00 PM",
      checkOut: s.checkOut ?? "12:00 PM",
      cancellation: s.cancellation ?? "Free cancellation up to 24 hours before check-in.",
      children: "Children under 5 stay free when using existing bedding. Extra bed on request.",
      payment: "Pay at the hotel or online. Cards, eSewa, Khalti and cash (NPR) accepted.",
      breakfast: s.breakfast ?? true,
      parking: s.parking ?? true,
      wifi: true,
    },
    images: s.images,
    image: s.images.main,
    gallery: s.images.gallery,
    featured: s.featured,
    tags: s.tags,
    rooms,
    checkIn: s.checkIn ?? "2:00 PM",
    checkOut: s.checkOut ?? "12:00 PM",
  };
}

const SPECS: Spec[] = [
  /* ── Kathmandu Valley ── */
  {
    id: "yak-and-yeti",
    name: "Hotel Yak & Yeti",
    destination: "Kathmandu",
    images: {
      main: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Durbar Marg, Kathmandu",
    stars: 5,
    rating: 4.6,
    reviews: 2418,
    prices: [4200, 6500, 9200],
    short: "Landmark five-star hotel beside Durbar Marg with a historic Rana palace wing.",
    description:
      "Built around the 19th-century Lal Durbar palace, Hotel Yak & Yeti pairs Rana-era architecture with a full modern business hotel. Steps from Durbar Marg shopping, a 10-minute walk to Thamel and 20 minutes from Tribhuvan International Airport, it is a favourite of corporate travellers and families exploring the Kathmandu Valley.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Air conditioning", "Parking", "Family friendly"],
    facilities: ["Casino", "Spa & Sauna", "Fitness Centre", "Business Centre", "Three Restaurants", "Garden Terrace"],
    tags: ["Business", "Heritage", "City Centre"],
    view: "Garden View",
    featured: true,
  },
  {
    id: "hotel-shanker",
    name: "Hotel Shanker",
    destination: "Kathmandu",
    images: {
      main: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Lazimpat, Kathmandu",
    stars: 4,
    rating: 4.4,
    reviews: 1562,
    prices: [3200, 4800, 7200],
    short: "A converted white palace in Lazimpat with wide lawns and Newari detail.",
    description:
      "Once a Rana palace, Hotel Shanker keeps its neoclassical façade, chandeliers and sprawling lawns while offering comfortable modern rooms. It sits in quiet Lazimpat, close to embassies and a short ride from Thamel and Kathmandu Durbar Square.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Parking", "Air conditioning"],
    facilities: ["Palace Garden", "Kunti Bar", "Conference Halls", "Fitness Room", "Travel Desk"],
    tags: ["Heritage", "Garden", "Quiet"],
    view: "Palace Garden View",
    featured: true,
  },
  {
    id: "kathmandu-marriott",
    name: "Kathmandu Marriott Hotel",
    destination: "Kathmandu",
    images: {
      main: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Naxal, Kathmandu",
    stars: 5,
    rating: 4.7,
    reviews: 1893,
    prices: [4800, 7000, 9500],
    short: "Contemporary international five-star with a rooftop pool over the city.",
    description:
      "The Kathmandu Marriott brings polished international service to Naxal, with spacious rooms, an all-day dining room, a rooftop pool and one of the city's best-equipped meeting floors. Ideal for business trips and comfortable first nights in Nepal.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Air conditioning", "Parking"],
    facilities: ["Rooftop Pool", "Quan Spa", "24h Fitness", "Executive Lounge", "Ballroom", "Airport Shuttle"],
    tags: ["Business", "Modern", "Luxury"],
    view: "City View",
    featured: true,
    cancellation: "Free cancellation up to 48 hours before check-in.",
  },
  {
    id: "aloft-thamel",
    name: "Aloft Kathmandu Thamel",
    destination: "Kathmandu",
    images: {
      main: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Thamel, Kathmandu",
    stars: 4,
    rating: 4.5,
    reviews: 1327,
    prices: [3800, 5600, 8200],
    short: "Bright, design-led rooms in the heart of Thamel's nightlife and trekking shops.",
    description:
      "Aloft sits right at the edge of Thamel, so the trekking outfitters, cafés and live-music bars are on your doorstep. Rooms are loft-style with big windows, and the rooftop bar looks across the old city towards the hills.",
    amenities: ["Free Wi-Fi", "Restaurant", "Swimming pool", "Air conditioning", "Parking", "Breakfast included"],
    facilities: ["Rooftop Bar", "Re:charge Gym", "Meeting Studios", "Grab & Go Café"],
    tags: ["Thamel", "Nightlife", "Modern"],
    view: "City View",
  },
  {
    id: "hotel-mulberry",
    name: "Hotel Mulberry",
    destination: "Kathmandu",
    images: {
      main: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Jyatha, Thamel, Kathmandu",
    stars: 4,
    rating: 4.3,
    reviews: 894,
    prices: [2800, 4200, 6400],
    short: "Calm boutique hotel a lane away from Thamel, with a leafy courtyard pool.",
    description:
      "Hotel Mulberry hides just off the Thamel crowds on Jyatha, with a small courtyard pool, a warm timber lobby and staff who arrange treks and valley tours. Great value for travellers who want central Kathmandu without the noise.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Parking", "Family friendly"],
    facilities: ["Courtyard Pool", "Rooftop Terrace", "Spa", "Trekking Desk"],
    tags: ["Boutique", "Value", "Thamel"],
    view: "Courtyard View",
  },
  {
    id: "hotel-himalaya",
    name: "Hotel Himalaya",
    destination: "Kathmandu",
    images: {
      main: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1605640840605-14ac1855827b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Kupondole Heights, Lalitpur",
    stars: 4,
    rating: 4.2,
    reviews: 1105,
    prices: [2600, 3900, 6000],
    short: "Lalitpur classic with a big garden pool and Himalayan views on clear days.",
    description:
      "Perched on Kupondole Heights between Kathmandu and Patan, Hotel Himalaya is known for its large outdoor pool, tennis court and mountain panorama on clear mornings. Patan Durbar Square is a ten-minute drive away.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Parking", "Mountain view"],
    facilities: ["Tennis Court", "Garden Pool", "Base Camp Coffee Shop", "Banquet Halls"],
    tags: ["Patan", "Family", "Value"],
    view: "Mountain View",
  },
  {
    id: "patan-newari-house",
    name: "Patan Newari House",
    destination: "Kathmandu",
    images: {
      main: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Patan Durbar Square, Lalitpur",
    stars: 3,
    rating: 4.4,
    reviews: 612,
    prices: [2000, 3100, 4800],
    short: "Restored Newari townhouse steps from Patan Durbar Square.",
    description:
      "A family-run guesthouse inside a restored Newari townhouse, with carved wooden windows, brick courtyards and a rooftop that looks straight onto the temples of Patan Durbar Square. Simple, spotless and genuinely local.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Family friendly", "Heating"],
    facilities: ["Rooftop Café", "Courtyard", "Bicycle Hire", "Cultural Tours"],
    tags: ["Heritage", "Budget", "Patan"],
    view: "Temple View",
    parking: false,
  },

  /* ── Pokhara ── */
  {
    id: "temple-tree",
    name: "Temple Tree Resort & Spa",
    destination: "Pokhara",
    images: {
      main: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Gaurighat, Lakeside, Pokhara",
    stars: 4,
    rating: 4.7,
    reviews: 2044,
    prices: [4500, 6200, 8800],
    short: "Stone-and-slate resort with a garden pool, minutes from Phewa Lake.",
    description:
      "Temple Tree blends traditional Nepali stone architecture with a resort layout of gardens, ponds and a heated pool. It sits on the quiet northern stretch of Lakeside, a short walk from Phewa Lake and the boat jetties, with the Annapurna range visible on clear mornings.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Air conditioning", "Parking", "Mountain view"],
    facilities: ["Full-service Spa", "Heated Pool", "Yoga Deck", "Gurkha Bar", "Paragliding Desk"],
    tags: ["Lakeside", "Spa", "Romantic"],
    view: "Mountain View",
    featured: true,
  },
  {
    id: "hotel-barahi",
    name: "Hotel Barahi",
    destination: "Pokhara",
    images: {
      main: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Lakeside Road, Pokhara",
    stars: 4,
    rating: 4.5,
    reviews: 2311,
    prices: [3600, 5500, 8000],
    short: "Long-standing Lakeside favourite with two pools and lake-facing rooms.",
    description:
      "Right on the main Lakeside strip, Hotel Barahi puts the lake promenade, cafés and boat hire at your door. Two pools, a large breakfast spread and lake-facing balconies make it a reliable Pokhara base for families and couples alike.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Air conditioning", "Parking", "Lake view", "Family friendly"],
    facilities: ["Two Swimming Pools", "Barahi Spa", "Lakeside Garden", "Bar & Grill", "Tour Desk"],
    tags: ["Lakeside", "Family", "Popular"],
    view: "Lake View",
    featured: true,
  },
  {
    id: "atithi-resort",
    name: "Atithi Resort & Spa",
    destination: "Pokhara",
    images: {
      main: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Lakeside-6, Pokhara",
    stars: 4,
    rating: 4.4,
    reviews: 1428,
    prices: [3200, 4900, 7400],
    short: "Garden resort a two-minute walk from the lake promenade.",
    description:
      "Atithi means 'guest', and the resort lives up to it with warm service, a green courtyard, spa treatments and an unhurried breakfast terrace. It is tucked one lane back from Lakeside, so nights are quiet.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Parking", "Air conditioning"],
    facilities: ["Spa & Sauna", "Garden Pool", "Rooftop Restaurant", "Cycle Hire"],
    tags: ["Lakeside", "Spa", "Value"],
    view: "Garden View",
  },
  {
    id: "mount-kailash-resort",
    name: "Mount Kailash Resort",
    destination: "Pokhara",
    images: {
      main: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Khapaudi, Pokhara",
    stars: 3,
    rating: 4.3,
    reviews: 736,
    prices: [2400, 3600, 5600],
    short: "Hillside cottages above Phewa Lake with sweeping Annapurna views.",
    description:
      "Set on the hillside above Phewa Lake at Khapaudi, Mount Kailash Resort trades the Lakeside bustle for terraced gardens, birdsong and an uninterrupted view of Machhapuchhre and the Annapurnas from every cottage balcony.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Parking", "Mountain view", "Lake view"],
    facilities: ["Terrace Gardens", "Bonfire Deck", "Hiking Trails", "Shuttle to Lakeside"],
    tags: ["Mountain View", "Quiet", "Nature"],
    view: "Annapurna View",
  },
  {
    id: "waterfront-resort",
    name: "Waterfront Resort by KGH Group",
    destination: "Pokhara",
    images: {
      main: "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Sedi Height, Lakeside, Pokhara",
    stars: 4,
    rating: 4.6,
    reviews: 1189,
    prices: [4000, 5800, 8600],
    short: "The only Pokhara resort with its own private jetty on Phewa Lake.",
    description:
      "Waterfront sits directly on the lake at Sedi Height with a private jetty, lakeside pool and rooms that open to the water. Kayaks and boats leave from the property, and the Annapurna skyline rises straight ahead at sunrise.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Air conditioning", "Parking", "Lake view"],
    facilities: ["Private Jetty", "Lakeside Pool", "Kayak & Boat Hire", "Spa", "Lawn Events"],
    tags: ["Lakefront", "Luxury", "Romantic"],
    view: "Lake View",
    featured: true,
    cancellation: "Free cancellation up to 48 hours before check-in.",
  },

  /* ── Chitwan ── */
  {
    id: "barahi-jungle-lodge",
    name: "Barahi Jungle Lodge",
    destination: "Chitwan",
    images: {
      main: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Rapti Riverbank, Chitwan National Park",
    stars: 5,
    rating: 4.8,
    reviews: 1043,
    prices: [5200, 7200, 9500],
    short: "Riverfront lodge on the edge of Chitwan National Park with guided safaris.",
    description:
      "Barahi Jungle Lodge looks across the Rapti River into Chitwan National Park, where rhinos graze at dusk. Stays include naturalist-led jeep safaris, canoe trips and guided walks, followed by dinner on the river deck.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Air conditioning", "Parking"],
    facilities: ["Jeep Safari", "Dugout Canoe Trips", "Naturalist Guides", "Infinity Pool", "River Deck Bar"],
    tags: ["Jungle", "Safari", "Nature"],
    view: "River & Jungle View",
    featured: true,
  },
  {
    id: "jungle-villa-resort",
    name: "Jungle Villa Resort",
    destination: "Chitwan",
    images: {
      main: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Sauraha, Chitwan",
    stars: 3,
    rating: 4.4,
    reviews: 812,
    prices: [2600, 3900, 6000],
    short: "Thatched villas in Sauraha with elephant-breeding-centre trips included.",
    description:
      "A relaxed Sauraha resort of thatched villas around a green lawn, five minutes from the Rapti River sunset point. Packages bundle jungle walks, the elephant breeding centre and a Tharu cultural dance evening.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Parking", "Family friendly", "Air conditioning"],
    facilities: ["Jungle Activity Desk", "Tharu Culture Programme", "Garden Lawn", "Bicycle Hire"],
    tags: ["Sauraha", "Value", "Family"],
    view: "Garden View",
  },
  {
    id: "hotel-parkland",
    name: "Hotel Parkland",
    destination: "Chitwan",
    images: {
      main: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Main Road, Sauraha, Chitwan",
    stars: 3,
    rating: 4.1,
    reviews: 548,
    prices: [2000, 3000, 5000],
    short: "Simple, friendly base in central Sauraha at the best value in Chitwan.",
    description:
      "Hotel Parkland keeps things straightforward: clean rooms, a shaded restaurant, and a location on Sauraha's main road within walking distance of the park entrance and canoe launch. A dependable budget choice for a two-night safari trip.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Parking", "Family friendly"],
    facilities: ["Safari Booking", "Garden Restaurant", "Bicycle Hire", "Laundry"],
    tags: ["Budget", "Sauraha", "Safari"],
    view: "Garden View",
  },
  {
    id: "green-park-chitwan",
    name: "Green Park Chitwan",
    destination: "Chitwan",
    images: {
      main: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1505873242700-f289a29e1e0f?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Bachhauli, Sauraha, Chitwan",
    stars: 4,
    rating: 4.5,
    reviews: 967,
    prices: [3400, 5000, 7600],
    short: "Landscaped resort with a large pool between Sauraha and the park buffer zone.",
    description:
      "Green Park spreads across landscaped gardens in Bachhauli with a big swimming pool, spacious cottages and an open-air restaurant. It is a comfortable middle ground between rustic jungle lodges and city hotels.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Air conditioning", "Parking", "Family friendly"],
    facilities: ["Large Pool", "Cultural Programme", "Safari Desk", "Conference Hall", "Spa"],
    tags: ["Resort", "Family", "Jungle"],
    view: "Garden View",
  },

  /* ── Lumbini ── */
  {
    id: "buddha-maya-garden",
    name: "Buddha Maya Garden Hotel",
    destination: "Lumbini",
    images: {
      main: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Lumbini Sacred Garden Gate, Rupandehi",
    stars: 4,
    rating: 4.4,
    reviews: 721,
    prices: [3000, 4600, 7000],
    short: "Closest full-service hotel to the Maya Devi Temple and Sacred Garden.",
    description:
      "Buddha Maya Garden sits at the gate of the Lumbini Sacred Garden, minutes from the Maya Devi Temple marking the birthplace of the Buddha. Gardens, a quiet pool and a vegetarian-friendly kitchen suit pilgrims and heritage travellers.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Air conditioning", "Parking"],
    facilities: ["Meditation Garden", "Bicycle Hire", "Pilgrimage Guides", "Conference Room"],
    tags: ["Heritage", "Pilgrimage", "Quiet"],
    view: "Garden View",
  },
  {
    id: "hotel-ananda-inn",
    name: "Hotel Ananda Inn",
    destination: "Lumbini",
    images: {
      main: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Buddha Chowk, Bhairahawa, Rupandehi",
    stars: 3,
    rating: 4.2,
    reviews: 486,
    prices: [2200, 3400, 5200],
    short: "Comfortable town hotel in Bhairahawa, 20 minutes from Lumbini.",
    description:
      "Hotel Ananda Inn is a practical, well-kept base in Bhairahawa close to Gautam Buddha International Airport, with easy transfers to the Lumbini monastic zone and the Indian border crossing.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Air conditioning", "Parking", "Family friendly"],
    facilities: ["Airport Transfer", "Rooftop Restaurant", "Travel Desk", "Banquet Hall"],
    tags: ["Value", "Airport", "Pilgrimage"],
    view: "Town View",
  },
  {
    id: "lumbini-hokke-hotel",
    name: "Lumbini Hokke Hotel",
    destination: "Lumbini",
    images: {
      main: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Lumbini Monastic Zone, Rupandehi",
    stars: 3,
    rating: 4.3,
    reviews: 394,
    prices: [2800, 4200, 6600],
    short: "Japanese-style hotel inside the monastic zone with tatami rooms and onsen baths.",
    description:
      "Run in Japanese style inside the Lumbini monastic zone, Hokke Hotel offers tatami rooms, communal cypress baths and a kaiseki-inspired dinner — an unusually calm stay for pilgrims walking the Sacred Garden at dawn.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Air conditioning", "Parking"],
    facilities: ["Japanese Bath", "Tatami Rooms", "Meditation Hall", "Garden Walk"],
    tags: ["Unique", "Pilgrimage", "Wellness"],
    view: "Monastic Garden View",
  },

  /* ── Nagarkot ── */
  {
    id: "nagarkot-himalayan-view",
    name: "Himalayan Villa Nagarkot",
    destination: "Nagarkot",
    images: {
      main: "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Nagarkot Ridge, Bhaktapur District",
    stars: 4,
    rating: 4.6,
    reviews: 883,
    prices: [3500, 5200, 7800],
    short: "Ridge-top villa where the Langtang and Everest ranges appear at sunrise.",
    description:
      "Perched on the Nagarkot ridge at 2,175 m, the villa's glass-fronted rooms face east so guests can watch the Himalaya turn gold from bed. Sunrise tea is served on the deck at 5:30 AM, and hiking trails to Changunarayan start at the gate.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Heating", "Parking", "Mountain view"],
    facilities: ["Sunrise Deck", "Bonfire Evenings", "Hiking Trails", "Spa Treatments"],
    tags: ["Sunrise", "Mountain View", "Romantic"],
    view: "Himalayan View",
    featured: true,
  },
  {
    id: "nagarkot-pine-lodge",
    name: "Nagarkot Pine Lodge",
    destination: "Nagarkot",
    images: {
      main: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Tauthali, Nagarkot",
    stars: 3,
    rating: 4.2,
    reviews: 431,
    prices: [2200, 3300, 5400],
    short: "Cosy pine-forest lodge with valley views and wood-fired heating.",
    description:
      "A small, warm lodge among the pines just below the Nagarkot view tower. Rooms are simple with heavy quilts and wood heating; the terrace looks over the Shivapuri hills and the Kathmandu Valley lights at night.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Heating", "Parking", "Mountain view"],
    facilities: ["Terrace Café", "Guided Sunrise Walk", "Library Corner"],
    tags: ["Budget", "Nature", "Quiet"],
    view: "Valley View",
  },

  /* ── Dhulikhel ── */
  {
    id: "dhulikhel-mountain-resort",
    name: "Dhulikhel Mountain Resort",
    destination: "Dhulikhel",
    images: {
      main: "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Araniko Highway, Dhulikhel, Kavre",
    stars: 4,
    rating: 4.5,
    reviews: 758,
    prices: [3300, 4900, 7300],
    short: "Terraced cottages facing a 300-km sweep of the Himalaya.",
    description:
      "Spread over terraced gardens on the Araniko Highway, the resort's brick cottages look north to a long line of peaks from Langtang to Everest. Organic produce comes from the on-site farm, and guided walks lead to Namobuddha.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Heating", "Parking", "Mountain view", "Family friendly"],
    facilities: ["Organic Farm", "Nature Trails", "Sunrise Tower", "Conference Hall", "Spa"],
    tags: ["Mountain View", "Nature", "Wellness"],
    view: "Himalayan View",
  },
  {
    id: "namobuddha-hill-retreat",
    name: "Namobuddha Hill Retreat",
    destination: "Dhulikhel",
    images: {
      main: "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1517320964276-a002fa203177?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Namobuddha Road, Dhulikhel, Kavre",
    stars: 3,
    rating: 4.3,
    reviews: 362,
    prices: [2000, 3200, 5000],
    short: "Quiet hillside guesthouse on the walking trail to Namobuddha monastery.",
    description:
      "A family-run retreat on the ridge trail between Dhulikhel and Namobuddha monastery, with home-cooked Newari meals, morning birdwatching and clear mountain views from the shared terrace.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Heating", "Parking", "Mountain view"],
    facilities: ["Trail Access", "Home Kitchen", "Meditation Terrace", "Bicycle Hire"],
    tags: ["Budget", "Hiking", "Quiet"],
    view: "Mountain View",
  },

  /* ── Bandipur ── */
  {
    id: "bandipur-heritage-inn",
    name: "Bandipur Heritage Inn",
    destination: "Bandipur",
    images: {
      main: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Bandipur Bazaar, Tanahun",
    stars: 3,
    rating: 4.5,
    reviews: 529,
    prices: [2400, 3800, 5800],
    short: "Restored Newari trading house on Bandipur's car-free main street.",
    description:
      "Bandipur's bazaar is a preserved Newari trading town with no traffic, and the Heritage Inn occupies one of its old merchant houses. Wooden shutters, slate floors and a rooftop that catches sunrise over the Marsyangdi valley.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Heating", "Mountain view", "Family friendly"],
    facilities: ["Rooftop Terrace", "Heritage Walks", "Siddha Cave Trips", "Café"],
    tags: ["Heritage", "Hilltop", "Charming"],
    view: "Valley View",
    parking: false,
  },
  {
    id: "bandipur-ridge-resort",
    name: "Bandipur Ridge Resort",
    destination: "Bandipur",
    images: {
      main: "https://images.unsplash.com/photo-1518602164578-cd0074062767?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Tundikhel Ridge, Bandipur, Tanahun",
    stars: 4,
    rating: 4.4,
    reviews: 447,
    prices: [3100, 4600, 7000],
    short: "Ridge-edge resort above Bandipur with a panoramic Annapurna outlook.",
    description:
      "Just past the Tundikhel viewing ground, this resort sits on the ridge edge with floor-to-ceiling windows framing the Annapurna and Manaslu ranges. Paragliding and Siddha Cave trips are arranged in-house.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Heating", "Parking", "Mountain view"],
    facilities: ["Panorama Deck", "Adventure Desk", "Bonfire Lawn", "Spa Room"],
    tags: ["Mountain View", "Adventure", "Romantic"],
    view: "Annapurna View",
  },

  /* ── Bhaktapur ── */
  {
    id: "bhaktapur-durbar-house",
    name: "Bhaktapur Durbar House",
    destination: "Bhaktapur",
    images: {
      main: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1590073844006-33379778ae09?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Taumadhi Square, Bhaktapur",
    stars: 3,
    rating: 4.6,
    reviews: 674,
    prices: [2500, 3900, 6200],
    short: "Heritage guesthouse overlooking Nyatapola Temple in Taumadhi Square.",
    description:
      "Inside the Bhaktapur heritage zone, this restored brick house looks directly at the five-tiered Nyatapola Temple. Mornings begin with temple bells and juju dhau yoghurt on the terrace; Durbar Square and the pottery square are a short walk away.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Restaurant", "Heating", "Family friendly"],
    facilities: ["Temple-view Terrace", "Heritage Tours", "Pottery Workshop", "Café"],
    tags: ["Heritage", "UNESCO", "Charming"],
    view: "Temple View",
    parking: false,
    featured: true,
  },
  {
    id: "bhaktapur-courtyard-resort",
    name: "Bhaktapur Courtyard Resort",
    destination: "Bhaktapur",
    images: {
      main: "https://images.unsplash.com/photo-1571401835393-8c5f35328320?auto=format&fit=crop&w=1200&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1606402179428-a57976d71fa4?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1584132915807-fd1f5fbc078f?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80",
      ],
      rooms: {
        normal: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
        deluxe: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=900&q=80",
        suite: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=80",
      },
    },
    location: "Suryabinayak, Bhaktapur",
    stars: 4,
    rating: 4.3,
    reviews: 512,
    prices: [2900, 4400, 6800],
    short: "Modern brick resort with courtyard gardens near Suryabinayak temple.",
    description:
      "A contemporary take on Newari brick-and-timber design, arranged around planted courtyards at Suryabinayak on the quiet edge of Bhaktapur. Free shuttles run to the Durbar Square heritage gate.",
    amenities: ["Free Wi-Fi", "Breakfast included", "Swimming pool", "Restaurant", "Air conditioning", "Parking", "Family friendly"],
    facilities: ["Courtyard Gardens", "Shuttle Service", "Spa", "Banquet Lawn"],
    tags: ["Modern", "Family", "Quiet"],
    view: "Courtyard View",
  },
];

export const hotels: Hotel[] = SPECS.map(build);

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

const DESTINATION_META: { name: string; blurb: string; stays: number; imgId: string }[] = [
  { name: "Kathmandu", blurb: "Old city temples, Thamel and business hotels", stays: 240, imgId: "photo-1605640840605-14ac1855827b" },
  { name: "Pokhara", blurb: "Phewa Lake, Annapurna views and lakeside cafés", stays: 180, imgId: "photo-1551882547-ff40c63fe5fa" },
  { name: "Chitwan", blurb: "Jungle safaris, rhinos and the Rapti River", stays: 95, imgId: "photo-1516426122078-c23e76319801" },
  { name: "Lumbini", blurb: "Birthplace of the Buddha and the monastic zone", stays: 60, imgId: "photo-1548013146-72479768bada" },
  { name: "Nagarkot", blurb: "Sunrise over the Himalaya, an hour from the city", stays: 55, imgId: "photo-1519681393784-d120267933ba" },
  { name: "Bandipur", blurb: "Car-free Newari hill bazaar above the valley", stays: 35, imgId: "photo-1464822759023-fed622ff2c3b" },
  { name: "Bhaktapur", blurb: "UNESCO heritage squares and Newari courtyards", stays: 48, imgId: "photo-1567337710282-00832b415979" },
  { name: "Dhulikhel", blurb: "Terraced hills with a 300-km mountain panorama", stays: 42, imgId: "photo-1518602164578-cd0074062767" },
];

export const destinations = DESTINATION_META.map((d) => ({
  name: d.name,
  country: "Nepal" as const,
  blurb: d.blurb,
  stays: d.stays,
  hotels: hotels.filter((h) => h.destination === d.name).length,
  image: img(d.imgId, 800),
}));

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

export function getHotel(id: string) {
  return hotels.find((h) => h.id === id);
}

export function startingPrice(h: Hotel) {
  return Math.min(...h.rooms.map((r) => r.pricePerNight));
}
