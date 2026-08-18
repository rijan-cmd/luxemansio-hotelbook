import { Briefcase, Megaphone, Rocket, Target, type LucideIcon } from "lucide-react";
import { imageUrl, useTeamMembers, type TeamMemberRow } from "@/lib/cms";

/**
 * MEET OUR TEAM
 * -------------
 * Team members are managed by an administrator from the Admin Dashboard and
 * stored in the Luxemansio backend, so a change is visible to every visitor.
 * Visitors can only view this section.
 */
const ICONS: LucideIcon[] = [Rocket, Briefcase, Megaphone, Target];

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function teamPhotoSrc(member: Pick<TeamMemberRow, "photo_url" | "storage_path">) {
  return imageUrl(member.storage_path) ?? member.photo_url ?? null;
}

export function TeamAvatar({
  member,
  className = "h-28 w-28",
}: {
  member: Pick<TeamMemberRow, "name" | "title" | "photo_url" | "storage_path">;
  className?: string;
}) {
  const src = teamPhotoSrc(member);

  if (src) {
    return (
      <img
        src={src}
        alt={`${member.name}, ${member.title}`}
        loading="lazy"
        className={`${className} rounded-full object-cover ring-2 ring-gold/40 transition-transform duration-500 group-hover:scale-105`}
      />
    );
  }

  return (
    <div
      className={`${className} grid place-items-center rounded-full bg-navy font-display text-2xl tracking-wide text-gold ring-2 ring-gold/30 transition-transform duration-500 group-hover:scale-105`}
    >
      {initialsOf(member.name)}
    </div>
  );
}

function MemberCard({ member, index }: { member: TeamMemberRow; index: number }) {
  const Icon = ICONS[index % ICONS.length]!;
  return (
    <article className="group flex flex-col items-center rounded-2xl bg-card p-6 text-center ring-1 ring-border/60 transition-all hover:shadow-xl hover:-translate-y-0.5">
      <TeamAvatar member={member} />

      <h3 className="mt-5 font-display text-xl text-navy">{member.name}</h3>
      <p className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold">
        <Icon className="h-3.5 w-3.5" />
        {member.title}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{member.description}</p>
    </article>
  );
}

export function TeamSection({ heading = "Meet Our Team" }: { heading?: string }) {
  const { data: members = [] } = useTeamMembers();

  return (
    <section className="container-page mt-20 md:mt-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-widest text-gold">Founders</p>
        <h2 className="mt-2 font-display text-3xl md:text-4xl text-navy">{heading}</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          A founder-led team shaping modern luxury travel.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m, i) => (
          <MemberCard key={m.id} member={m} index={i} />
        ))}
      </div>
    </section>
  );
}
