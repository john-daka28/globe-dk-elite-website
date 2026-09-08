import bcrypt from "bcryptjs"

export async function hashPassword(
  password: string
): Promise<string> {
  if (!password || password.length < 8) {
    throw new Error(
      "Password must contain at least 8 characters."
    )
  }

  return bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    if (!password || !storedHash) {
      return false
    }

    return await bcrypt.compare(
      password,
      storedHash
    )
  } catch {
    return false
  }
}