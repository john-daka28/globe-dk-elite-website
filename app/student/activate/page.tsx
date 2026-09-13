import { Suspense } from "react"

import StudentActivationClient from "./StudentActivationClient"

export default function StudentActivationPage() {
  return (
    <Suspense fallback={null}>
      <StudentActivationClient />
    </Suspense>
  )
}