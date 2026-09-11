import { NextRequest, NextResponse } from "next/server"

import {
  generateZimsecMathPatternAnalysis,
} from "@/lib/zimsec-math-pattern-analysis"

export const runtime = "nodejs"

export async function POST(
  request: NextRequest,
) {
  try {
    let body: {
      paper?: "Paper 1" | "Paper 2" | "Both"
    } = {}

    try {
      body = await request.json()
    } catch {
      body = {}
    }

    const requestedPaper =
      body.paper ?? "Both"

    if (
      requestedPaper !== "Paper 1" &&
      requestedPaper !== "Paper 2" &&
      requestedPaper !== "Both"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid paper. Use Paper 1, Paper 2, or Both.",
        },
        { status: 400 },
      )
    }

    const result =
      await generateZimsecMathPatternAnalysis({
        paper: requestedPaper,
      })

    return NextResponse.json({
      success: true,
      message:
        "ZIMSEC Mathematics pattern analysis completed successfully.",
      paper: requestedPaper,
      ...result,
    })
  } catch (error) {
    console.error(
      "ZIMSEC Mathematics pattern analysis error:",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate ZIMSEC Mathematics pattern analysis.",
      },
      { status: 500 },
    )
  }
}

export async function GET(
  request: NextRequest,
) {
  try {
    const paperParam =
      request.nextUrl.searchParams.get(
        "paper",
      )

    const requestedPaper =
      paperParam === "Paper 1" ||
      paperParam === "Paper 2"
        ? paperParam
        : "Both"

    const result =
      await generateZimsecMathPatternAnalysis({
        paper: requestedPaper,
      })

    return NextResponse.json({
      success: true,
      message:
        "ZIMSEC Mathematics pattern analysis completed successfully.",
      paper: requestedPaper,
      ...result,
    })
  } catch (error) {
    console.error(
      "ZIMSEC Mathematics pattern analysis error:",
      error,
    )

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate ZIMSEC Mathematics pattern analysis.",
      },
      { status: 500 },
    )
  }
}