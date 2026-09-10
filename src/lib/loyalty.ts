import type { StoredBooking } from "./booking-store";

export interface LoyaltyTier {
  name: string;
  min: number;
  perk: string;
}

export const LOYALTY_TIERS: LoyaltyTier[] = [
  { name: "Silver", min: 0, perk: "Welcome drink on arrival" },
  { name: "Gold", min: 500, perk: "Free room upgrade when available" },
  { name: "Platinum", min: 1500, perk: "Late checkout + complimentary breakfast" },
  { name: "Diamond", min: 3000, perk: "Airport transfer + suite upgrades" },
];

/** Demo rule: 1 point per NPR 100 spent on confirmed bookings. */
export function pointsFor(bookings: StoredBooking[]) {
  return bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + Math.round(b.total / 100), 0);
}

export function tierFor(points: number) {
  let current = LOYALTY_TIERS[0];
  for (const t of LOYALTY_TIERS) if (points >= t.min) current = t;
  const next = LOYALTY_TIERS.find((t) => t.min > points) ?? null;
  const progress = next
    ? Math.min(100, Math.round(((points - current.min) / (next.min - current.min)) * 100))
    : 100;
  return { current, next, progress, toNext: next ? next.min - points : 0 };
}
