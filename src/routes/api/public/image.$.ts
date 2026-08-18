import { createFileRoute } from "@tanstack/react-router";

/**
 * Public, read-only endpoint that serves an admin-uploaded image.
 * The `site-images` bucket is private (only admins can write to it), so this
 * route resolves the stored file to a short-lived signed URL and redirects.
 */
export const Route = createFileRoute("/api/public/image/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const path = (params._splat ?? "").split("?")[0];
        if (!path || path.includes("..") || !/^[A-Za-z0-9/_.-]{1,200}$/.test(path)) {
          return new Response("Not found", { status: 404 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: signed, error } = await supabaseAdmin.storage
          .from("site-images")
          .createSignedUrl(path, 60 * 60);

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
