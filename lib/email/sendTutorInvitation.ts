type TutorInvitationParams = {
  firstName: string
  email: string
  token: string
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "")
}

export async function sendTutorInvitation({
  firstName,
  email,
  token,
}: TutorInvitationParams) {
  const apiKey =
    process.env.RESEND_API_KEY

  const fromEmail =
    process.env.RESEND_FROM_EMAIL

  if (!apiKey) {
    throw new Error(
      "Missing RESEND_API_KEY"
    )
  }

  if (!fromEmail) {
    throw new Error(
      "Missing RESEND_FROM_EMAIL"
    )
  }

  const activationUrl =
    `${getSiteUrl()}/tutor/activate?token=${encodeURIComponent(token)}`

  const response = await fetch(
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
        from: fromEmail,
        to: [email],
        subject:
          "You have been invited to tutor at GlobeDK Elite Academy",
        html: `
          <!DOCTYPE html>
          <html>
            <body style="margin:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#172033;">
              <div style="max-width:640px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
                
                <div style="background:#082B5B;padding:32px;">
                  <h1 style="margin:0;color:#ffffff;font-size:25px;">
                    GlobeDK Elite Academy
                  </h1>
                  <p style="margin:8px 0 0;color:#dbe7f5;">
                    Excellence in Education. Success for Life.
                  </p>
                </div>

                <div style="padding:40px 32px;">
                  <h2 style="margin-top:0;">
                    Welcome, ${escapeHtml(firstName)}!
                  </h2>

                  <p style="font-size:16px;line-height:1.7;">
                    You have been invited to join
                    <strong>GlobeDK Elite Academy</strong>
                    as a tutor.
                  </p>

                  <p style="font-size:16px;line-height:1.7;">
                    Your tutor account has already been created.
                    To secure your account, simply click the button
                    below and create your password.
                  </p>

                  <div style="text-align:center;margin:32px 0;">
                    <a
                      href="${activationUrl}"
                      style="
                        display:inline-block;
                        background:#082B5B;
                        color:#ffffff;
                        text-decoration:none;
                        padding:15px 28px;
                        border-radius:9px;
                        font-weight:bold;
                      "
                    >
                      Accept Tutor Invitation
                    </a>
                  </div>

                  <p style="font-size:14px;color:#64748b;line-height:1.6;">
                    This invitation expires in 24 hours.
                    If you did not expect this invitation,
                    you can safely ignore this email.
                  </p>

                  <hr style="border:0;border-top:1px solid #e5e7eb;margin:30px 0;" />

                  <p style="font-size:13px;color:#64748b;">
                    GlobeDK Elite Academy<br />
                    Excellence in Education. Success for Life.
                  </p>
                </div>
              </div>
            </body>
          </html>
        `,
      }),
    }
  )

  if (!response.ok) {
    const errorText =
      await response.text()

    throw new Error(
      `Resend email failed: ${errorText}`
    )
  }

  return response.json()
}

function escapeHtml(
  value: string
) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}