import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"
import type { EnrollmentData } from "@/types/enrollment"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  console.log("📩 Received enrollment request...")

  try {
    const body: EnrollmentData = await req.json()
    console.log("📦 Incoming data:", body)

    const { email, phone, level, subjects } = body

    if (!email || !phone || !level || !subjects?.length) {
      console.error("❌ Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // === 1️⃣ Insert into Supabase ===
    const { data, error } = await supabase
      .from("enrollments")
      .insert([{ email, phone, level, subjects }])
      .select()

    if (error) {
      console.error("💥 Supabase insert failed:", error)
      return NextResponse.json({ error: "Database insert failed" }, { status: 500 })
    }

    console.log("✅ Enrollment inserted:", data)

    // === 2️⃣ Create Application Letter ===
    const applicationLetter = `
Dear GlobeDk Elite Team,

A new student has applied for enrollment:

📧 Email: ${email}
📞 Phone: ${phone}
🎓 Level: ${level}
📚 Subjects: ${subjects.join(", ")}

Please reach out to confirm registration and share lesson details.

Kind regards,  
Your Enrollment System
`

    // === 3️⃣ Send Email via Nodemailer ===
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    })

    const mailOptions = {
      from: `"GlobeDk Elite Enrollments" <${process.env.SMTP_EMAIL}>`,
      to: "johnariphiosd@gmail.com",
      subject: `New Enrollment Application from ${email}`,
      text: applicationLetter,
    }

    console.log("📤 Sending email to admin...")

    await transporter.sendMail(mailOptions)

    console.log("✅ Email sent successfully!")

    return NextResponse.json({
      message: "Enrollment received and emailed successfully!",
      data,
    })
  } catch (err: any) {
    console.error("🔥 Enrollment API failed:", err)
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
