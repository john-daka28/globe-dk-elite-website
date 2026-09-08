type SendStudentInvitationInput = {
  studentName: string
  studentEmail: string
  token: string
}

export async function sendStudentInvitation({
  studentName,
  studentEmail,
  token,
}: SendStudentInvitationInput) {
  const apiKey =
    process.env.RESEND_API_KEY

  const fromEmail =
    process.env.RESEND_FROM_EMAIL

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured."
    )
  }

  if (!fromEmail) {
    throw new Error(
      "RESEND_FROM_EMAIL is not configured."
    )
  }

  if (!siteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not configured."
    )
  }

  const activationUrl =
    `${siteUrl}/student/activate?token=${encodeURIComponent(token)}`

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Student Invitation</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#f5f7fb;
    font-family:Arial,Helvetica,sans-serif;
    color:#111827;
  "
>
  <div
    style="
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      border:1px solid #e5e7eb;
    "
  >

    <div
      style="
        padding:28px;
        background:#082b5b;
        color:#ffffff;
      "
    >
      <h1
        style="
          margin:0;
          font-size:24px;
        "
      >
        GlobeDK Elite Academy
      </h1>

      <p
        style="
          margin:8px 0 0;
          font-size:14px;
          opacity:0.9;
        "
      >
        Excellence in Education. Success for Life.
      </p>
    </div>

    <div
      style="
        padding:32px;
      "
    >

      <h2
        style="
          margin:0 0 16px;
          font-size:22px;
        "
      >
        Welcome to GlobeDK Elite Academy
      </h2>

      <p
        style="
          font-size:16px;
          line-height:1.7;
        "
      >
        Hello ${studentName},
      </p>

      <p
        style="
          font-size:16px;
          line-height:1.7;
        "
      >
        Your tutor has created a student account for you
        on GlobeDK Elite Academy.
      </p>

      <p
        style="
          font-size:16px;
          line-height:1.7;
        "
      >
        Click the button below to activate your account
        and create your password.
      </p>

      <div
        style="
          margin:30px 0;
          text-align:center;
        "
      >
        <a
          href="${activationUrl}"
          style="
            display:inline-block;
            padding:14px 24px;
            background:#082b5b;
            color:#ffffff;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          "
        >
          Activate Student Account
        </a>
      </div>

      <p
        style="
          font-size:14px;
          line-height:1.7;
          color:#6b7280;
        "
      >
        This invitation link is valid for 24 hours.
      </p>

      <p
        style="
          font-size:14px;
          line-height:1.7;
          color:#6b7280;
        "
      >
        If you did not expect this invitation, you can
        safely ignore this email.
      </p>

    </div>

    <div
      style="
        padding:20px 32px;
        background:#f9fafb;
        border-top:1px solid #e5e7eb;
        font-size:12px;
        color:#6b7280;
      "
    >
      GlobeDK Elite Academy<br />
      Excellence in Education. Success for Life.
    </div>

  </div>
</body>
</html>
`

  const response =
    await fetch(
      "https://api.resend.com/emails",
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${apiKey}`,

          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          from:
            fromEmail,

          to: [
            studentEmail,
          ],

          subject:
            "Your GlobeDK Elite Academy Student Invitation",

          html,
        }),
      }
    )

  const data =
    await response.json()

  if (!response.ok) {
    console.error(
      "Resend student invitation error:",
      data
    )

    throw new Error(
      data?.message ||
        "Unable to send student invitation email."
    )
  }

  return data
}