import { Suspense } from "react"

import TutorActivationClient from "./TutorActivationClient"

export default function TutorActivationPage() {
  return (
    <Suspense fallback={null}>
      <TutorActivationClient />
    </Suspense>
  )
}