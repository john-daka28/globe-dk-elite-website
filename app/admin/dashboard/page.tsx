import { redirect } from "next/navigation"

import { requireRole } from "@/lib/auth/session"

import AdminDashboardClient from "./AdminDashboardClient"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
  const admin = await requireRole([
    "admin",
    "administrator",
  ]).catch(() => null)

  if (!admin) {
    redirect("/login")
  }

  return (
    <AdminDashboardClient
      adminName={
        `${admin.first_name || ""} ${
          admin.last_name || ""
        }`.trim()
      }
    />
  )
}