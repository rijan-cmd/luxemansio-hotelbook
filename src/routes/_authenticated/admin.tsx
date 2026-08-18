import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, LogOut, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import {
  TeamAvatar,
  teamMembers,
  type TeamMember,
} from "@/components/site/team-section";
import {
  fetchTeamPhotos,
  isCurrentUserAdmin,
  removeTeamPhoto,
  uploadTeamPhoto,
} from "@/lib/team-photos";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Luxemansio" },
      { name: "description", content: "Manage Luxemansio team member photos from the secure admin panel." },
      { property: "og:title", content: "Admin Panel — Luxemansio" },
      { property: "og:description", content: "Manage Luxemansio team member photos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPanel,
});

const MAX_BYTES = 5 * 1024 * 1024;

function AdminPanel() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [versions, setVersions] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setVersions(await fetchTeamPhotos());
  }, []);

  useEffect(() => {
    (async () => {
      const admin = await isCurrentUserAdmin();
      setIsAdmin(admin);
      setChecking(false);
      if (admin) await refresh();
    })();
  }, [refresh]);

  const claimAdmin = async () => {
    const { data, error } = await supabase.rpc("claim_first_admin");
    if (error) return toast.error(error.message);
    if (!data) return toast.error("An administrator already exists for this site.");
    toast.success("Admin access granted");
    setIsAdmin(true);
    await refresh();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  if (checking) {
    return (
      <div className="container-page py-24 text-center text-sm text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-card p-8 text-center ring-1 ring-border shadow-lg">
          <ShieldCheck className="mx-auto h-8 w-8 text-gold" />
          <h1 className="mt-4 font-display text-2xl text-navy">Admin access required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This account does not have administrator permissions. If you are setting up
            Luxemansio for the first time, you can claim admin access below.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button onClick={claimAdmin} className="bg-navy text-navy-foreground hover:bg-navy/90">
              Claim admin access (first-time setup)
            </Button>
            <Button variant="ghost" onClick={signOut} className="gap-2">
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
            <Link to="/" className="text-sm text-muted-foreground hover:text-navy">
              Back to Luxemansio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold">
            <ShieldCheck className="h-4 w-4" /> Admin Panel
          </p>
          <h1 className="mt-2 font-display text-3xl md:text-4xl text-navy">
            Team Photo Management
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Photos you upload here are stored securely and shown to every visitor.
          </p>
        </div>
        <Button variant="ghost" onClick={signOut} className="gap-2">
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((m) => (
          <AdminMemberCard
            key={m.id}
            member={m}
            version={versions[m.id]}
            busy={busyId === m.id}
            onUpload={async (file) => {
              if (file.size > MAX_BYTES) {
                toast.error("Please choose an image under 5 MB");
                return;
              }
              setBusyId(m.id);
              try {
                await uploadTeamPhoto(m.id, file);
                await refresh();
                toast.success(`${m.name}'s photo updated`);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Upload failed");
              } finally {
                setBusyId(null);
              }
            }}
            onRemove={async () => {
              setBusyId(m.id);
              try {
                await removeTeamPhoto(m.id);
                await refresh();
                toast.success(`${m.name}'s photo removed`);
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not remove photo");
              } finally {
                setBusyId(null);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}

function AdminMemberCard({
  member,
  version,
  busy,
  onUpload,
  onRemove,
}: {
  member: TeamMember;
  version?: string;
  busy: boolean;
  onUpload: (file: File) => void | Promise<void>;
  onRemove: () => void | Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <article className="group flex flex-col items-center rounded-2xl bg-card p-6 text-center ring-1 ring-border/60 transition-all hover:shadow-xl">
      <div className="relative">
        <TeamAvatar member={member} version={version} />
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          aria-label={`Upload photo for ${member.name}`}
          className="absolute bottom-0 right-0 grid h-9 w-9 place-items-center rounded-full bg-gold text-gold-foreground shadow-md ring-2 ring-background transition-transform hover:scale-105 disabled:opacity-60"
        >
          <Camera className="h-4 w-4" />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) void onUpload(file);
          }}
        />
      </div>

      <h3 className="mt-5 font-display text-xl text-navy">{member.name}</h3>
      <p className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold">
        <member.icon className="h-3.5 w-3.5" />
        {member.title}
      </p>

      <div className="mt-5 flex w-full flex-col gap-2">
        <Button
          size="sm"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="bg-navy text-navy-foreground hover:bg-navy/90"
        >
          {version ? "Replace photo" : "Upload photo"}
        </Button>
        {version ? (
          <Button
            size="sm"
            variant="ghost"
            disabled={busy}
            onClick={() => void onRemove()}
            className="gap-2 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Remove
          </Button>
        ) : null}
      </div>
    </article>
  );
}
