import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export type CurrentUser = {
  userId: string
  role: string
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const cookieStore = await cookies()

    const session = cookieStore.get("session")?.value

    if (!session) {
      return null
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      console.error("JWT_SECRET is missing.")
      return null
    }

    const secretKey = new TextEncoder().encode(secret)

    const { payload } = await jwtVerify(
      session,
      secretKey
    )

    const userId =
      typeof payload.userId === "string"
        ? payload.userId
        : typeof payload.sub === "string"
        ? payload.sub
        : null

    const role =
      typeof payload.role === "string"
        ? payload.role
        : null

    if (!userId || !role) {
      return null
    }

    return {
      userId,
      role,
    }
  } catch (error) {
    console.error(
      "Unable to read current user session:",
      error
    )

    return null
  }
}