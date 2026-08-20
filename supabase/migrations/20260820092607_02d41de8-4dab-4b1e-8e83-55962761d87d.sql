-- 0. remove self-service admin claiming
DROP FUNCTION IF EXISTS public.claim_first_admin();

-- 1. OFFERS
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  discount text NOT NULL DEFAULT '',
  price_from integer,
  starts_on date,
  ends_on date,
  image text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active offers are viewable by everyone" ON public.offers FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins can view all offers" ON public.offers FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert offers" ON public.offers FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update offers" ON public.offers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete offers" ON public.offers FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. ROOMS
CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'Normal',
  name text NOT NULL DEFAULT '',
  bed text NOT NULL DEFAULT 'Double or Twin Bed',
  max_guests integer NOT NULL DEFAULT 2,
  size text NOT NULL DEFAULT '22 m²',
  description text NOT NULL DEFAULT '',
  facilities text[] NOT NULL DEFAULT '{}',
  price integer NOT NULL DEFAULT 2000,
  image text,
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX rooms_hotel_id_idx ON public.rooms(hotel_id);
GRANT SELECT ON public.rooms TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rooms TO authenticated;
GRANT ALL ON public.rooms TO service_role;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published rooms are viewable by everyone" ON public.rooms FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can view all rooms" ON public.rooms FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert rooms" ON public.rooms FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update rooms" ON public.rooms FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete rooms" ON public.rooms FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER rooms_updated_at BEFORE UPDATE ON public.rooms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- seed rooms from existing hotel price columns
INSERT INTO public.rooms (hotel_id, category, name, bed, max_guests, size, facilities, price, image, sort_order)
SELECT h.id, 'Normal', 'Normal Room', 'Double or Twin Bed', 2, '22 m²',
       ARRAY['Free Wi-Fi','Private Bathroom','Flat-screen TV','Daily Housekeeping'],
       h.price_normal, COALESCE(h.gallery[1], h.main_image), 0
FROM public.hotels h;
INSERT INTO public.rooms (hotel_id, category, name, bed, max_guests, size, facilities, price, image, sort_order)
SELECT h.id, 'Deluxe', 'Deluxe Room', 'Queen or King Bed', 2, '32 m²',
       ARRAY['Free Wi-Fi','Private Bathroom',h.view_label,'Air Conditioning / Heating','Minibar','Work Desk'],
       h.price_deluxe, COALESCE(h.gallery[2], h.main_image), 1
FROM public.hotels h;
INSERT INTO public.rooms (hotel_id, category, name, bed, max_guests, size, facilities, price, image, sort_order)
SELECT h.id, 'Suite', 'Suite', 'King Bed + Living Area', 4, '48 m²',
       ARRAY['Free Wi-Fi','Premium Bathroom',h.view_label,'Separate Sitting Area','Bathtub','Room Service'],
       h.price_suite, COALESCE(h.gallery[3], h.main_image), 2
FROM public.hotels h;

-- 3. FAQS
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published faqs are viewable by everyone" ON public.faqs FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can view all faqs" ON public.faqs FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert faqs" ON public.faqs FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update faqs" ON public.faqs FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete faqs" ON public.faqs FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.faqs (question, answer, sort_order) VALUES
('How do I book a hotel?','Use the search bar on the homepage to enter your destination and dates. Browse results, open a hotel, choose a room and complete the secure checkout.',0),
('How do I cancel a booking?','Sign in to your account and open the booking. Eligible reservations can be cancelled with a single click, free of charge up to 48h before check-in.',1),
('What payment methods do you accept?','We accept all major credit and debit cards, eSewa, Khalti, and cash (NPR) at the property.',2),
('When will I receive booking confirmation?','Immediately. A confirmation with your booking reference is shown and emailed the moment your reservation is placed.',3),
('What are the standard check-in and check-out times?','Times vary by property but most hotels welcome guests from 2:00 PM and ask you to depart by 12:00 PM.',4),
('How do refunds work?','Refunds for eligible cancellations are processed within 5-10 business days to your original payment method.',5),
('How do I contact customer support?','Our concierge team is reachable by email and phone — see the Contact Us page for details.',6);

-- 4. POLICIES
CREATE TABLE public.policies (
  id text PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.policies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.policies TO authenticated;
GRANT ALL ON public.policies TO service_role;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published policies are viewable by everyone" ON public.policies FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can view all policies" ON public.policies FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert policies" ON public.policies FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update policies" ON public.policies FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete policies" ON public.policies FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER policies_updated_at BEFORE UPDATE ON public.policies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.policies (id, title, body, sort_order) VALUES
('privacy','Privacy Policy','Luxemansio collects only the information needed to complete your reservation: your name, email, phone number and stay details. We never sell your data. You may request deletion of your account information at any time by contacting our team.',0),
('terms','Terms & Conditions','By booking through Luxemansio you agree to the rates, dates and property rules shown at the time of booking. Prices are quoted in Nepali Rupees (NPR) and include applicable taxes unless stated otherwise. Luxemansio acts as a booking platform between guests and partner hotels.',1),
('cancellation','Cancellation Policy','Most reservations may be cancelled free of charge up to 24 hours before check-in unless the property states otherwise on its detail page. Late cancellations and no-shows may be charged the first night.',2),
('refund','Refund Policy','Approved refunds are returned to the original payment method within 5-10 business days. Refunds for cash payments at the property are handled directly by the hotel.',3);

-- 5. SITE CONTENT (homepage, about, footer, navigation, branding)
CREATE TABLE public.site_content (
  id text PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_content TO authenticated;
GRANT ALL ON public.site_content TO service_role;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site content is viewable by everyone" ON public.site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site content" ON public.site_content FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.site_content (id, data) VALUES
('home', '{
  "hero_eyebrow": "Nepal, beautifully hosted",
  "hero_title": "Find your perfect stay in Nepal",
  "hero_subtitle": "Handpicked hotels and lodges across Kathmandu, Pokhara, Chitwan and beyond — booked in minutes.",
  "hero_image": null,
  "featured_title": "Featured stays",
  "featured_subtitle": "Properties our travellers love most.",
  "featured_visible": true,
  "destinations_title": "Popular destinations",
  "destinations_subtitle": "Where Luxemansio travellers are heading right now.",
  "destinations_visible": true,
  "offers_title": "Special offers",
  "offers_subtitle": "Seasonal packages, while they last.",
  "offers_visible": true,
  "promo_visible": true,
  "promo_title": "Travel with confidence",
  "promo_text": "Verified properties, honest photos and clear pricing — every single time.",
  "promo_image": null
}'::jsonb),
('about', '{
  "hero_eyebrow": "About Luxemansio",
  "hero_title": "Thoughtful travel, effortlessly booked.",
  "hero_text": "Luxemansio is a modern hotel booking platform on a mission to make discovering and reserving exceptional accommodations simple, convenient and reliable — wherever your journey in Nepal takes you.",
  "hero_image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=2000&q=80",
  "story_visible": true,
  "story_eyebrow": "Our story",
  "story_title": "Travel, reimagined for the modern guest",
  "story_body": "We built Luxemansio because we believe booking a beautiful stay should feel as considered as the stay itself. No cluttered pages, no hidden fees, no guesswork — just a curated collection of hotels and a booking experience worthy of them.\n\nFrom Himalayan lodges to lakeside retreats and heritage city hotels, every property on Luxemansio is vetted by our team.",
  "mission_visible": true,
  "mission_title": "Our mission",
  "mission_text": "To make great hospitality in Nepal easy to find, easy to trust and easy to book.",
  "vision_title": "Our vision",
  "vision_text": "A Nepal-first booking platform that travellers everywhere reach for before they land.",
  "values_visible": true,
  "values": [
    {"title":"Curated selection","text":"Only the properties we would book ourselves."},
    {"title":"Trusted","text":"Secure payments and honest, verified reviews."},
    {"title":"Nepal-first","text":"Deep local knowledge of every valley and ridge."},
    {"title":"Human support","text":"Real concierge help, day or night."}
  ],
  "stats_visible": true,
  "stats": [
    {"n":"600+","l":"Curated hotels"},
    {"n":"25+","l":"Destinations in Nepal"},
    {"n":"1.2M","l":"Happy guests"},
    {"n":"4.9★","l":"Average rating"}
  ]
}'::jsonb),
('footer', '{
  "description": "Discover exceptional stays around the world. Curated luxury hotels, honest reviews, effortless booking.",
  "newsletter_title": "Stay Inspired",
  "newsletter_text": "Join our newsletter for exclusive offers and travel stories.",
  "copyright": "Luxemansio. All rights reserved.",
  "tagline": "Crafted for discerning travelers.",
  "show_contact": true
}'::jsonb),
('site', '{
  "site_title": "Luxemansio",
  "site_description": "Curated luxury hotel booking across Nepal.",
  "announcement": "",
  "announcement_visible": false,
  "social": {"instagram":"#","facebook":"#","twitter":"#","youtube":"#"}
}'::jsonb);

-- 6. BOOKINGS
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  hotel_id uuid REFERENCES public.hotels(id) ON DELETE SET NULL,
  hotel_name text NOT NULL DEFAULT '',
  hotel_location text NOT NULL DEFAULT '',
  room_name text NOT NULL DEFAULT '',
  check_in date NOT NULL,
  check_out date NOT NULL,
  nights integer NOT NULL DEFAULT 1,
  guests integer NOT NULL DEFAULT 1,
  rooms integer NOT NULL DEFAULT 1,
  total integer NOT NULL DEFAULT 0,
  guest_name text NOT NULL DEFAULT '',
  guest_email text NOT NULL DEFAULT '',
  guest_phone text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create a booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view bookings" ON public.bookings FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin')) WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. CONTACT INFO extras
ALTER TABLE public.contact_info
  ADD COLUMN IF NOT EXISTS page_title text NOT NULL DEFAULT 'Contact Us',
  ADD COLUMN IF NOT EXISTS intro text NOT NULL DEFAULT 'We would love to hear from you.',
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT 'Our concierge team answers every message within one business day.',
  ADD COLUMN IF NOT EXISTS hours text NOT NULL DEFAULT 'Sunday - Friday, 9:00 AM - 6:00 PM (NPT)',
  ADD COLUMN IF NOT EXISTS office text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS image text,
  ADD COLUMN IF NOT EXISTS socials jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS show_map boolean NOT NULL DEFAULT true;

-- 8. Team member visibility toggle
ALTER TABLE public.team_members
  ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;