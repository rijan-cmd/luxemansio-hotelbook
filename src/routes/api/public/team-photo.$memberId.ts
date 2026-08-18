import { createFileRoute } from "@tanstack/react-router";

/**
 * Public, read-only endpoint that serves a team member's photo.
 * The storage bucket is private (only admins can write to it), so this route
 * resolves the stored file to a short-lived signed URL and redirects to it.
 */
export const Route = createFileRoute("/api/public/team-photo/$memberId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const memberId = params.memberId;
        if (!/^[a-z0-9-]{1,64}$/i.test(memberId)) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: row } = await supabaseAdmin
          .from("team_photos")
          .select("storage_path")
          .eq("member_id", memberId)
          .maybeSingle();

        if (!row?.storage_path) {
          return new Response("Not found", { status: 404 });
        }

        const { data: signed, error } = await supabaseAdmin.storage
          .from("team-photos")
          .createSignedUrl(row.storage_path, 60 * 60);

        if (error || !signed?.signedUrl) {
          return new Response("Not found", { status: 404 });
        }

        return new Response(null, {
          status: 302,
          headers: {
            location: signed.signedUrl,
            "cache-control": "public, max-age=300",
          },
        });
      },
    },
  },
});
