"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExtraLessonForm, DocumentType } from "@/types";
import { supabase } from "@/lib/supabaseClient";

export default function ExtraLessonApplication() {
  const [formData, setFormData] = useState<ExtraLessonForm>({
    level: "",
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    subjects: [],
    guardianName: "",
    guardianPhone: "",
    guardianEmail: "",
    relationship: "",
    documents: [],
  });

  const oLevelSubjects = ["English", "Computer Science", "Maths", "Geography"];
  const aLevelSubjects = ["Computer Science", "Pure Maths", "Geography"];
  const relationships = ["Parent", "Guardian", "Other"];

  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);

  // Update subjects when level changes
  useEffect(() => {
    if (formData.level === "O-Level") setAvailableSubjects(oLevelSubjects);
    else if (formData.level === "A-Level") setAvailableSubjects(aLevelSubjects);
    else setAvailableSubjects([]);

    setFormData((prev) => ({ ...prev, subjects: [] }));
  }, [formData.level]);

  const handleChange = (field: keyof ExtraLessonForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubjectsChange = (subject: string) => {
    handleChange(
      "subjects",
      formData.subjects.includes(subject)
        ? formData.subjects.filter((s) => s !== subject)
        : [...formData.subjects, subject]
    );
  };

  const handleDocumentChange = (index: number, value: File | null, name: string) => {
    const docs = [...formData.documents];
    docs[index] = { name, file: value };
    handleChange("documents", docs);
  };

  const addDocument = () => {
    handleChange("documents", [...formData.documents, { name: "", file: null }]);
  };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Basic validation
  if (!formData.firstName || !formData.lastName || !formData.level || formData.subjects.length === 0) {
    alert("Please fill in all required fields and select subjects.");
    return;
  }

  try {
    // Upload documents to Supabase Storage
    const uploadedDocs: DocumentType[] = [];
    for (const doc of formData.documents) {
      if (doc.file) {
        const fileExt = doc.file.name.split(".").pop();
        const fileName = `${Date.now()}_${doc.name}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from("extra-lesson-documents")
          .upload(fileName, doc.file);
        if (error) throw error;

        const { publicURL } = supabase.storage
          .from("extra-lesson-documents")
          .getPublicUrl(data.path);

        uploadedDocs.push({ name: doc.name, url: publicURL });
      } else if (doc.name) {
        uploadedDocs.push({ name: doc.name });
      }
    }

    // Insert into Supabase table
    const { error: dbError } = await supabase.from("extra_lesson_applications").insert([
      {
        level: formData.level,
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
        dob: formData.dob,
        subjects: formData.subjects,
        guardian_name: formData.guardianName,
        guardian_phone: formData.guardianPhone,
        guardian_email: formData.guardianEmail,
        relationship: formData.relationship,
        documents: uploadedDocs,
      },
    ]);

    if (dbError) throw dbError;

    // Call email API
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        level: formData.level,
        gender: formData.gender,
        dob: formData.dob,
        subjects: formData.subjects,
        guardianName: formData.guardianName,
        guardianPhone: formData.guardianPhone,
        guardianEmail: formData.guardianEmail,
        relationship: formData.relationship,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to send email");
    }

    alert("Application submitted successfully! ");

    // Reset form
    setFormData({
      level: "",
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      subjects: [],
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      relationship: "",
      documents: [],
    });
  } catch (error: any) {
    console.error("Form submission failed:", error);
    alert("Error submitting application: " + error.message);
  }
};




  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold text-center mb-8">
          Extra Lesson Application Form
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Level Selection */}
          <div>
            <label className="block font-medium mb-1">Select Level</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={formData.level}
              onChange={(e) => handleChange("level", e.target.value)}
            >
              <option value="">Select Level</option>
              <option value="O-Level">O-Level</option>
              <option value="A-Level">A-Level</option>
            </select>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">First Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Last Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Gender</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={formData.dob}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>
          </div>

          {/* Subjects Selection */}
          {availableSubjects.length > 0 && (
            <div>
              <label className="block font-medium mb-2">Select Subjects of Interest</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableSubjects.map((subject) => (
                  <label key={subject} className="inline-flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.subjects.includes(subject)}
                      onChange={() => handleSubjectsChange(subject)}
                      className="w-4 h-4"
                    />
                    <span>{subject}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Guardian Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Guardian Full Name</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.guardianName}
                onChange={(e) => handleChange("guardianName", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Guardian Phone Number</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={formData.guardianPhone}
                onChange={(e) => handleChange("guardianPhone", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Guardian Email</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                value={formData.guardianEmail}
                onChange={(e) => handleChange("guardianEmail", e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Relationship with Student</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={formData.relationship}
                onChange={(e) => handleChange("relationship", e.target.value)}
              >
                <option value="">Select relationship</option>
                {relationships.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Documents Upload */}
          {/* <div className="space-y-4">
            <h2 className="font-medium">Documents Upload (Optional)</h2>
            {formData.documents.map((doc, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <input
                  type="text"
                  placeholder="Document Name"
                  className="w-full border rounded px-3 py-2"
                  value={doc.name}
                  onChange={(e) => handleDocumentChange(index, doc.file || null, e.target.value)}
                />
                <input
                  type="file"
                  className="w-full"
                  onChange={(e) => handleDocumentChange(index, e.target.files?.[0] || null, doc.name)}
                />
              </div>
            ))}
            <button type="button" className="text-blue-600 underline mt-2" onClick={addDocument}>
              + Add Another Document
            </button>
          </div> */}

          <div className="text-center mt-6">
            <Button type="submit" className="w-full md:w-auto">
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
