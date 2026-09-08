import crypto from "crypto"
import { cookies } from "next/headers"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

const SESSION_COOKIE = "globedk_session"

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

type SessionPayload = {
  userId: string
  role: string
  issuedAt: number
  expiresAt: number
}

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error(
      "Missing AUTH_SECRET environment variable"
    )
  }

  return secret
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function base64UrlDecode(value: string): string {
  return Buffer.from(
    value
      .replace(/-/g, "+")
      .replace(/_/g, "/"),
    "base64"
  ).toString()
}

function createSignature(
  encodedPayload: string
): string {
  return crypto
    .createHmac(
      "sha256",
      getAuthSecret()
    )
    .update(encodedPayload)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function createSessionToken(
  payload: SessionPayload
): string {
  const encodedPayload = base64UrlEncode(
    JSON.stringify(payload)
  )

  const signature = createSignature(
    encodedPayload
  )

  return `${encodedPayload}.${signature}`
}

function verifySessionToken(
  token: string
): SessionPayload | null {
  try {
    const [encodedPayload, signature] =
      token.split(".")

    if (!encodedPayload || !signature) {
      return null
    }

    const expectedSignature =
      createSignature(encodedPayload)

    const suppliedBuffer =
      Buffer.from(signature)

    const expectedBuffer =
      Buffer.from(expectedSignature)

    if (
      suppliedBuffer.length !==
      expectedBuffer.length
    ) {
      return null
    }

    if (
      !crypto.timingSafeEqual(
        suppliedBuffer,
        expectedBuffer
      )
    ) {
      return null
    }

    const payload = JSON.parse(
      base64UrlDecode(encodedPayload)
    ) as SessionPayload

    if (
      !payload.userId ||
      !payload.role ||
      !payload.expiresAt
    ) {
      return null
    }

    if (
      Date.now() >= payload.expiresAt
    ) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export async function createSession(
  userId: string,
  role: string
) {
  const now = Date.now()

  const payload: SessionPayload = {
    userId,
    role,
    issuedAt: now,
    expiresAt:
      now + SESSION_MAX_AGE * 1000,
  }

  const token =
    createSessionToken(payload)

  const cookieStore = await cookies()

  cookieStore.set(
    SESSION_COOKIE,
    token,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    }
  )
}

export async function destroySession() {
  const cookieStore = await cookies()

  cookieStore.set(
    SESSION_COOKIE,
    "",
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    }
  )
}

export async function getSessionUser() {
  const cookieStore = await cookies()

  const token =
    cookieStore.get(
      SESSION_COOKIE
    )?.value

  if (!token) {
    return null
  }

  const payload =
    verifySessionToken(token)

  if (!payload) {
    return null
  }

  const { data: user, error } =
    await supabaseAdmin
      .from("users")
      .select(
        `
          id,
          email,
          first_name,
          last_name,
          phone,
          role,
          email_verified,
          account_status
        `
      )
      .eq("id", payload.userId)
      .maybeSingle()

  if (error || !user) {
    return null
  }

  if (
    user.role !== payload.role
  ) {
    return null
  }

  if (
    user.account_status !== "active"
  ) {
    return null
  }

  return user
}

export async function requireSession() {
  const user =
    await getSessionUser()

  if (!user) {
    throw new Error(
      "UNAUTHENTICATED"
    )
  }

  return user
}

export async function requireRole(
  allowedRoles: string[]
) {
  const user =
    await requireSession()

  if (
    !allowedRoles.includes(
      user.role
    )
  ) {
    throw new Error(
      "UNAUTHORIZED"
    )
  }

  return user
}

export const SESSION_COOKIE_NAME =
  SESSION_COOKIE