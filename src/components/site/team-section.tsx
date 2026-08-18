import { useEffect, useState } from "react";
import { Briefcase, Megaphone, Rocket, Target } from "lucide-react";
import { fetchTeamPhotos, teamPhotoUrl } from "@/lib/team-photos";

/**
 * MEET OUR TEAM
 * -------------
 * Photos are managed by an administrator from the Admin Panel (/admin) and are
 * stored in the Luxemansio backend, so a change is visible to every visitor.
 * Visitors can only view these photos.
 */
export type TeamMember = {
  id: string;
  name: string;
  title: string;
  description: string;
  icon: typeof Rocket;
  initials: string;
  photo: string | null;
};

export const teamMembers: TeamMember[] = [
  {
    id: "rijan",
    name: "Rijan Manandhar",
    title: "Co-Founder, CEO & CTO",
    description:
      "Leads the overall vision and development of Luxemansio, overseeing product strategy, technology, website development, and user experience.",
    icon: Rocket,
    initials: "RM",
    photo: null,
  },
  {
    id: "samir",
    name: "Samir Khatri",
    title: "Co-Founder & CBO",
    description:
      "Leads business development and commercial strategy, focusing on the business model, revenue strategy, brand development, and growth.",
    icon: Briefcase,
    initials: "SK",
    photo: null,
  },
  {
    id: "jenish",
    name: "Jenish Basnet",
    title: "Co-Founder & CMO",
    description:
      "Leads marketing and brand growth, managing social media, digital content, photography, videography, and promotional activities.",
    icon: Megaphone,
    initials: "JB",
    photo: null,
  },
  {
    id: "ujan",
    name: "Ujan Dhoj Malla",
    title: "Co-Founder & CSO",
    description:
      "Leads strategic planning and market analysis, focusing on customer demographics, market positioning, and competitive analysis.",
    icon: Target,
    initials: "UD",
    photo: null,
  },
];

export function useTeamPhotos() {
  const [versions, setVersions] = useState<Record<string, string>>({});

  useEffect(() => {
    let active = true;
    fetchTeamPhotos().then((v) => {
      if (active) setVersions(v);
    });
    return () => {
      active = false;
    };
  }, []);

  return versions;
}

export function TeamAvatar({
  member,
  version,
  className = "h-28 w-28",
}: {
  member: TeamMember;
  version?: string;
  className?: string;
}) {
  const src = version ? teamPhotoUrl(member.id, version) : member.photo;

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
      {member.initials}
    </div>
  );
}

function MemberCard({ member, version }: { member: TeamMember; version?: string }) {
  return (
    <article className="group flex flex-col items-center rounded-2xl bg-card p-6 text-center ring-1 ring-border/60 transition-all hover:shadow-xl hover:-translate-y-0.5">
      <TeamAvatar member={member} version={version} />

      <h3 className="mt-5 font-display text-xl text-navy">{member.name}</h3>
      <p className="mt-1 flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-wide text-gold">
        <member.icon className="h-3.5 w-3.5" />
        {member.title}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        {member.description}
      </p>
    </article>
  );
}

export function TeamSection({ heading = "Meet Our Team" }: { heading?: string }) {
  const versions = useTeamPhotos();

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
        {teamMembers.map((m) => (
          <MemberCard key={m.id} member={m} version={versions[m.id]} />
        ))}
      </div>
    </section>
  );
}
