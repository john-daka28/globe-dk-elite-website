export interface EnrollmentData {
  email: string
  phone: string
  level: "O Level" | "A Level"
  subjects: string[]
  created_at?: string
}
