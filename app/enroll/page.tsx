"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function EnrollPage() {
  const [level, setLevel] = useState("")
  const [subjects, setSubjects] = useState<string[]>([])
  const [phone, setPhone] = useState("")

  const availableSubjects = {
    "O Level": ["English", "Maths", "Geography", "Computer Science"],
    "A Level": ["Computer Science", "Pure Maths", "Geography"],
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Enrollment submitted:\nLevel: ${level}\nSubjects: ${subjects.join(", ")}\nPhone: ${phone}`)
  }

  const handleWhatsApp = () => {
    const adminNumber = "+263786053315"
    const message = encodeURIComponent(
      `Hello! I want to enroll for ${level} in the following subjects: ${subjects.join(", ")}. My number is ${phone}.`
    )
    window.open(`https://wa.me/${adminNumber}?text=${message}`, "_blank")
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-8">
      <Card className="max-w-md w-full shadow-lg rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center text-primary">Enroll for Lessons</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Level */}
            <div>
              <label className="block mb-1 font-medium">Select Level</label>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value)
                  setSubjects([])
                }}
                required
                className="w-full border rounded-lg p-2"
              >
                <option value="">-- Choose Level --</option>
                <option value="O Level">O Level</option>
                <option value="A Level">A Level</option>
              </select>
            </div>

            {/* Select Subjects */}
            {level && (
              <div>
                <label className="block mb-1 font-medium">Select Subjects</label>
                {availableSubjects[level as keyof typeof availableSubjects].map((subject) => (
                  <div key={subject} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subjects.includes(subject)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSubjects([...subjects, subject])
                        } else {
                          setSubjects(subjects.filter((s) => s !== subject))
                        }
                      }}
                    />
                    <span>{subject}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Number */}
            <div>
              <label className="block mb-1 font-medium">Contact Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+2637XXXXXXX"
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button type="submit" className="w-full">
                Submit Enrollment
              </Button>
              <Button
                type="button"
                onClick={handleWhatsApp}
                variant="outline"
                className="w-full"
              >
                WhatsApp Us
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
