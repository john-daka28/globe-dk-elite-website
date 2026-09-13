import { Suspense } from "react"

import AIVerify2FAClient from "./AIVerify2FAClient"

export default function AIVerify2FAPage() {
  return (
    <Suspense fallback={null}>
      <AIVerify2FAClient />
    </Suspense>
  )
}