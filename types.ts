// types.ts

export interface DocumentType {
  name: string;
  file?: File | null;
  url?: string; // after uploading
}

export interface ExtraLessonForm {
  level: "O-Level" | "A-Level" | "";
  firstName: string;
  lastName: string;
  gender: "Male" | "Female" | "";
  dob: string;
  subjects: string[];
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  relationship: "Parent" | "Guardian" | "Other" | "";
  documents: DocumentType[];
}
