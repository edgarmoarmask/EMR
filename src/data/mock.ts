// data/mock.ts
// Mock seed data shared by every page. Pages try Amplify first and fall back to this.
import type {
  PatientListItem, Prescription, QueueEntry,
} from "../types/clinical";

export const MOCK_PATIENTS: PatientListItem[] = [
  { id: "1", firstName: "Eleanor", lastName: "Abbott", gender: "F", age: 34, emrNumber: "EMR-2940", lastVisit: "2023-10-12", physicianName: "Dr. Sterling" },
  { id: "2", firstName: "Marcus", lastName: "Knight", gender: "M", age: 52, emrNumber: "EMR-3102", lastVisit: "2023-11-05", physicianName: "Dr. Sterling" },
  { id: "3", firstName: "Sarah", lastName: "Jenkins", gender: "F", age: 29, emrNumber: "EMR-8841", lastVisit: "2023-11-02", physicianName: "Dr. Varma" },
  { id: "4", firstName: "Robert", lastName: "Benson", gender: "M", age: 61, emrNumber: "EMR-1029", lastVisit: "2023-10-29", physicianName: "Dr. Sterling" },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: "rx1", patientId: "1", medication: "Metformin", dosage: "500 mg", frequency: "Twice daily with meals", prescribedBy: "Dr. Sterling", prescribedDate: "2023-10-12", expiryDate: "2024-04-12", status: "Active", allergyChecked: true },
  { id: "rx2", patientId: "1", medication: "Albuterol Inhaler", dosage: "90 mcg", frequency: "As needed", prescribedBy: "Dr. Sterling", prescribedDate: "2023-10-12", expiryDate: "2024-10-12", status: "Active", allergyChecked: true },
  { id: "rx3", patientId: "2", medication: "Lisinopril", dosage: "10 mg", frequency: "Once daily", prescribedBy: "Dr. Sterling", prescribedDate: "2023-11-05", expiryDate: "2024-05-05", status: "Active", allergyChecked: true },
  { id: "rx4", patientId: "3", medication: "Amoxicillin", dosage: "500 mg", frequency: "Three times daily", prescribedBy: "Dr. Varma", prescribedDate: "2023-11-02", expiryDate: "2023-11-12", status: "Completed", allergyChecked: true },
  { id: "rx5", patientId: "4", medication: "Atorvastatin", dosage: "20 mg", frequency: "Once daily at night", prescribedBy: "Dr. Sterling", prescribedDate: "2023-10-29", expiryDate: "2024-04-29", status: "Active", allergyChecked: false },
  { id: "rx6", patientId: "4", medication: "Ibuprofen", dosage: "400 mg", frequency: "Every 8 hours", prescribedBy: "Dr. Sterling", prescribedDate: "2023-09-10", status: "Cancelled", allergyChecked: true },
];

// Build arrival times relative to "now" so the queue always looks live.
const minsAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();

export const MOCK_QUEUE: QueueEntry[] = [
  { id: "q1", patientId: "5", patientName: "Daniel Okafor", age: 47, gender: "M", reason: "Chest tightness", physicianName: "Dr. Varma", priority: "Emergency", status: "InConsultation", arrivedAt: minsAgo(42) },
  { id: "q2", patientId: "3", patientName: "Sarah Jenkins", age: 29, gender: "F", reason: "Follow-up: antibiotic course", physicianName: "Dr. Varma", priority: "Routine", status: "Waiting", arrivedAt: minsAgo(35) },
  { id: "q3", patientId: "6", patientName: "Priya Nair", age: 38, gender: "F", reason: "Persistent migraine", physicianName: "Dr. Sterling", priority: "Urgent", status: "Waiting", arrivedAt: minsAgo(28) },
  { id: "q4", patientId: "4", patientName: "Robert Benson", age: 61, gender: "M", reason: "Cholesterol review", physicianName: "Dr. Sterling", priority: "Routine", status: "Waiting", arrivedAt: minsAgo(15) },
  { id: "q5", patientId: "7", patientName: "Hannah Lee", age: 8, gender: "F", reason: "Fever and sore throat", physicianName: "Dr. Varma", priority: "Urgent", status: "Waiting", arrivedAt: minsAgo(9) },
  { id: "q6", patientId: "1", patientName: "Eleanor Abbott", age: 34, gender: "F", reason: "Blood glucose check", physicianName: "Dr. Sterling", priority: "Routine", status: "Completed", arrivedAt: minsAgo(95) },
];

// Static series for the Analytics page.
export const MOCK_MONTHLY_VISITS = [
  { label: "May", value: 842 }, { label: "Jun", value: 910 }, { label: "Jul", value: 884 },
  { label: "Aug", value: 951 }, { label: "Sep", value: 1012 }, { label: "Oct", value: 1087 },
];

export const MOCK_DIAGNOSES = [
  { label: "Hypertension", value: 212 },
  { label: "Type 2 Diabetes", value: 187 },
  { label: "Acute Bronchitis", value: 134 },
  { label: "Seasonal Asthma", value: 98 },
  { label: "Migraine", value: 76 },
];

export const MOCK_VISIT_MIX = [
  { label: "Consultation", value: 46, color: "#2dc9a8" },
  { label: "Follow-up", value: 27, color: "#6b7fc4" },
  { label: "Lab Results", value: 19, color: "#c49a6b" },
  { label: "Emergency", value: 8, color: "#c44a1a" },
];

export const MOCK_AGE_GROUPS = [
  { label: "0–17", value: 142 }, { label: "18–34", value: 318 }, { label: "35–49", value: 354 },
  { label: "50–64", value: 276 }, { label: "65+", value: 150 },
];
