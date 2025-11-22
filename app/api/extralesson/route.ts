import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Server-side only
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const level = formData.get("level")?.toString() || "";
    const first_name = formData.get("firstName")?.toString() || "";
    const last_name = formData.get("lastName")?.toString() || "";
    const gender = formData.get("gender")?.toString() || "";
    const dob = formData.get("dob")?.toString() || null;
    const subjects = formData.getAll("subjects").map((s) => s.toString());
    const guardian_name = formData.get("guardianName")?.toString() || "";
    const guardian_phone = formData.get("guardianPhone")?.toString() || "";
    const guardian_email = formData.get("guardianEmail")?.toString() || "";
    const relationship = formData.get("relationship")?.toString() || "";

    // Handle documents upload
    const documents: { name: string; url: string }[] = [];

    for (let i = 0; i < 10; i++) {
      const file = formData.get(`document_${i}`) as File | null;
      const name = formData.get(`document_name_${i}`)?.toString() || "";
      if (file && name) {
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from("extra-lessons")
          .upload(`${Date.now()}_${file.name}`, file.stream(), {
            contentType: file.type,
          });

        if (error) throw error;

        const url = supabase.storage.from("extra-lessons").getPublicUrl(data.path).publicUrl;
        documents.push({ name, url });
      }
    }

    // Insert into database
    const { data: inserted, error } = await supabase
      .from("extra_lesson_applications")
      .insert({
        level,
        first_name,
        last_name,
        gender,
        dob,
        subjects,
        guardian_name,
        guardian_phone,
        guardian_email,
        relationship,
        documents,
      });

    if (error) throw error;

    return NextResponse.json({ success: true, data: inserted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: (err as any).message });
  }
}
