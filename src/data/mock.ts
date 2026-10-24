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

  // Patients referenced by the queue (previously had no patient record)
  { id: "5", firstName: "Daniel", lastName: "Okafor", gender: "M", age: 47, emrNumber: "EMR-4417", lastVisit: "2023-11-06", physicianName: "Dr. Varma" },
  { id: "6", firstName: "Priya", lastName: "Nair", gender: "F", age: 38, emrNumber: "EMR-4452", lastVisit: "2023-11-06", physicianName: "Dr. Sterling" },
  { id: "7", firstName: "Hannah", lastName: "Lee", gender: "F", age: 8, emrNumber: "EMR-4460", lastVisit: "2023-11-06", physicianName: "Dr. Varma" },

  // Spinal disorders
  { id: "8", firstName: "Thomas", lastName: "Whitfield", gender: "M", age: 56, emrNumber: "EMR-5101", lastVisit: "2023-10-30", physicianName: "Dr. Iyer" },
  { id: "9", firstName: "Helen", lastName: "Marsh", gender: "F", age: 63, emrNumber: "EMR-5118", lastVisit: "2023-11-01", physicianName: "Dr. Iyer" },

  // Rheumatoid arthritis
  { id: "10", firstName: "Margaret", lastName: "Coleman", gender: "F", age: 48, emrNumber: "EMR-5230", lastVisit: "2023-10-25", physicianName: "Dr. Iyer" },
  { id: "11", firstName: "Samuel", lastName: "Ortiz", gender: "M", age: 55, emrNumber: "EMR-5244", lastVisit: "2023-11-03", physicianName: "Dr. Iyer" },

  // Neurological disorders
  { id: "12", firstName: "Arjun", lastName: "Mehta", gender: "M", age: 41, emrNumber: "EMR-5307", lastVisit: "2023-10-31", physicianName: "Dr. Varma" },
  { id: "13", firstName: "Caroline", lastName: "Fischer", gender: "F", age: 59, emrNumber: "EMR-5321", lastVisit: "2023-11-04", physicianName: "Dr. Varma" },

  // Overweight management
  { id: "14", firstName: "Jonathan", lastName: "Reyes", gender: "M", age: 39, emrNumber: "EMR-5410", lastVisit: "2023-11-02", physicianName: "Dr. Sterling" },
  { id: "15", firstName: "Tanya", lastName: "Brooks", gender: "F", age: 33, emrNumber: "EMR-5426", lastVisit: "2023-10-27", physicianName: "Dr. Sterling" },

  // Detoxification therapy
  { id: "16", firstName: "Kevin", lastName: "Doyle", gender: "M", age: 44, emrNumber: "EMR-5502", lastVisit: "2023-11-03", physicianName: "Dr. Menon" },

  // Osteoarthritis
  { id: "17", firstName: "Dorothy", lastName: "Palmer", gender: "F", age: 67, emrNumber: "EMR-5615", lastVisit: "2023-10-28", physicianName: "Dr. Iyer" },
  { id: "18", firstName: "George", lastName: "Hamilton", gender: "M", age: 71, emrNumber: "EMR-5633", lastVisit: "2023-11-01", physicianName: "Dr. Iyer" },

  // Allergic disorders
  { id: "19", firstName: "Neha", lastName: "Kapoor", gender: "F", age: 26, emrNumber: "EMR-5704", lastVisit: "2023-11-04", physicianName: "Dr. Varma" },
  { id: "20", firstName: "Ethan", lastName: "Cole", gender: "M", age: 12, emrNumber: "EMR-5719", lastVisit: "2023-10-26", physicianName: "Dr. Varma" },

  // Sleep disorders
  { id: "21", firstName: "Liam", lastName: "Hartley", gender: "M", age: 50, emrNumber: "EMR-5808", lastVisit: "2023-10-31", physicianName: "Dr. Menon" },
  { id: "22", firstName: "Mei Lin", lastName: "Chong", gender: "F", age: 37, emrNumber: "EMR-5822", lastVisit: "2023-11-05", physicianName: "Dr. Menon" },

  // Menstrual disorders
  { id: "23", firstName: "Isabella", lastName: "Moreno", gender: "F", age: 31, emrNumber: "EMR-5906", lastVisit: "2023-11-02", physicianName: "Dr. Rao" },
  { id: "24", firstName: "Aisha", lastName: "Rahman", gender: "F", age: 24, emrNumber: "EMR-5921", lastVisit: "2023-10-30", physicianName: "Dr. Rao" },

  // Immunity enhancement
  { id: "25", firstName: "Grace", lastName: "Tan", gender: "F", age: 45, emrNumber: "EMR-6003", lastVisit: "2023-11-01", physicianName: "Dr. Sterling" },
  { id: "26", firstName: "Peter", lastName: "Novak", gender: "M", age: 66, emrNumber: "EMR-6017", lastVisit: "2023-10-29", physicianName: "Dr. Sterling" },

  // Male & female infertility treatment
  { id: "27", firstName: "Olivia", lastName: "Brennan", gender: "F", age: 33, emrNumber: "EMR-6101", lastVisit: "2023-11-03", physicianName: "Dr. Rao" },
  { id: "28", firstName: "Rahul", lastName: "Verma", gender: "M", age: 36, emrNumber: "EMR-6102", lastVisit: "2023-11-03", physicianName: "Dr. Rao" },
  { id: "29", firstName: "Chloe", lastName: "Winters", gender: "F", age: 37, emrNumber: "EMR-6115", lastVisit: "2023-10-27", physicianName: "Dr. Rao" },
  { id: "30", firstName: "Omar", lastName: "Haddad", gender: "M", age: 40, emrNumber: "EMR-6128", lastVisit: "2023-11-04", physicianName: "Dr. Rao" },
];

export const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: "rx1", patientId: "1", medication: "Metformin", dosage: "500 mg", frequency: "Twice daily with meals", prescribedBy: "Dr. Sterling", prescribedDate: "2023-10-12", expiryDate: "2024-04-12", status: "Active", allergyChecked: true },
  { id: "rx2", patientId: "1", medication: "Albuterol Inhaler", dosage: "90 mcg", frequency: "As needed", prescribedBy: "Dr. Sterling", prescribedDate: "2023-10-12", expiryDate: "2024-10-12", status: "Active", allergyChecked: true },
  { id: "rx3", patientId: "2", medication: "Lisinopril", dosage: "10 mg", frequency: "Once daily", prescribedBy: "Dr. Sterling", prescribedDate: "2023-11-05", expiryDate: "2024-05-05", status: "Active", allergyChecked: true },
  { id: "rx4", patientId: "3", medication: "Amoxicillin", dosage: "500 mg", frequency: "Three times daily", prescribedBy: "Dr. Varma", prescribedDate: "2023-11-02", expiryDate: "2023-11-12", status: "Completed", allergyChecked: true },
  { id: "rx5", patientId: "4", medication: "Atorvastatin", dosage: "20 mg", frequency: "Once daily at night", prescribedBy: "Dr. Sterling", prescribedDate: "2023-10-29", expiryDate: "2024-04-29", status: "Active", allergyChecked: false },
  { id: "rx6", patientId: "4", medication: "Ibuprofen", dosage: "400 mg", frequency: "Every 8 hours", prescribedBy: "Dr. Sterling", prescribedDate: "2023-09-10", status: "Cancelled", allergyChecked: true },

  // Neurological (queue patients)
  { id: "rx7", patientId: "6", medication: "Sumatriptan", dosage: "50 mg", frequency: "At migraine onset, max 200 mg/day", prescribedBy: "Dr. Sterling", prescribedDate: "2023-11-06", expiryDate: "2024-05-06", status: "Active", allergyChecked: true },

  // Spinal disorders
  { id: "rx8", patientId: "8", medication: "Naproxen", dosage: "500 mg", frequency: "Twice daily with food", prescribedBy: "Dr. Iyer", prescribedDate: "2023-10-30", expiryDate: "2023-11-13", status: "Completed", allergyChecked: true },
  { id: "rx9", patientId: "8", medication: "Cyclobenzaprine", dosage: "10 mg", frequency: "Once daily at night", prescribedBy: "Dr. Iyer", prescribedDate: "2023-10-30", expiryDate: "2023-11-20", status: "Active", allergyChecked: true },
  { id: "rx10", patientId: "9", medication: "Gabapentin", dosage: "300 mg", frequency: "Three times daily", prescribedBy: "Dr. Iyer", prescribedDate: "2023-11-01", expiryDate: "2024-02-01", status: "Active", allergyChecked: true },

  // Rheumatoid arthritis
  { id: "rx11", patientId: "10", medication: "Methotrexate", dosage: "15 mg", frequency: "Once weekly", prescribedBy: "Dr. Iyer", prescribedDate: "2023-10-25", expiryDate: "2024-04-25", status: "Active", allergyChecked: true },
  { id: "rx12", patientId: "10", medication: "Folic Acid", dosage: "5 mg", frequency: "Once weekly, day after methotrexate", prescribedBy: "Dr. Iyer", prescribedDate: "2023-10-25", expiryDate: "2024-04-25", status: "Active", allergyChecked: true },
  { id: "rx13", patientId: "11", medication: "Hydroxychloroquine", dosage: "200 mg", frequency: "Twice daily", prescribedBy: "Dr. Iyer", prescribedDate: "2023-11-03", expiryDate: "2024-05-03", status: "Active", allergyChecked: true },
  { id: "rx14", patientId: "11", medication: "Sulfasalazine", dosage: "500 mg", frequency: "Twice daily", prescribedBy: "Dr. Iyer", prescribedDate: "2023-08-14", expiryDate: "2023-11-03", status: "Cancelled", allergyChecked: true },

  // Neurological disorders
  { id: "rx15", patientId: "12", medication: "Levetiracetam", dosage: "500 mg", frequency: "Twice daily", prescribedBy: "Dr. Varma", prescribedDate: "2023-10-31", expiryDate: "2024-04-30", status: "Active", allergyChecked: true },
  { id: "rx16", patientId: "13", medication: "Levodopa/Carbidopa", dosage: "100/25 mg", frequency: "Three times daily", prescribedBy: "Dr. Varma", prescribedDate: "2023-11-04", expiryDate: "2024-05-04", status: "Active", allergyChecked: false },

  // Overweight management
  { id: "rx17", patientId: "14", medication: "Orlistat", dosage: "120 mg", frequency: "Three times daily with main meals", prescribedBy: "Dr. Sterling", prescribedDate: "2023-11-02", expiryDate: "2024-02-02", status: "Active", allergyChecked: true },
  { id: "rx18", patientId: "15", medication: "Metformin", dosage: "850 mg", frequency: "Twice daily with meals", prescribedBy: "Dr. Sterling", prescribedDate: "2023-10-27", expiryDate: "2024-04-27", status: "Active", allergyChecked: true },

  // Detoxification therapy
  { id: "rx19", patientId: "16", medication: "Chlordiazepoxide (tapering)", dosage: "25 mg", frequency: "Four times daily, tapered over 7 days", prescribedBy: "Dr. Menon", prescribedDate: "2023-11-03", expiryDate: "2023-11-10", status: "Active", allergyChecked: true },
  { id: "rx20", patientId: "16", medication: "Thiamine (Vitamin B1)", dosage: "100 mg", frequency: "Once daily", prescribedBy: "Dr. Menon", prescribedDate: "2023-11-03", expiryDate: "2024-02-03", status: "Active", allergyChecked: true },
  { id: "rx21", patientId: "16", medication: "Naltrexone", dosage: "50 mg", frequency: "Once daily", prescribedBy: "Dr. Menon", prescribedDate: "2023-11-03", expiryDate: "2024-05-03", status: "Active", allergyChecked: true },

  // Osteoarthritis
  { id: "rx22", patientId: "17", medication: "Diclofenac Gel 1%", dosage: "4 g", frequency: "Applied to knees, four times daily", prescribedBy: "Dr. Iyer", prescribedDate: "2023-10-28", expiryDate: "2024-01-28", status: "Active", allergyChecked: true },
  { id: "rx23", patientId: "17", medication: "Glucosamine Sulfate", dosage: "1500 mg", frequency: "Once daily", prescribedBy: "Dr. Iyer", prescribedDate: "2023-10-28", expiryDate: "2024-04-28", status: "Active", allergyChecked: true },
  { id: "rx24", patientId: "18", medication: "Paracetamol", dosage: "1 g", frequency: "Every 6 hours as needed", prescribedBy: "Dr. Iyer", prescribedDate: "2023-11-01", expiryDate: "2024-02-01", status: "Active", allergyChecked: true },
  { id: "rx25", patientId: "18", medication: "Celecoxib", dosage: "200 mg", frequency: "Once daily", prescribedBy: "Dr. Iyer", prescribedDate: "2023-09-01", status: "Cancelled", allergyChecked: false },

  // Allergic disorders
  { id: "rx26", patientId: "19", medication: "Cetirizine", dosage: "10 mg", frequency: "Once daily at night", prescribedBy: "Dr. Varma", prescribedDate: "2023-11-04", expiryDate: "2024-02-04", status: "Active", allergyChecked: true },
  { id: "rx27", patientId: "19", medication: "Fluticasone Nasal Spray", dosage: "50 mcg/spray", frequency: "2 sprays each nostril daily", prescribedBy: "Dr. Varma", prescribedDate: "2023-11-04", expiryDate: "2024-02-04", status: "Active", allergyChecked: true },
  { id: "rx28", patientId: "20", medication: "Montelukast", dosage: "5 mg", frequency: "Once daily at night", prescribedBy: "Dr. Varma", prescribedDate: "2023-10-26", expiryDate: "2024-04-26", status: "Active", allergyChecked: true },
  { id: "rx29", patientId: "20", medication: "Loratadine", dosage: "10 mg", frequency: "Once daily", prescribedBy: "Dr. Varma", prescribedDate: "2023-09-12", expiryDate: "2023-10-12", status: "Completed", allergyChecked: true },

  // Sleep disorders
  { id: "rx30", patientId: "21", medication: "Melatonin", dosage: "3 mg", frequency: "30 minutes before bedtime", prescribedBy: "Dr. Menon", prescribedDate: "2023-10-31", expiryDate: "2024-01-31", status: "Active", allergyChecked: true },
  { id: "rx31", patientId: "22", medication: "Zolpidem", dosage: "5 mg", frequency: "Once at bedtime, short course", prescribedBy: "Dr. Menon", prescribedDate: "2023-11-05", expiryDate: "2023-11-19", status: "Active", allergyChecked: true },
  { id: "rx32", patientId: "22", medication: "Trazodone", dosage: "50 mg", frequency: "Once at bedtime", prescribedBy: "Dr. Menon", prescribedDate: "2023-09-20", expiryDate: "2023-10-20", status: "Completed", allergyChecked: true },

  // Menstrual disorders
  { id: "rx33", patientId: "23", medication: "Tranexamic Acid", dosage: "500 mg", frequency: "Three times daily during heavy bleeding", prescribedBy: "Dr. Rao", prescribedDate: "2023-11-02", expiryDate: "2024-02-02", status: "Active", allergyChecked: true },
  { id: "rx34", patientId: "23", medication: "Norethisterone", dosage: "5 mg", frequency: "Three times daily for 10 days", prescribedBy: "Dr. Rao", prescribedDate: "2023-11-02", expiryDate: "2023-11-12", status: "Completed", allergyChecked: true },
  { id: "rx35", patientId: "24", medication: "Mefenamic Acid", dosage: "500 mg", frequency: "Three times daily during menses", prescribedBy: "Dr. Rao", prescribedDate: "2023-10-30", expiryDate: "2024-01-30", status: "Active", allergyChecked: true },

  // Immunity enhancement
  { id: "rx36", patientId: "25", medication: "Vitamin D3", dosage: "2000 IU", frequency: "Once daily", prescribedBy: "Dr. Sterling", prescribedDate: "2023-11-01", expiryDate: "2024-05-01", status: "Active", allergyChecked: true },
  { id: "rx37", patientId: "25", medication: "Zinc Sulfate", dosage: "25 mg", frequency: "Once daily", prescribedBy: "Dr. Sterling", prescribedDate: "2023-11-01", expiryDate: "2024-02-01", status: "Active", allergyChecked: true },
  { id: "rx38", patientId: "26", medication: "Vitamin C", dosage: "500 mg", frequency: "Once daily", prescribedBy: "Dr. Sterling", prescribedDate: "2023-10-29", expiryDate: "2024-01-29", status: "Active", allergyChecked: true },
  { id: "rx39", patientId: "26", medication: "Multivitamin", dosage: "1 tablet", frequency: "Once daily with breakfast", prescribedBy: "Dr. Sterling", prescribedDate: "2023-10-29", expiryDate: "2024-04-29", status: "Active", allergyChecked: false },

  // Infertility treatment (female)
  { id: "rx40", patientId: "27", medication: "Clomiphene Citrate", dosage: "50 mg", frequency: "Once daily, cycle days 5–9", prescribedBy: "Dr. Rao", prescribedDate: "2023-11-03", expiryDate: "2024-02-03", status: "Active", allergyChecked: true },
  { id: "rx41", patientId: "27", medication: "Folic Acid", dosage: "5 mg", frequency: "Once daily", prescribedBy: "Dr. Rao", prescribedDate: "2023-11-03", expiryDate: "2024-05-03", status: "Active", allergyChecked: true },
  { id: "rx42", patientId: "29", medication: "Letrozole", dosage: "2.5 mg", frequency: "Once daily, cycle days 3–7", prescribedBy: "Dr. Rao", prescribedDate: "2023-10-27", expiryDate: "2024-01-27", status: "Active", allergyChecked: true },
  { id: "rx43", patientId: "29", medication: "Progesterone (Micronized)", dosage: "200 mg", frequency: "Once daily at night, luteal phase", prescribedBy: "Dr. Rao", prescribedDate: "2023-09-15", expiryDate: "2023-10-15", status: "Completed", allergyChecked: true },

  // Infertility treatment (male)
  { id: "rx44", patientId: "28", medication: "Coenzyme Q10", dosage: "200 mg", frequency: "Once daily", prescribedBy: "Dr. Rao", prescribedDate: "2023-11-03", expiryDate: "2024-05-03", status: "Active", allergyChecked: true },
  { id: "rx45", patientId: "28", medication: "L-Carnitine", dosage: "500 mg", frequency: "Twice daily", prescribedBy: "Dr. Rao", prescribedDate: "2023-11-03", expiryDate: "2024-05-03", status: "Active", allergyChecked: true },
  { id: "rx46", patientId: "30", medication: "Clomiphene Citrate", dosage: "25 mg", frequency: "Once daily on alternate days", prescribedBy: "Dr. Rao", prescribedDate: "2023-11-04", expiryDate: "2024-02-04", status: "Active", allergyChecked: true },
  { id: "rx47", patientId: "30", medication: "Zinc Sulfate", dosage: "30 mg", frequency: "Once daily", prescribedBy: "Dr. Rao", prescribedDate: "2023-08-20", expiryDate: "2023-11-04", status: "Cancelled", allergyChecked: true },
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

  // Specialty visits
  { id: "q7", patientId: "8", patientName: "Thomas Whitfield", age: 56, gender: "M", reason: "Lower back pain radiating to left leg (lumbar disc)", physicianName: "Dr. Iyer", priority: "Urgent", status: "Waiting", arrivedAt: minsAgo(52) },
  { id: "q8", patientId: "10", patientName: "Margaret Coleman", age: 48, gender: "F", reason: "Rheumatoid arthritis: morning stiffness review", physicianName: "Dr. Iyer", priority: "Routine", status: "InConsultation", arrivedAt: minsAgo(48) },
  { id: "q9", patientId: "13", patientName: "Caroline Fischer", age: 59, gender: "F", reason: "Neurological follow-up: tremor and gait", physicianName: "Dr. Varma", priority: "Routine", status: "Waiting", arrivedAt: minsAgo(22) },
  { id: "q10", patientId: "14", patientName: "Jonathan Reyes", age: 39, gender: "M", reason: "Weight management: monthly progress check", physicianName: "Dr. Sterling", priority: "Routine", status: "Waiting", arrivedAt: minsAgo(18) },
  { id: "q11", patientId: "16", patientName: "Kevin Doyle", age: 44, gender: "M", reason: "Detoxification therapy: day 5 monitoring", physicianName: "Dr. Menon", priority: "Urgent", status: "InConsultation", arrivedAt: minsAgo(30) },
  { id: "q12", patientId: "17", patientName: "Dorothy Palmer", age: 67, gender: "F", reason: "Osteoarthritis: knee pain and swelling", physicianName: "Dr. Iyer", priority: "Routine", status: "Waiting", arrivedAt: minsAgo(12) },
  { id: "q13", patientId: "20", patientName: "Ethan Cole", age: 12, gender: "M", reason: "Allergic reaction: hives and wheeze", physicianName: "Dr. Varma", priority: "Emergency", status: "Waiting", arrivedAt: minsAgo(6) },
  { id: "q14", patientId: "21", patientName: "Liam Hartley", age: 50, gender: "M", reason: "Sleep disorder: sleep apnea review", physicianName: "Dr. Menon", priority: "Routine", status: "Waiting", arrivedAt: minsAgo(20) },
  { id: "q15", patientId: "23", patientName: "Isabella Moreno", age: 31, gender: "F", reason: "Menstrual disorder: heavy, irregular bleeding", physicianName: "Dr. Rao", priority: "Urgent", status: "Waiting", arrivedAt: minsAgo(25) },
  { id: "q16", patientId: "25", patientName: "Grace Tan", age: 45, gender: "F", reason: "Immunity enhancement: recurrent infections", physicianName: "Dr. Sterling", priority: "Routine", status: "Waiting", arrivedAt: minsAgo(8) },
  { id: "q17", patientId: "27", patientName: "Olivia Brennan", age: 33, gender: "F", reason: "Infertility: ovulation tracking review", physicianName: "Dr. Rao", priority: "Routine", status: "InConsultation", arrivedAt: minsAgo(38) },
  { id: "q18", patientId: "28", patientName: "Rahul Verma", age: 36, gender: "M", reason: "Infertility: semen analysis follow-up", physicianName: "Dr. Rao", priority: "Routine", status: "Waiting", arrivedAt: minsAgo(36) },
  { id: "q19", patientId: "19", patientName: "Neha Kapoor", age: 26, gender: "F", reason: "Allergic rhinitis: seasonal flare-up", physicianName: "Dr. Varma", priority: "Routine", status: "Completed", arrivedAt: minsAgo(110) },
  { id: "q20", patientId: "22", patientName: "Mei Lin Chong", age: 37, gender: "F", reason: "Insomnia: medication review", physicianName: "Dr. Menon", priority: "Routine", status: "Completed", arrivedAt: minsAgo(130) },
  { id: "q21", patientId: "9", patientName: "Helen Marsh", age: 63, gender: "F", reason: "Spinal stenosis: numbness in legs", physicianName: "Dr. Iyer", priority: "Urgent", status: "Completed", arrivedAt: minsAgo(150) },
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
  { label: "Spinal Disorders", value: 121 },
  { label: "Osteoarthritis", value: 116 },
  { label: "Allergic Disorders", value: 104 },
  { label: "Seasonal Asthma", value: 98 },
  { label: "Sleep Disorders", value: 92 },
  { label: "Overweight / Obesity", value: 88 },
  { label: "Neurological Disorders", value: 81 },
  { label: "Migraine", value: 76 },
  { label: "Rheumatoid Arthritis", value: 69 },
  { label: "Menstrual Disorders", value: 64 },
  { label: "Infertility (Male & Female)", value: 52 },
  { label: "Immunity Enhancement", value: 47 },
  { label: "Detoxification Therapy", value: 31 },
];

// Visits by specialty programme (new series, e.g. for a bar chart on Analytics).
export const MOCK_SPECIALTY_VISITS = [
  { label: "Spinal Disorders", value: 148 },
  { label: "Rheumatoid Arthritis", value: 96 },
  { label: "Neurological Disorders", value: 112 },
  { label: "Overweight Management", value: 133 },
  { label: "Detoxification Therapy", value: 58 },
  { label: "Osteoarthritis", value: 141 },
  { label: "Allergic Disorders", value: 127 },
  { label: "Sleep Disorders", value: 105 },
  { label: "Menstrual Disorders", value: 89 },
  { label: "Immunity Enhancement", value: 74 },
  { label: "Infertility Treatment", value: 83 },
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