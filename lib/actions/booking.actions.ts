import connectToDatabase from "../mongodb";

export const createBooking = async ({
  eventId,
  slug,
  email,
}: {
  eventId: string;
  slug: string;
  email: string;
}) => {
  try {
    await connectToDatabase();
    // const booking = await Booking.create({ eventId, email });
    // booking;
    return { success: true, message: "Booking created successfully" };
  } catch (error) {
    console.error("Error creating booking:", error);
    // throw new Error("Failed to create booking");

    return { success: false, message: "Failed to create booking" };
  }
};
