export interface StoredBooking {
  reference: string;
  hotelId: string;
  hotelName: string;
  hotelImage?: string;
  hotelLocation?: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: number;
  rooms: number;
  total: number;
  guestName: string;
  guestEmail: string;
  createdAt: string;
  status: "confirmed" | "cancelled";
}

const KEY = "luxemansio.bookings";
const USER_KEY = "luxemansio.user";

export function getBookings(): StoredBooking[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveBooking(b: StoredBooking) {
  const all = getBookings();
  all.unshift(b);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function cancelBooking(ref: string) {
  const all = getBookings().map((b) => (b.reference === ref ? { ...b, status: "cancelled" as const } : b));
  localStorage.setItem(KEY, JSON.stringify(all));
}

export interface StoredUser {
  name: string;
  email: string;
}

export function getUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUser(u: StoredUser | null) {
  if (u) localStorage.setItem(USER_KEY, JSON.stringify(u));
  else localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("luxemansio-auth"));
}

export function generateRef() {
  return "LX" + Math.random().toString(36).slice(2, 8).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();
}
