export type EventType = "hackathon" | "workshop" | "conference" | "meetup";

export type EventCardProps = {
  id: string;
  title: string;
  image: string;
  type: EventType;
  date: string;
  location: string;
  mode: "in-person" | "virtual" | "hybrid";
};
