import crypto from "crypto"

export function generateSecureToken(): string {
  return crypto.randomBytes(48).toString("hex")
}

export function hashToken(token: string): string {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")
}

export function getTokenExpiry(
  hours = 24
): Date {
  return new Date(
    Date.now() + hours * 60 * 60 * 1000
  )
}