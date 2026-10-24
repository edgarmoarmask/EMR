// types/clinical.ts
// Shared TypeScript types for the Clinical Records page

export type Gender = "M" | "F" | "Other";
export type BloodGroup = "A Positive" | "A Negative" | "B Positive" | "B Negative" | "O Positive" | "O Negative" | "AB Positive" | "AB Negative";
export type VisitType = "Consultation" | "LabResults" | "FollowUp" | "Emergency";
export type PrescriptionStatus = "Active" | "Completed" | "Cancelled";

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  bloodGroup?: BloodGroup;
  photoUrl?: string;
  recentDiagnosis?: string;
  chronicConditions?: string[];
  physicianName?: string;
  lastVisit?: string; // ISO date string
  hasAlert?: boolean;
  alertMessage?: string;
  emrNumber: string; // derived from records
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicalRecord {
  id: string;
  patientId: string;
  emrNumber: string;
  visitDate: string; // ISO datetime string
  physicianName: string;
  visitType: VisitType;
  notes?: string;
  diagnosis?: string;
  attachments?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  medication: string;
  dosage: string;
  frequency: string;
  prescribedBy: string;
  prescribedDate: string;
  expiryDate?: string;
  status: PrescriptionStatus;
  allergyChecked: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatientWithRecords extends Patient {
  records?: ClinicalRecord[];
  prescriptions?: Prescription[];
}

export interface PatientListItem {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  emrNumber: string;
  lastVisit: string;
  physicianName: string;
}
