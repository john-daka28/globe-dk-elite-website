import RevisionCoachClient from "./RevisionCoachClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title:
    "AI Revision Coach | GlobeDk Elite Academy",
  description:
    "Personal AI Mathematics Revision Coach for GlobeDk Elite Academy students.",
}

export default function RevisionCoachPage() {
  return (
    <RevisionCoachClient />
  )
}