// /pages/api/send-application.ts
import type { NextApiRequest, NextApiResponse } from "next"
import nodemailer from "nodemailer"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { userEmail, recipient, subject, message } = req.body

    // Basic validation
    if (!userEmail) return res.status(400).json({ error: "userEmail is required" })
    if (!recipient) return res.status(400).json({ error: "Recipient email is required" })
    if (!subject) return res.status(400).json({ error: "Email subject is required" })
    if (!message) return res.status(400).json({ error: "Email message is required" })

    // Check environment variables for sender credentials
    const senderEmail = process.env.EMAIL_USER
    const senderPass = process.env.EMAIL_PASS

    if (!senderEmail || !senderPass) {
      console.error("[SEND_EMAIL_ERROR] Missing EMAIL_USER or EMAIL_PASS in .env")
      return res.status(500).json({ error: "Server email credentials not configured" })
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or your email service
      auth: {
        user: senderEmail,
        pass: senderPass,
      },
    })

    // Construct email
    const mailOptions = {
      from: senderEmail,
      to: recipient,
      subject,
      text: `Application received from: ${userEmail}\n\nMessage:\n${message}`,
    }

    console.log("[SEND_EMAIL] Sending email:", mailOptions)

    // Send email
    const info = await transporter.sendMail(mailOptions)
    console.log("[SEND_EMAIL_SUCCESS] Email sent:", info.response)

    res.status(200).json({ message: "Application email sent successfully" })
  } catch (err: any) {
    console.error("[SEND_EMAIL_ERROR]", err)
    res.status(500).json({ error: err.message || "Unknown error sending email" })
  }
}
