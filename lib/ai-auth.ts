import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

const AI_SESSION_COOKIE = "globedk_ai_session"

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET is not configured")
  }

  return secret
}

export type AIStudentSession = {
  id: string
  email: string
  firstName: string
  lastName: string
  level: "O-Level" | "A-Level"
  curriculum: "ZIMSEC" | "Cambridge"
}

export function createAIStudentToken(
  student: AIStudentSession
) {
  const secret = getJWTSecret()

  return jwt.sign(
    {
      type: "ai_student",
      id: student.id,
      email: student.email,
      firstName: student.firstName,
      lastName: student.lastName,
      level: student.level,
      curriculum: student.curriculum,
    },
    secret,
    {
      expiresIn: "7d",
    }
  )
}

export async function setAIStudentSession(
  student: AIStudentSession
) {
  const token = createAIStudentToken(student)

  const cookieStore = await cookies()

  cookieStore.set(AI_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function getAIStudentSession(): Promise<AIStudentSession | null> {
  try {
    const secret = getJWTSecret()

    const cookieStore = await cookies()

    const token = cookieStore.get(
      AI_SESSION_COOKIE
    )?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(
      token,
      secret
    ) as jwt.JwtPayload & {
      type?: string
      id?: string
      email?: string
      firstName?: string
      lastName?: string
      level?: "O-Level" | "A-Level"
      curriculum?: "ZIMSEC" | "Cambridge"
    }

    if (
      decoded.type !== "ai_student" ||
      !decoded.id ||
      !decoded.email ||
      !decoded.firstName ||
      !decoded.lastName ||
      !decoded.level ||
      !decoded.curriculum
    ) {
      return null
    }

    return {
      id: decoded.id,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      level: decoded.level,
      curriculum: decoded.curriculum,
    }
  } catch {
    return null
  }
}

export async function clearAIStudentSession() {
  const cookieStore = await cookies()

  cookieStore.set(AI_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
}