import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true, // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
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
        <p><strong>Subjects:</strong> ${body.subjects.join(", ")}</p>
        <p><strong>Guardian Name:</strong> ${body.guardianName}</p>
        <p><strong>Guardian Phone:</strong> ${body.guardianPhone}</p>
        <p><strong>Guardian Email:</strong> ${body.guardianEmail}</p>
        <p><strong>Relationship:</strong> ${body.relationship}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 500,
    });
  }
}
