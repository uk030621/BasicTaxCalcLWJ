// /api/getYears.js
import connectDB from "@/db/connect";
import TaxParameter from "@/models/TaxParameter";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const years = await TaxParameter.find({})
      .select("year -_id")
      .sort({ year: 1 });
    return NextResponse.json(years.map((y) => y.year));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch years" },
      { status: 500 }
    );
  }
}
