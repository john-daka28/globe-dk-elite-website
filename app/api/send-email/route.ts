import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "level",
      "gender",
      "dob",
      "subjects",
      "guardianName",
      "guardianPhone",
      "guardianEmail",
      "relationship",
    ];

    for (const field of requiredFields) {
      if (!body[field] || (Array.isArray(body[field]) && body[field].length === 0)) {
        return new Response(
          JSON.stringify({ success: false, error: `Missing or empty field: ${field}` }),
          { status: 400 }
        );
      }
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465, // auto secure if 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS, // App Password for Gmail
      },
    });

    const info = await transporter.sendMail({
      from: `"Extra Lesson Applications" <${process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO,
      subject: "New Extra Lesson Application",
      html: `
        <h2>New Extra Lesson Application</h2>
        <p><strong>Name:</strong> ${body.firstName} ${body.lastName}</p>
        <p><strong>Level:</strong> ${body.level}</p>
        <p><strong>Gender:</strong> ${body.gender}</p>
        <p><strong>Date of Birth:</strong> ${body.dob}</p>
        <p><strong>Subjects:</strong> ${(body.subjects || []).join(", ")}</p>
        <p><strong>Guardian Name:</strong> ${body.guardianName}</p>
        <p><strong>Guardian Phone:</strong> ${body.guardianPhone}</p>
        <p><strong>Guardian Email:</strong> ${body.guardianEmail}</p>
        <p><strong>Relationship:</strong> ${body.relationship}</p>
      `,
    });

    console.log("Email sent, messageId:", info.messageId);

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      status: 200,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { status: 500 }
    );
  }
}
