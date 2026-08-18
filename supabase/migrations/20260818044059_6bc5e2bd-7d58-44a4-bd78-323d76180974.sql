ALTER TABLE public.team_photos ADD COLUMN IF NOT EXISTS storage_path text;

CREATE POLICY "Admins can read team photo files"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload team photo files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update team photo files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete team photo files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'));