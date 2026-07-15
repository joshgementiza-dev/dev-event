import { Event } from "@/database";
import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";

// Next.js 16: route params are async — must be awaited
type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: RouteContext) {
  const { slug } = await params;

  // Reject empty or obviously invalid slugs before hitting the database
  if (!slug || typeof slug !== "string" || slug.trim() === "") {
    return NextResponse.json(
      { message: "Invalid or missing slug parameter" },
      { status: 400 },
    );
  }

  try {
    await connectToDatabase();

    // lean() returns a plain object — faster and lighter than a full Mongoose document
    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      return NextResponse.json(
        { message: `No event found with slug "${slug}"` },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Event fetched successfully", event },
      { status: 200 },
    );
  } catch (error) {
    console.error(`[GET /api/events/${slug}]`, error);
    return NextResponse.json(
      {
        message: "Failed to fetch event",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
