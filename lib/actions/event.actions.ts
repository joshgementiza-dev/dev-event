"use server";

import { Event } from "@/database";
import connectToDatabase from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
  try {
    await connectToDatabase();
    console.log(slug);
    const event = await Event.findOne({ slug }).lean();
    if (!event) {
      throw new Error(`No event found with slug "${slug}"`);
    }

    const similarEvents = await Event.find({
      _id: { $ne: event._id }, // Exclude the current event
      tags: { $in: event.tags }, // Match any of the tags
    }).lean();

    console.log("similarEvents:", similarEvents);
    return similarEvents;
  } catch (error) {
    console.error(`[GET /api/events/similar/${slug}]`, error);
    return [];
  }
};
