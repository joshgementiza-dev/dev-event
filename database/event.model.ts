import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: "online" | "offline" | "hybrid";
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    slug: { type: String, unique: true, index: true },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    overview: {
      type: String,
      required: [true, "Overview is required"],
      trim: true,
    },
    image: { type: String, required: [true, "Image URL is required"] },
    venue: { type: String, required: [true, "Venue is required"], trim: true },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    date: { type: String, required: [true, "Date is required"] },
    time: { type: String, required: [true, "Time is required"] },
    mode: {
      type: String,
      required: [true, "Mode is required"],
      enum: {
        values: ["online", "offline", "hybrid"],
        message: "Mode must be online, offline, or hybrid",
      },
    },
    audience: {
      type: String,
      required: [true, "Audience is required"],
      trim: true,
    },
    agenda: { type: [String], required: [true, "Agenda is required"] },
    organizer: {
      type: String,
      required: [true, "Organizer is required"],
      trim: true,
    },
    tags: { type: [String], required: [true, "Tags are required"] },
  },
  { timestamps: true },
);

// Derives a URL-safe slug from the title — only regenerates when title is modified
EventSchema.pre("save", async function (this: IEvent) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Normalize date to ISO 8601 (YYYY-MM-DD) — rejects unparseable values early
  if (this.isModified("date")) {
    const parsed = new Date(this.date);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date value: "${this.date}"`);
    }
    this.date = parsed.toISOString().split("T")[0];
  }

  // Normalize time to HH:MM (24-hour) — strips seconds if present
  if (this.isModified("time")) {
    const match = this.time.match(/^(\d{1,2}):(\d{2})/);
    if (!match) {
      throw new Error(
        `Invalid time value: "${this.time}". Expected HH:MM format.`,
      );
    }
    const hours = match[1].padStart(2, "0");
    const minutes = match[2];
    this.time = `${hours}:${minutes}`;
  }
});

const Event: Model<IEvent> =
  mongoose.models.Event ?? mongoose.model<IEvent>("Event", EventSchema);

export default Event;
