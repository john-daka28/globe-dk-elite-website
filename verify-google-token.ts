import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { OAuth2Client } from "google-auth-library"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload?.email) throw new Error("No email returned from Google")

    const userEmail = payload.email

    // Send email to admin
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
      from: userEmail,
      to: process.env.EMAIL_USER,
      subject: "New Application for Tutoring",
      text: `Student applied using Google account: ${userEmail}`,
    })

    return NextResponse.json({ success: true, email: userEmail })
  } catch (err: any) {
    console.error("Google token verification or email failed:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
