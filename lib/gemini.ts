const DEFAULT_MODEL =
  process.env.GEMINI_MODEL ||
  "gemini-2.5-flash"

function getGeminiApiKey() {
  const key =
    process.env.GEMINI_API_KEY

  if (!key) {
    throw new Error(
      "GEMINI_API_KEY is not configured"
    )
  }

  return key
}

export async function generateGeminiText(
  prompt: string
) {
  const apiKey =
    getGeminiApiKey()

  const model =
    DEFAULT_MODEL

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response =
    await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],

        generationConfig: {
          temperature: 0.25,
          topP: 0.8,
          maxOutputTokens: 12000,
        },
      }),
    })

  const data =
    await response.json()

  if (!response.ok) {
    console.error(
      "Gemini API error:",
      data
    )

    throw new Error(
      data?.error?.message ||
        "Gemini generation failed."
    )
  }

  const text =
    data?.candidates?.[0]
      ?.content?.parts
      ?.map(
        (part: any) =>
          part.text || ""
      )
      .join("") || ""

  if (!text) {
    throw new Error(
      "Gemini returned an empty response."
    )
  }

  return text
}