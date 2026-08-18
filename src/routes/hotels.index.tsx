import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { HotelCard } from "@/components/site/hotel-card";
import { HotelSearchBar } from "@/components/site/search-bar";
import { formatNPR, startingPrice, MIN_PRICE, MAX_PRICE } from "@/lib/hotels";
import { useHotels } from "@/lib/cms";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Search {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  rooms?: number;
}

export const Route = createFileRoute("/hotels/")({
  head: () => ({
    meta: [
      { title: "Browse Hotels in Nepal — Luxemansio" },
      { name: "description", content: "Search and compare hand-picked hotels across Kathmandu, Pokhara, Chitwan, Lumbini and more — all priced in NPR." },
      { property: "og:title", content: "Browse Hotels — Luxemansio" },
      { property: "og:description", content: "Search and compare hand-picked hotels across Kathmandu, Pokhara, Chitwan, Lumbini and more — all priced in NPR." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    destination: typeof s.destination === "string" ? s.destination : undefined,
    checkIn: typeof s.checkIn === "string" ? s.checkIn : undefined,
    checkOut: typeof s.checkOut === "string" ? s.checkOut : undefined,
    guests: typeof s.guests === "number" ? s.guests : undefined,
    rooms: typeof s.rooms === "number" ? s.rooms : undefined,
  }),
  component: HotelsPage,
});

const AMENITIES = [
  "Free Wi-Fi",
  "Breakfast included",
  "Swimming pool",
  "Restaurant",
  "Air conditioning",
  "Parking",
  "Mountain view",
  "Lake view",
];
const ROOM_TYPES = ["Normal", "Deluxe", "Suite"] as const;

function HotelsPage() {
  const search = Route.useSearch();
  const { data: hotels = [] } = useHotels();
  const [price, setPrice] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);
  const [roomTypes, setRoomTypes] = useState<string[]>([]);
  const [stars, setStars] = useState<number[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sort, setSort] = useState("recommended");

  const results = useMemo(() => {
    let list = hotels.slice();
    if (search.destination) {
      const q = search.destination.toLowerCase();
      list = list.filter(
        (h) =>
          h.city.toLowerCase().includes(q) ||
          h.country.toLowerCase().includes(q) ||
          h.name.toLowerCase().includes(q),
      );
    }
    list = list.filter((h) => h.rooms.some((r) => r.pricePerNight >= price[0] && r.pricePerNight <= price[1]));
    if (roomTypes.length)
      list = list.filter((h) =>
        h.rooms.some((r) => roomTypes.includes(r.category) && r.pricePerNight >= price[0] && r.pricePerNight <= price[1]),
      );
    if (stars.length) list = list.filter((h) => stars.includes(h.stars));
    if (minRating) list = list.filter((h) => h.rating >= minRating);
    if (selectedAmenities.length)
      list = list.filter((h) => selectedAmenities.every((a) => h.amenities.includes(a)));

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => startingPrice(a) - startingPrice(b));
        break;
      case "price-desc":
        list.sort((a, b) => startingPrice(b) - startingPrice(a));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [hotels, search.destination, price, roomTypes, stars, minRating, selectedAmenities, sort]);

  return (
    <>
      <section className="bg-navy py-10 text-navy-foreground">
        <div className="container-page">
          <h1 className="font-display text-3xl md:text-4xl">Find your stay</h1>
          <p className="mt-1 text-sm text-white/70">
            {search.destination ? `Results for "${search.destination}"` : "Explore our full collection"}
          </p>
          <div className="mt-6">
            <HotelSearchBar />
          </div>
        </div>
      </section>

      <div className="container-page mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* FILTERS */}
        <aside className="rounded-2xl bg-card p-6 ring-1 ring-border/60 h-fit lg:sticky lg:top-24">
          <h3 className="font-display text-lg text-navy">Filters</h3>

          <div className="mt-6">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Price / night
            </Label>
            <div className="mt-3">
              <Slider
                min={MIN_PRICE}
                max={MAX_PRICE}
                step={500}
                value={price}
                onValueChange={(v) => setPrice(v as [number, number])}
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>{formatNPR(price[0])}</span>
                <span>{formatNPR(price[1])}</span>
              </div>
            </div>
          </div>

          <FilterGroup title="Star Rating">
            {[5, 4, 3].map((s) => (
              <CheckRow
                key={s}
                label={`${s} Stars`}
                checked={stars.includes(s)}
                onChange={(c) => setStars(c ? [...stars, s] : stars.filter((x) => x !== s))}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Guest Rating">
            {[4.5, 4, 3.5].map((r) => (
              <CheckRow
                key={r}
                label={`${r}+`}
                checked={minRating === r}
                onChange={(c) => setMinRating(c ? r : 0)}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Room Type">
            {ROOM_TYPES.map((rt) => (
              <CheckRow
                key={rt}
                label={rt}
                checked={roomTypes.includes(rt)}
                onChange={(c) => setRoomTypes(c ? [...roomTypes, rt] : roomTypes.filter((x) => x !== rt))}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Amenities">
            {AMENITIES.map((a) => (
              <CheckRow
                key={a}
                label={a}
                checked={selectedAmenities.includes(a)}
                onChange={(c) =>
                  setSelectedAmenities(c ? [...selectedAmenities, a] : selectedAmenities.filter((x) => x !== a))
                }
              />
            ))}
          </FilterGroup>
        </aside>

        {/* RESULTS */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-navy">{results.length}</span> hotels found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Sort by</span>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((h) => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>

          {results.length === 0 && (
            <div className="mt-16 rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="font-display text-xl text-navy">No hotels match your filters</p>
              <p className="mt-2 text-sm text-muted-foreground">Try widening your price range or removing filters.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t border-border pt-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} />
      <span>{label}</span>
    </label>
  );
}
