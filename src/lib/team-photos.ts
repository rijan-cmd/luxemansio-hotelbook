import { supabase } from "@/integrations/supabase/client";

export type TeamPhotoRow = {
  member_id: string;
  updated_at: string;
};

/** Publicly readable list of which members have a photo (and its version). */
export async function fetchTeamPhotos(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("team_photos")
    .select("member_id, updated_at");
  if (error || !data) return {};
  return Object.fromEntries(
    data.map((r) => [r.member_id, new Date(r.updated_at).getTime().toString()]),
  );
}

/** Public URL used by every visitor to display a stored photo. */
export function teamPhotoUrl(memberId: string, version?: string) {
  return `/api/public/team-photo/${memberId}${version ? `?v=${version}` : ""}`;
}

/** Admin-only: upload a new photo. Enforced server-side by database policies. */
export async function uploadTeamPhoto(memberId: string, file: File) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${memberId}/${Date.now()}.${ext || "jpg"}`;

  const { error: uploadError } = await supabase.storage
    .from("team-photos")
    .upload(path, file, { upsert: true, contentType: file.type || "image/jpeg" });
  if (uploadError) throw uploadError;

  const { data: existing } = await supabase
    .from("team_photos")
    .select("storage_path")
    .eq("member_id", memberId)
    .maybeSingle();

  const { data: userData } = await supabase.auth.getUser();

  const { error } = await supabase.from("team_photos").upsert(
    {
      member_id: memberId,
      photo_url: path,
      storage_path: path,
      updated_at: new Date().toISOString(),
      updated_by: userData.user?.id ?? null,
    },
    { onConflict: "member_id" },
  );
  if (error) throw error;

  if (existing?.storage_path && existing.storage_path !== path) {
    await supabase.storage.from("team-photos").remove([existing.storage_path]);
  }
}

/** Admin-only: remove a photo. Enforced server-side by database policies. */
export async function removeTeamPhoto(memberId: string) {
  const { data: existing } = await supabase
    .from("team_photos")
    .select("storage_path")
    .eq("member_id", memberId)
    .maybeSingle();

  const { error } = await supabase.from("team_photos").delete().eq("member_id", memberId);
  if (error) throw error;

  if (existing?.storage_path) {
    await supabase.storage.from("team-photos").remove([existing.storage_path]);
  }
}

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
