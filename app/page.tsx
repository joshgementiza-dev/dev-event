import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Page = async () => {
  const response = await fetch(`${BASE_URL}/api/events`);
  // console.log(response);
  const { events } = await response.json();
  console.log("events:", events);
  // const { events } = await response.json();

  return (
    <section className="flex flex-col mt-5 ">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="relative flex flex-col items-center justify-center text-center min-h-screen pt-28 pb-24 px-4 overflow-hidden">
        {/* Ambient amber glow bleeding from top */}

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto stagger-children">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-muted border border-brand-border text-brand text-m font-semibold mb-8 animate-fade-in">
            <span className="rounded-full bg-brand animate-pulse" />
            50+ Events Happening Now
          </div>

          {/* Headline */}
          <h1 className="text-gradient-brand animate-fade-in mb-5 text-[2.5rem]">
            The Hub for Every Dev
            <br />
            Event You Need to Know About
          </h1>

          {/* Subtext */}
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-md animate-fade-in mb-10">
            Stay updated with the latest developer events, conferences, and
            meetups.
          </p>

          {/* CTA */}
          <div className="animate-fade-in">
            <ExploreBtn />
          </div>
        </div>
      </div>

      {/* ── Featured Events ───────────────────────────────────── */}
      <div className="pb-24 w-full">
        {/* Section header */}
        <div className="px-4 md:px-8 max-w-5xl mx-auto flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold text-white">Featured Events</h3>
          <Link
            href="#"
            className="text-sm font-medium text-brand hover:text-brand-hover transition-colors duration-150"
          >
            View all →
          </Link>
        </div>

        {/* Scroll track */}
        <div className="relative">
          {/* Right-edge fade — hints that more cards exist off-screen */}
          <div className="absolute right-0 top-0 bottom-4 w-20  z-10 pointer-events-none" />

          <ul className="px-4 md:px-8 max-w-5xl mx-auto flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4  scroll-smooth">
            {events.map((event: IEvent) => (
              <li key={event.title} className="w-72 shrink-0 snap-start">
                <EventCard props={event} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Page;
