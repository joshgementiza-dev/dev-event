import { EventCardProps } from "@/app/types/common";

export const mockEvents: EventCardProps[] = [
  {
    id: "1",
    title: "Philippine Dev Summit 2026",
    image: "/images/event1.png",
    type: "conference",
    date: "October 15, 2026",
    location: "SMX Convention Center, Manila",
    mode: "in-person",
  },
  {
    id: "2",
    title: "React Pilipinas Meetup",
    image: "/images/event2.png",
    type: "meetup",
    date: "August 21, 2026",
    location: "Quezon City",
    mode: "hybrid",
  },
  {
    id: "3",
    title: "AI & Machine Learning Workshop",
    image: "/images/event3.png",
    type: "workshop",
    date: "September 5, 2026",
    location: "Cebu City",
    mode: "in-person",
  },
  {
    id: "4",
    title: "Next.js Global Online Conference",
    image: "/images/event4.png",
    type: "conference",
    date: "November 8, 2026",
    location: "Online",
    mode: "virtual",
  },
  {
    id: "5",
    title: "HackFest Philippines 2026",
    image: "/images/event5.png",
    type: "hackathon",
    date: "December 3, 2026",
    location: "Davao City",
    mode: "hybrid",
  },
];
