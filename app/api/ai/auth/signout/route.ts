import { NextResponse } from "next/server"

import {
  clearAIStudentSession,
} from "@/lib/ai-auth"

export async function POST() {
  await clearAIStudentSession()

  return NextResponse.json({
    success: true,
  })
}