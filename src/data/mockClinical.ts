// data/mockClinical.ts
// Per-patient detail (right-hand panel) and activity records for Clinical Records page.
// Keyed by the same ids as MOCK_PATIENTS in data/mock.ts.
import type { Patient, ClinicalRecord, VisitType } from "../types/clinical";
import { MOCK_PATIENTS } from "./mock";

type Detail = Pick<
  Patient,
  "bloodGroup" | "recentDiagnosis" | "chronicConditions" | "hasAlert" | "alertMessage"
>;

const NO_ALERT = { hasAlert: false, alertMessage: undefined } as const;

export const MOCK_PATIENT_DETAILS: Record<string, Detail> = {
  "1": {
    bloodGroup: "O Positive", recentDiagnosis: "Acute Bronchitis",
    chronicConditions: ["Type 2 Diabetes", "Hypertension", "Seasonal Asthma"],
    hasAlert: true,
    alertMessage: "Patient has a documented severe allergy to Penicillin. Automated script checking is active for all new e-prescriptions.",
  },
  "2": { bloodGroup: "O Positive", recentDiagnosis: "Essential Hypertension", chronicConditions: ["Hypertension"], ...NO_ALERT },
  "3": { bloodGroup: "A Positive", recentDiagnosis: "Bacterial Pharyngitis", chronicConditions: [], ...NO_ALERT },
  "4": {
    bloodGroup: "B Positive", recentDiagnosis: "Hyperlipidemia",
    chronicConditions: ["Hyperlipidemia", "Hypertension"],
    hasAlert: true,
    alertMessage: "Allergy check has not been completed for the current Atorvastatin prescription. Verify before dispensing.",
  },
  "5": {
    bloodGroup: "A Negative", recentDiagnosis: "Suspected Angina", chronicConditions: ["Hypertension"],
    hasAlert: true, alertMessage: "Emergency presentation with chest tightness. Cardiac workup in progress; do not discharge without physician review.",
  },
  "6": { bloodGroup: "O Positive", recentDiagnosis: "Migraine without Aura", chronicConditions: ["Chronic Migraine"], ...NO_ALERT },
  "7": {
    bloodGroup: "B Positive", recentDiagnosis: "Acute Tonsillitis", chronicConditions: [],
    hasAlert: true, alertMessage: "Pediatric patient (8 yrs). All medication doses must be calculated by body weight.",
  },

  // Spinal disorders
  "8": { bloodGroup: "A Positive", recentDiagnosis: "Lumbar Disc Herniation (L4–L5)", chronicConditions: ["Chronic Lower Back Pain"], ...NO_ALERT },
  "9": { bloodGroup: "O Positive", recentDiagnosis: "Lumbar Spinal Stenosis", chronicConditions: ["Spinal Disorder", "Osteoporosis"], ...NO_ALERT },

  // Rheumatoid arthritis
  "10": {
    bloodGroup: "B Positive", recentDiagnosis: "Rheumatoid Arthritis (Seropositive)",
    chronicConditions: ["Rheumatoid Arthritis", "Osteopenia"],
    hasAlert: true, alertMessage: "On weekly Methotrexate. Monitor liver function and blood counts monthly.",
  },
  "11": { bloodGroup: "AB Positive", recentDiagnosis: "Rheumatoid Arthritis", chronicConditions: ["Rheumatoid Arthritis", "Hypertension"], ...NO_ALERT },

  // Neurological disorders
  "12": {
    bloodGroup: "O Positive", recentDiagnosis: "Focal Epilepsy", chronicConditions: ["Epilepsy"],
    hasAlert: true, alertMessage: "Seizure precautions apply. Patient advised not to drive until cleared by neurology.",
  },
  "13": {
    bloodGroup: "A Positive", recentDiagnosis: "Parkinson's Disease",
    chronicConditions: ["Parkinson's Disease", "Hypertension"],
    hasAlert: true, alertMessage: "Allergy check pending for Levodopa/Carbidopa. Confirm before next refill.",
  },

  // Overweight management
  "14": { bloodGroup: "B Positive", recentDiagnosis: "Obesity Class I (BMI 31.8)", chronicConditions: ["Obesity", "Prediabetes"], ...NO_ALERT },
  "15": { bloodGroup: "O Negative", recentDiagnosis: "Overweight with Insulin Resistance (BMI 28.4)", chronicConditions: ["PCOS", "Insulin Resistance"], ...NO_ALERT },

  // Detoxification therapy
  "16": {
    bloodGroup: "A Positive", recentDiagnosis: "Alcohol Withdrawal: Detoxification Day 5",
    chronicConditions: ["Alcohol Use Disorder"],
    hasAlert: true, alertMessage: "Supervised detoxification in progress. Monitor vitals and withdrawal severity scores at every visit.",
  },

  // Osteoarthritis
  "17": { bloodGroup: "O Positive", recentDiagnosis: "Knee Osteoarthritis (Bilateral)", chronicConditions: ["Osteoarthritis", "Hypertension"], ...NO_ALERT },
  "18": {
    bloodGroup: "B Negative", recentDiagnosis: "Hip Osteoarthritis",
    chronicConditions: ["Osteoarthritis", "Chronic Kidney Disease (Stage 2)"],
    hasAlert: true, alertMessage: "Avoid systemic NSAIDs due to reduced renal function. Celecoxib was cancelled and its allergy check was not completed.",
  },

  // Allergic disorders
  "19": { bloodGroup: "A Positive", recentDiagnosis: "Seasonal Allergic Rhinitis", chronicConditions: ["Allergic Rhinitis", "Eczema"], ...NO_ALERT },
  "20": {
    bloodGroup: "O Positive", recentDiagnosis: "Acute Urticaria with Wheeze",
    chronicConditions: ["Allergic Asthma", "Peanut Allergy"],
    hasAlert: true, alertMessage: "Documented peanut allergy. An epinephrine auto-injector must be available during every visit.",
  },

  // Sleep disorders
  "21": { bloodGroup: "AB Negative", recentDiagnosis: "Obstructive Sleep Apnea", chronicConditions: ["Obstructive Sleep Apnea", "Hypertension"], ...NO_ALERT },
  "22": {
    bloodGroup: "B Positive", recentDiagnosis: "Chronic Insomnia", chronicConditions: ["Insomnia", "Anxiety"],
    hasAlert: true, alertMessage: "Zolpidem is a short course only. Review before any renewal.",
  },

  // Menstrual disorders
  "23": { bloodGroup: "O Positive", recentDiagnosis: "Menorrhagia (Heavy Menstrual Bleeding)", chronicConditions: ["PCOS", "Iron-Deficiency Anaemia"], ...NO_ALERT },
  "24": { bloodGroup: "A Positive", recentDiagnosis: "Primary Dysmenorrhea", chronicConditions: [], ...NO_ALERT },

  // Immunity enhancement
  "25": { bloodGroup: "B Positive", recentDiagnosis: "Recurrent Respiratory Infections", chronicConditions: ["Vitamin D Deficiency"], ...NO_ALERT },
  "26": {
    bloodGroup: "O Positive", recentDiagnosis: "Immunity Enhancement Review",
    chronicConditions: ["Type 2 Diabetes", "Hypertension"],
    hasAlert: true, alertMessage: "Allergy check has not been completed for the current Multivitamin prescription.",
  },

  // Infertility treatment
  "27": { bloodGroup: "A Positive", recentDiagnosis: "Female Infertility: Anovulation", chronicConditions: ["PCOS"], ...NO_ALERT },
  "28": { bloodGroup: "B Positive", recentDiagnosis: "Male Infertility: Oligoasthenozoospermia", chronicConditions: [], ...NO_ALERT },
  "29": { bloodGroup: "O Positive", recentDiagnosis: "Female Infertility: Diminished Ovarian Reserve", chronicConditions: ["Endometriosis"], ...NO_ALERT },
  "30": { bloodGroup: "AB Positive", recentDiagnosis: "Male Infertility: Low Sperm Count", chronicConditions: ["Varicocele"], ...NO_ALERT },
};

// [visitType, visitDate, notes], newest first.
type Seed = [VisitType, string, string];

const SEEDS: Record<string, Seed[]> = {
  "1": [
    ["Consultation", "2023-10-12T14:30:00", "Follow-up on respiratory symptoms with Dr. Sterling"],
    ["LabResults", "2023-09-28T09:15:00", "Comprehensive Metabolic Panel (CMP)"],
  ],
  "2": [
    ["Consultation", "2023-11-05T10:20:00", "Blood pressure review; Lisinopril 10 mg started"],
    ["LabResults", "2023-10-20T08:45:00", "Renal function and electrolyte panel"],
  ],
  "3": [
    ["FollowUp", "2023-11-02T11:05:00", "Sore throat reassessment; Amoxicillin course prescribed"],
    ["Consultation", "2023-08-14T15:40:00", "Annual wellness check"],
  ],
  "4": [
    ["Consultation", "2023-10-29T09:30:00", "Lipid review; Atorvastatin 20 mg prescribed"],
    ["LabResults", "2023-10-22T07:50:00", "Fasting lipid profile"],
    ["FollowUp", "2023-09-10T13:10:00", "Musculoskeletal pain follow-up"],
  ],
  "5": [
    ["Emergency", "2023-11-06T16:10:00", "Presented with chest tightness; ECG and troponin ordered"],
    ["Consultation", "2023-08-02T10:00:00", "Hypertension check"],
  ],
  "6": [
    ["Consultation", "2023-11-06T14:25:00", "Persistent migraine; Sumatriptan prescribed"],
    ["FollowUp", "2023-09-18T12:00:00", "Headache diary review"],
  ],
  "7": [
    ["Consultation", "2023-11-06T15:50:00", "Fever and sore throat; throat swab taken"],
    ["FollowUp", "2023-06-12T10:30:00", "Routine pediatric check-up"],
  ],
  "8": [
    ["Consultation", "2023-10-30T10:15:00", "Lumbar disc herniation; Naproxen and Cyclobenzaprine prescribed"],
    ["LabResults", "2023-10-24T14:00:00", "Lumbar spine MRI report received"],
    ["Consultation", "2023-10-16T09:40:00", "Initial assessment of lower back pain radiating to left leg"],
  ],
  "9": [
    ["Consultation", "2023-11-01T11:30:00", "Spinal stenosis review; Gabapentin started"],
    ["LabResults", "2023-10-18T08:20:00", "Bone density (DEXA) scan results"],
  ],
  "10": [
    ["FollowUp", "2023-10-25T10:45:00", "Rheumatoid arthritis: morning stiffness review"],
    ["LabResults", "2023-10-20T08:10:00", "RF, anti-CCP, ESR and CRP panel"],
    ["Consultation", "2023-09-15T14:20:00", "Methotrexate dose adjustment"],
  ],
  "11": [
    ["Consultation", "2023-11-03T13:00:00", "Hydroxychloroquine started; Sulfasalazine discontinued"],
    ["LabResults", "2023-10-27T09:05:00", "Inflammatory markers and liver function panel"],
  ],
  "12": [
    ["FollowUp", "2023-10-31T11:10:00", "Epilepsy follow-up; Levetiracetam dose confirmed"],
    ["LabResults", "2023-10-12T08:30:00", "EEG report received"],
  ],
  "13": [
    ["Consultation", "2023-11-04T10:00:00", "Tremor and gait assessment; Levodopa/Carbidopa continued"],
    ["FollowUp", "2023-09-22T15:15:00", "Medication response review"],
  ],
  "14": [
    ["FollowUp", "2023-11-02T09:50:00", "Weight management: monthly progress check; Orlistat started"],
    ["LabResults", "2023-10-26T07:45:00", "Fasting glucose and HbA1c"],
    ["Consultation", "2023-10-02T10:30:00", "Initial BMI assessment and dietary counselling"],
  ],
  "15": [
    ["Consultation", "2023-10-27T12:20:00", "Weight management and insulin resistance review"],
    ["LabResults", "2023-10-19T08:00:00", "Fasting insulin and lipid profile"],
  ],
  "16": [
    ["FollowUp", "2023-11-03T09:00:00", "Detoxification therapy: day 5 monitoring"],
    ["Emergency", "2023-10-29T22:40:00", "Admitted for supervised alcohol withdrawal management"],
    ["LabResults", "2023-10-30T07:30:00", "Liver function tests and electrolytes"],
  ],
  "17": [
    ["Consultation", "2023-10-28T11:00:00", "Knee osteoarthritis: pain and swelling assessment"],
    ["LabResults", "2023-10-21T13:25:00", "Knee X-ray report received"],
  ],
  "18": [
    ["Consultation", "2023-11-01T14:10:00", "Hip osteoarthritis; Paracetamol prescribed, NSAIDs avoided"],
    ["LabResults", "2023-10-25T08:15:00", "Renal function panel (eGFR)"],
  ],
  "19": [
    ["Consultation", "2023-11-04T10:35:00", "Seasonal allergic rhinitis flare-up; Cetirizine and nasal spray prescribed"],
    ["LabResults", "2023-10-10T09:00:00", "Skin prick allergy test results"],
  ],
  "20": [
    ["Emergency", "2023-11-06T17:05:00", "Allergic reaction with hives and wheeze"],
    ["Consultation", "2023-10-26T16:00:00", "Allergic asthma review; Montelukast started"],
  ],
  "21": [
    ["FollowUp", "2023-10-31T11:45:00", "Sleep apnea review; CPAP compliance data checked"],
    ["LabResults", "2023-10-14T07:30:00", "Overnight polysomnography report"],
  ],
  "22": [
    ["FollowUp", "2023-11-05T15:00:00", "Insomnia: medication review"],
    ["Consultation", "2023-09-20T10:10:00", "Sleep hygiene counselling; Trazodone trial"],
  ],
  "23": [
    ["Consultation", "2023-11-02T09:25:00", "Heavy, irregular bleeding; Tranexamic Acid and Norethisterone prescribed"],
    ["LabResults", "2023-10-24T08:40:00", "Haemoglobin, ferritin and thyroid panel"],
    ["LabResults", "2023-10-26T13:30:00", "Pelvic ultrasound report"],
  ],
  "24": [
    ["Consultation", "2023-10-30T12:15:00", "Painful periods; Mefenamic Acid prescribed"],
    ["FollowUp", "2023-08-28T10:00:00", "Menstrual cycle diary review"],
  ],
  "25": [
    ["Consultation", "2023-11-01T10:50:00", "Recurrent infections; immunity enhancement plan started"],
    ["LabResults", "2023-10-25T07:55:00", "Vitamin D, zinc and immunoglobulin levels"],
  ],
  "26": [
    ["FollowUp", "2023-10-29T11:20:00", "Immunity enhancement review; Vitamin C and multivitamin prescribed"],
    ["LabResults", "2023-10-20T08:05:00", "Complete blood count and HbA1c"],
  ],
  "27": [
    ["FollowUp", "2023-11-03T10:00:00", "Ovulation tracking review; Clomiphene cycle 2"],
    ["LabResults", "2023-10-08T08:30:00", "Day 21 progesterone and AMH levels"],
    ["Consultation", "2023-09-12T11:40:00", "Initial infertility consultation"],
  ],
  "28": [
    ["FollowUp", "2023-11-03T10:40:00", "Semen analysis follow-up; CoQ10 and L-Carnitine started"],
    ["LabResults", "2023-10-18T09:15:00", "Semen analysis report"],
  ],
  "29": [
    ["Consultation", "2023-10-27T14:50:00", "Diminished ovarian reserve; Letrozole cycle planned"],
    ["LabResults", "2023-10-12T08:20:00", "AMH, FSH and antral follicle count"],
  ],
  "30": [
    ["Consultation", "2023-11-04T13:15:00", "Low sperm count; Clomiphene and Zinc supplementation"],
    ["LabResults", "2023-10-20T09:30:00", "Hormone panel (FSH, LH, testosterone)"],
  ],
};

/** Full Patient (list fields + clinical detail) for the right-hand panel. */
export function getMockPatient(id: string): Patient | null {
  const base = MOCK_PATIENTS.find((p) => p.id === id);
  if (!base) return null;
  return { ...base, ...(MOCK_PATIENT_DETAILS[id] ?? NO_ALERT) } as Patient;
}

/** Activity records for one patient, newest first. */
export function getMockRecords(patientId: string): ClinicalRecord[] {
  const patient = MOCK_PATIENTS.find((p) => p.id === patientId);
  if (!patient) return [];
  return (SEEDS[patientId] ?? []).map(([visitType, visitDate, notes], i) => ({
    id: `r-${patientId}-${i + 1}`,
    patientId,
    emrNumber: patient.emrNumber,
    visitDate,
    physicianName: patient.physicianName,
    visitType,
    notes,
  }));
}
