import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IBooking extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const BookingSchema = new Schema<IBooking>(
  {
    // Indexed for fast lookup of all bookings belonging to a single event
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: [true, "Event ID is required"],
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message: "Invalid email address format",
      },
    },
  },
  { timestamps: true },
);

// Verify the referenced event exists before persisting a booking
BookingSchema.pre("save", async function () {
  if (this.isModified("eventId")) {
    const Event = mongoose.model("Event");
    const exists = await Event.exists({ _id: this.eventId });
    if (!exists) {
      throw new Error(`Event with ID "${this.eventId}" does not exist.`);
    }
  }
});

const Booking: Model<IBooking> =
  mongoose.models.Booking ?? mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
