import BookEvent from "@/components/BookEvent/BookEvent";
import EventCard from "@/components/EventCard";
import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = { params: Promise<{ slug: string }> };

async function getEvent(slug: string): Promise<IEvent | null> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/events/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch event: ${res.statusText}`);

  const data = (await res.json()) as { event: IEvent };
  return data.event;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = await getEvent(slug);

  const similarEvents = await getSimilarEventsBySlug(slug);

  console.log("similarEvents: ", similarEvents);
  // console.log("event: ", event);

  if (!event) notFound();

  return (
    <main className="min-h-screen pt-20 pb-24">
      {/* ── Hero image ─────────────────────────────────────────── */}
      <div className="relative w-full h-[25vh] min-h-[220px]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          className="object-cover"
        />
        {/* Fade image into page background */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        <div className="absolute top-5 left-4 md:left-8">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium glass text-foreground hover:bg-white/10 transition-colors duration-150"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 2L4 7l5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All Events
          </Link>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-24 relative z-10 stagger-children">
        {/* Mode badge */}
        <span
          className={`inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase badge-${event.mode} animate-fade-in`}
        >
          {event.mode}
        </span>

        {/* Title */}
        <h1 className="text-gradient-brand animate-fade-in mb-3">
          {event.title}
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl animate-fade-in mb-8">
          {event.description}
        </p>

        {/* ── Meta grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-fade-in">
          {[
            { label: "Date", value: event.date, icon: "📅" },
            { label: "Time", value: event.time, icon: "🕐" },
            { label: "Location", value: event.location, icon: "📍" },
            { label: "Venue", value: event.venue, icon: "🏛️" },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              className="card-raised rounded-xl bg-card p-4 flex flex-col gap-1"
            >
              <span className="text-lg">{icon}</span>
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                {label}
              </span>
              <span className="text-sm font-semibold text-foreground">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Overview + Agenda ─────────────────────────────────── */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fade-in">
          <div className="card-raised rounded-xl bg-card p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">
              Overview
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {event.overview}
            </p>

            <div className="mt-5 pt-5 border-t border-border grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Audience
                </p>
                <p className="text-sm font-medium text-foreground">
                  {event.audience}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Organizer
                </p>
                <p className="text-sm font-medium text-foreground">
                  {event.organizer}
                </p>
              </div>
            </div>
          </div>

          <div className="card-raised rounded-xl bg-card p-6">
            <h2 className="text-base font-semibold text-foreground mb-3">
              Agenda
            </h2>
            <ol>
              {event.agenda.length > 0 ? (
                event.agenda.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-brand-muted border border-brand-border text-brand text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">
                  No agenda available for this event.
                </li>
              )}
            </ol>
          </div>
        </div>

        {/* ── Tags ─────────────────────────────────────────────── */}
        <div className="animate-fade-in flex flex-wrap gap-2 mb-10">
          {event.tags.length > 0
            ? event.tags.map((tag: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-brand-muted border border-brand-border text-brand"
                >
                  #{tag}
                </span>
              ))
            : null}
        </div>

        {/* ── Register CTA ─────────────────────────────────────── */}
        <div className="animate-fade-in card-raised card-brand-glow rounded-2xl bg-card border border-border p-6 md:p-8 relative overflow-hidden">
          {/* Ambient amber glow */}
          <div className="absolute inset-0 bg-radial-brand opacity-30 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            {/* Left: copy */}
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-1">
                Limited Spots
              </p>
              <h3 className="text-foreground font-semibold mb-1">
                Join the Event
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Enter your email to reserve your spot. Free to attend — no
                account needed.
              </p>
            </div>

            {/* Right: form */}
            <div className="w-full md:w-80 shrink-0">
              <BookEvent />
            </div>
          </div>
        </div>

        {/* Scroll track */}
        {similarEvents.length > 0 && (
          <div className="mt-10">
            <h1 className="text-2xl text-white font-bold text-foreground">
              Similar Events
            </h1>
            <div className="relative mt-4">
              {/* Right-edge fade — hints that more cards exist off-screen */}
              <div className="absolute right-0 top-0 bottom-4 w-20  z-10 pointer-events-none" />

              <ul className=" max-w-5xl mx-auto flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4  scroll-smooth">
                {similarEvents.map((event: IEvent) => (
                  <li key={event.title} className="w-72 shrink-0 snap-start">
                    <EventCard props={event} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
