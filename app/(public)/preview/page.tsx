import EventCard from "@/components/EventCard"
import type { EventCardProps } from "@/components/EventCard"

const SAMPLE_EVENTS: EventCardProps[] = [
  {
    id: "1",
    title: "HackTech 2025 — 48-Hour Global Hackathon",
    image: "/images/event1.png",
    type: "hackathon",
    date: "Jan 15 – 17, 2025",
    location: "San Francisco, CA",
    mode: "in-person",
  },
  {
    id: "2",
    title: "React Advanced Workshop: Server Components Deep Dive",
    image: "/images/event2.png",
    type: "workshop",
    date: "Feb 3, 2025",
    location: "Online",
    mode: "virtual",
  },
  {
    id: "3",
    title: "DevConf 2025 — The Annual Developer Conference",
    image: "/images/event3.png",
    type: "conference",
    date: "Mar 10 – 12, 2025",
    location: "New York, NY",
    mode: "hybrid",
  },
  {
    id: "4",
    title: "TypeScript Meetup — Monthly Community Gathering",
    image: "/images/event4.png",
    type: "meetup",
    date: "Jan 28, 2025",
    location: "Austin, TX",
    mode: "in-person",
  },
  {
    id: "5",
    title: "AI x Dev Hackathon — Build the Future in 24 Hours",
    image: "/images/event5.png",
    type: "hackathon",
    date: "Feb 22 – 23, 2025",
    location: "Online",
    mode: "virtual",
  },
  {
    id: "6",
    title: "Next.js Workshop: App Router Patterns & Best Practices",
    image: "/images/event6.png",
    type: "workshop",
    date: "Mar 5, 2025",
    location: "Chicago, IL",
    mode: "hybrid",
  },
]

export default function PreviewPage() {
  return (
    <div className="pt-28 px-4 md:px-8 pb-24 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-2">
          Component Preview
        </p>
        <h2 className="text-foreground">EventCard</h2>
        <p className="text-muted-foreground text-sm mt-2 max-w-md">
          Displays event image, type badge, title, date, location, and attendance mode. Clicking navigates to the event detail page.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SAMPLE_EVENTS.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  )
}
