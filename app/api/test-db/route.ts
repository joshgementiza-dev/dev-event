import connectToDatabase from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("trying to connect to database...");

  try {
    console.log("MONGODB_URI: ", process.env.MONGODB_URI);
    const mongoose = await connectToDatabase();
    console.log("mongoose: ", mongoose);
    return NextResponse.json({
      status: "connected",
      host: mongoose.connection.host,
      dbName: mongoose.connection.name,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return NextResponse.json(
      {
        status: "error",
        error,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
