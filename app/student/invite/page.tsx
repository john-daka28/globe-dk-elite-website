import { Suspense } from "react"

import StudentInviteClient from "./StudentInviteClient"

export default function StudentInvitationPage() {
  return (
    <Suspense fallback={null}>
      <StudentInviteClient />
    </Suspense>
  )
}