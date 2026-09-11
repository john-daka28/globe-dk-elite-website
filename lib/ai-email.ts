import crypto from "crypto"
import { Resend } from "resend"

function requireEnv(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} is not configured`)
  }

  return value
}

const resendApiKey = requireEnv("RESEND_API_KEY")
const resendFromEmail = requireEnv("RESEND_FROM_EMAIL")
const siteUrl = requireEnv("NEXT_PUBLIC_SITE_URL")

const resend = new Resend(resendApiKey)

export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export function hashToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")
}

export function generateTwoFactorCode(): string {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString()
}

export async function sendAIEmailVerificationEmail({
  email,
  firstName,
  token,
}: {
  email: string
  firstName: string
  token: string
}) {
  const verificationUrl =
    `${siteUrl}/ai/verify-email?token=${encodeURIComponent(token)}`

  const { error } = await resend.emails.send({
    from: resendFromEmail,
    to: email,
    subject:
      "Confirm your GlobeDk AI Learning Hub account",

    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;">

            <div style="background:#10243d;padding:30px;color:#ffffff;">
              <h1 style="margin:0;font-size:24px;">
                GlobeDk AI Learning Hub
              </h1>

              <p style="margin:8px 0 0;color:rgba(255,255,255,.7);">
                Learn smarter. Practise better.
              </p>
            </div>

            <div style="padding:35px;">

              <h2 style="color:#10243d;">
                Welcome, ${firstName}!
              </h2>

              <p style="color:#555;line-height:1.7;">
                Your GlobeDk AI Learning Hub account has been
                created successfully.
              </p>

              <p style="color:#555;line-height:1.7;">
                Before you can sign in, please confirm that
                this email address belongs to you.
              </p>

              <div style="margin:30px 0;">
                <a
                  href="${verificationUrl}"
                  style="
                    display:inline-block;
                    padding:14px 24px;
                    background:#e3a56f;
                    color:#10243d;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:bold;
                  "
                >
                  Confirm My Email
                </a>
              </div>

              <p style="color:#777;font-size:14px;line-height:1.6;">
                This confirmation link expires in 24 hours.
              </p>

              <p style="color:#777;font-size:14px;line-height:1.6;">
                If you did not create this account,
                you can safely ignore this email.
              </p>

            </div>

            <div style="padding:20px 35px;background:#fafafa;color:#888;font-size:12px;">
              GlobeDk Elite | Excellence in Education.
              Success for Life.
            </div>

          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    throw error
  }
}

export async function sendAI2FAEmail({
  email,
  firstName,
  code,
}: {
  email: string
  firstName: string
  code: string
}) {
  const { error } = await resend.emails.send({
    from: resendFromEmail,
    to: email,
    subject:
      "Your GlobeDk AI Learning Hub verification code",

    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;">

            <div style="background:#10243d;padding:30px;color:#ffffff;">
              <h1 style="margin:0;font-size:24px;">
                GlobeDk AI Learning Hub
              </h1>
            </div>

            <div style="padding:35px;">

              <h2 style="color:#10243d;">
                Verify your sign in
              </h2>

              <p style="color:#555;line-height:1.7;">
                Hello ${firstName},
              </p>

              <p style="color:#555;line-height:1.7;">
                Use the verification code below to complete
                your sign in.
              </p>

              <div
                style="
                  margin:30px 0;
                  padding:22px;
                  background:#f4f1ea;
                  border-radius:12px;
                  text-align:center;
                "
              >
                <span
                  style="
                    font-size:36px;
                    font-weight:bold;
                    letter-spacing:10px;
                    color:#10243d;
                  "
                >
                  ${code}
                </span>
              </div>

              <p style="color:#777;font-size:14px;">
                This code expires in 10 minutes.
              </p>

              <p style="color:#777;font-size:14px;">
                If you did not attempt to sign in,
                please ignore this email and consider
                changing your password.
              </p>

            </div>

            <div style="padding:20px 35px;background:#fafafa;color:#888;font-size:12px;">
              GlobeDk Elite | Excellence in Education.
              Success for Life.
            </div>

          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    throw error
  }
}