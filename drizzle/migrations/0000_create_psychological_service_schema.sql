-- Enums
CREATE TYPE public.app_role AS ENUM ('SuperAdmin', 'ServiceChief', 'Psychologist', 'Applicant');
CREATE TYPE public.urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.request_status AS ENUM ('new', 'in_processing', 'scheduled', 'completed', 'cancelled');
CREATE TYPE public.report_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');
CREATE TYPE public.event_type AS ENUM ('consultation', 'group_work', 'travel', 'documentation', 'other');

-- Locations
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  coordinates TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.locations TO authenticated;
GRANT ALL ON public.locations TO service_role;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Units
CREATE TABLE public.units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  parent_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.units TO authenticated;
GRANT ALL ON public.units TO service_role;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Roles (separate table, never on profiles)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- QR codes
CREATE TABLE public.qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.qr_codes TO authenticated;
GRANT SELECT ON public.qr_codes TO anon;
GRANT ALL ON public.qr_codes TO service_role;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;

-- Requests
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_id UUID,
  unit_id UUID REFERENCES public.units(id) ON DELETE SET NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  request_type TEXT NOT NULL DEFAULT 'Самозвернення',
  raw_text TEXT NOT NULL DEFAULT '',
  structured_text TEXT,
  category TEXT,
  urgency public.urgency_level NOT NULL DEFAULT 'medium',
  status public.request_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.requests TO authenticated;
GRANT ALL ON public.requests TO service_role;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- Reports
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE,
  psychologist_id UUID,
  goal TEXT,
  work_description TEXT,
  results TEXT,
  recommendations TEXT,
  draft_content TEXT,
  final_content TEXT,
  status public.report_status NOT NULL DEFAULT 'draft',
  tags TEXT[] NOT NULL DEFAULT '{}',
  attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Schedules
CREATE TABLE public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID,
  event_title TEXT NOT NULL,
  event_type public.event_type NOT NULL DEFAULT 'consultation',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  travel_time_hours NUMERIC NOT NULL DEFAULT 0,
  route_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schedules TO authenticated;
GRANT ALL ON public.schedules TO service_role;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Case bank
CREATE TABLE public.case_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  primary_category TEXT NOT NULL,
  subcategories TEXT[] NOT NULL DEFAULT '{}',
  symptoms TEXT,
  interventions TEXT,
  outcomes TEXT,
  recommendations TEXT,
  similar_case_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_bank TO authenticated;
GRANT ALL ON public.case_bank TO service_role;
ALTER TABLE public.case_bank ENABLE ROW LEVEL SECURITY;

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Reference data readable by authenticated" ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage locations" ON public.locations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'SuperAdmin') OR public.has_role(auth.uid(), 'ServiceChief'))
  WITH CHECK (public.has_role(auth.uid(), 'SuperAdmin') OR public.has_role(auth.uid(), 'ServiceChief'));

CREATE POLICY "Units readable by authenticated" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage units" ON public.units FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'SuperAdmin') OR public.has_role(auth.uid(), 'ServiceChief'))
  WITH CHECK (public.has_role(auth.uid(), 'SuperAdmin') OR public.has_role(auth.uid(), 'ServiceChief'));

CREATE POLICY "Own profile readable" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'SuperAdmin') OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'Psychologist'));
CREATE POLICY "Own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Own profile update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'SuperAdmin'))
  WITH CHECK (id = auth.uid() OR public.has_role(auth.uid(), 'SuperAdmin'));

CREATE POLICY "Own roles readable" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'SuperAdmin'));

CREATE POLICY "QR codes readable" ON public.qr_codes FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Admins manage qr codes" ON public.qr_codes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'SuperAdmin') OR public.has_role(auth.uid(), 'ServiceChief'))
  WITH CHECK (public.has_role(auth.uid(), 'SuperAdmin') OR public.has_role(auth.uid(), 'ServiceChief'));

CREATE POLICY "Requests readable by staff or applicant" ON public.requests FOR SELECT TO authenticated
  USING (applicant_id = auth.uid() OR public.has_role(auth.uid(), 'Psychologist') OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'));
CREATE POLICY "Authenticated can create requests" ON public.requests FOR INSERT TO authenticated WITH CHECK (applicant_id = auth.uid());
CREATE POLICY "Staff update requests" ON public.requests FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'Psychologist') OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'))
  WITH CHECK (public.has_role(auth.uid(), 'Psychologist') OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'));

CREATE POLICY "Reports readable by staff" ON public.reports FOR SELECT TO authenticated
  USING (psychologist_id = auth.uid() OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'));
CREATE POLICY "Psychologists create reports" ON public.reports FOR INSERT TO authenticated
  WITH CHECK (psychologist_id = auth.uid() AND public.has_role(auth.uid(), 'Psychologist'));
CREATE POLICY "Psychologists update own reports" ON public.reports FOR UPDATE TO authenticated
  USING (psychologist_id = auth.uid() OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'))
  WITH CHECK (psychologist_id = auth.uid() OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'));

CREATE POLICY "Schedules readable by staff" ON public.schedules FOR SELECT TO authenticated
  USING (psychologist_id = auth.uid() OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'));
CREATE POLICY "Manage own schedule" ON public.schedules FOR ALL TO authenticated
  USING (psychologist_id = auth.uid() OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'))
  WITH CHECK (psychologist_id = auth.uid() OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'));

CREATE POLICY "Case bank readable by staff" ON public.case_bank FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'Psychologist') OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'));
CREATE POLICY "Staff manage case bank" ON public.case_bank FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'Psychologist') OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'))
  WITH CHECK (public.has_role(auth.uid(), 'Psychologist') OR public.has_role(auth.uid(), 'ServiceChief') OR public.has_role(auth.uid(), 'SuperAdmin'));

CREATE POLICY "Audit readable by admins" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'SuperAdmin') OR public.has_role(auth.uid(), 'ServiceChief'));
CREATE POLICY "Authenticated write audit" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Seed reference data
INSERT INTO public.locations (name, coordinates, address) VALUES
  ('Селекція-1', '49.8397, 24.0297', 'Навчальний майданчик, сектор А'),
  ('Пункт Схід', '48.5937, 38.0000', 'Польовий пункт психологічної допомоги'),
  ('База Північ', '50.4501, 30.5234', 'Пункт постійної дислокації, корпус 3');

INSERT INTO public.units (name, code, location_id) VALUES
  ('115 ОМБр', '115-OMBR', (SELECT id FROM public.locations WHERE name = 'Пункт Схід')),
  ('25 ОПДБр', '25-OPDBR', (SELECT id FROM public.locations WHERE name = 'База Північ')),
  ('Центр підготовки', 'CP-01', (SELECT id FROM public.locations WHERE name = 'Селекція-1')),
  ('47 ОМБр', '47-OMBR', (SELECT id FROM public.locations WHERE name = 'Пункт Схід'));

INSERT INTO public.qr_codes (token, unit_id, location_id, is_active) VALUES
  ('QR-115-EAST-01', (SELECT id FROM public.units WHERE code = '115-OMBR'), (SELECT id FROM public.locations WHERE name = 'Пункт Схід'), true),
  ('QR-25-NORTH-01', (SELECT id FROM public.units WHERE code = '25-OPDBR'), (SELECT id FROM public.locations WHERE name = 'База Північ'), true),
  ('QR-CP-SEL-01', (SELECT id FROM public.units WHERE code = 'CP-01'), (SELECT id FROM public.locations WHERE name = 'Селекція-1'), true),
  ('QR-47-EAST-02', (SELECT id FROM public.units WHERE code = '47-OMBR'), (SELECT id FROM public.locations WHERE name = 'Пункт Схід'), false);
