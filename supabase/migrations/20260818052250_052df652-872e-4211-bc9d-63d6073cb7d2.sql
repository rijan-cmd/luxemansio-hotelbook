CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- HOTELS ---------------------------------------------------------------
CREATE TABLE public.hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  destination text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  location text NOT NULL DEFAULT '',
  stars int NOT NULL DEFAULT 4,
  rating numeric NOT NULL DEFAULT 4.5,
  reviews int NOT NULL DEFAULT 0,
  short_description text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  amenities text[] NOT NULL DEFAULT '{}',
  facilities text[] NOT NULL DEFAULT '{}',
  tags text[] NOT NULL DEFAULT '{}',
  view_label text NOT NULL DEFAULT 'City View',
  price_normal int NOT NULL DEFAULT 2000,
  price_deluxe int NOT NULL DEFAULT 3500,
  price_suite int NOT NULL DEFAULT 6000,
  main_image text,
  gallery text[] NOT NULL DEFAULT '{}',
  check_in text NOT NULL DEFAULT '2:00 PM',
  check_out text NOT NULL DEFAULT '12:00 PM',
  cancellation text NOT NULL DEFAULT 'Free cancellation up to 24 hours before check-in.',
  breakfast boolean NOT NULL DEFAULT true,
  parking boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.hotels TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hotels TO authenticated;
GRANT ALL ON public.hotels TO service_role;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published hotels are viewable by everyone"
ON public.hotels FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can view all hotels"
ON public.hotels FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert hotels"
ON public.hotels FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update hotels"
ON public.hotels FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete hotels"
ON public.hotels FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER hotels_updated_at BEFORE UPDATE ON public.hotels
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- DESTINATIONS ---------------------------------------------------------
CREATE TABLE public.destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL DEFAULT 'Nepal',
  blurb text NOT NULL DEFAULT '',
  image text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.destinations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.destinations TO authenticated;
GRANT ALL ON public.destinations TO service_role;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published destinations are viewable by everyone"
ON public.destinations FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can view all destinations"
ON public.destinations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert destinations"
ON public.destinations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update destinations"
ON public.destinations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete destinations"
ON public.destinations FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER destinations_updated_at BEFORE UPDATE ON public.destinations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- TEAM -----------------------------------------------------------------
CREATE TABLE public.team_members (
  id text PRIMARY KEY,
  name text NOT NULL,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  photo_url text,
  storage_path text,
  sort_order int NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.team_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are viewable by everyone"
ON public.team_members FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert team members"
ON public.team_members FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update team members"
ON public.team_members FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete team members"
ON public.team_members FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER team_members_updated_at BEFORE UPDATE ON public.team_members
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.team_members (id, name, title, description, sort_order) VALUES
('rijan', 'Rijan Manandhar', 'Co-Founder, CEO & CTO', 'Leads the overall vision and development of Luxemansio, overseeing product strategy, technology, website development, and user experience.', 1),
('samir', 'Samir Khatri', 'Co-Founder & CBO', 'Leads business development and commercial strategy, focusing on the business model, revenue strategy, brand development, and growth.', 2),
('jenish', 'Jenish Basnet', 'Co-Founder & CMO', 'Leads marketing and brand growth, managing social media, digital content, photography, videography, and promotional activities.', 3),
('ujan', 'Ujan Dhoj Malla', 'Co-Founder & CSO', 'Leads strategic planning and market analysis, focusing on customer demographics, market positioning, and competitive analysis.', 4);

-- CONTACT --------------------------------------------------------------
CREATE TABLE public.contact_info (
  id text PRIMARY KEY DEFAULT 'main',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  map_embed_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.contact_info TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_info TO authenticated;
GRANT ALL ON public.contact_info TO service_role;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contact info is viewable by everyone"
ON public.contact_info FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert contact info"
ON public.contact_info FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact info"
ON public.contact_info FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER contact_info_updated_at BEFORE UPDATE ON public.contact_info
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.contact_info (id, email, phone, address, map_embed_url) VALUES
('main', 'concierge@luxemansio.com', '+1 (800) 555-0110 · 24/7', '12 Rue Royale, 75008 Paris, France', 'https://www.openstreetmap.org/export/embed.html?bbox=2.320%2C48.867%2C2.328%2C48.872&layer=mapnik');