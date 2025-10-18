import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role key needed for inserts
);

export async function POST(req: Request) {
  try {
    const { level, subjects, phone, email } = await req.json();

    const { error } = await supabase.from("enrollments").insert([
      { level, subjects, phone, email },
    ]);

    if (error) {
      console.error("Supabase insert failed:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Enrollment submitted successfully" });
  } catch (err) {
    console.error("Error processing enrollment:", err);
    return NextResponse.json(
      { error: "Failed to process enrollment" },
      { status: 500 }
    );
  }
}
