import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Patient: a
    .model({
      firstName: a.string().required(),
      lastName: a.string().required(),
      gender: a.enum(["M", "F", "Other"]),
      age: a.integer().required(),
      bloodGroup: a.string(),
      photoUrl: a.string(),
      recentDiagnosis: a.string(),
      chronicConditions: a.string().array(),
      physicianName: a.string(),
      lastVisit: a.date(),
      hasAlert: a.boolean().default(false),
      alertMessage: a.string(),
      records: a.hasMany("ClinicalRecord", "patientId"),
      prescriptions: a.hasMany("Prescription", "patientId"),
    })
    .authorization((allow) => [allow.authenticated()]),

  ClinicalRecord: a
    .model({
      patientId: a.id().required(),
      patient: a.belongsTo("Patient", "patientId"),
      emrNumber: a.string().required(),
      visitDate: a.datetime().required(),
      physicianName: a.string().required(),
      visitType: a.enum(["Consultation", "LabResults", "FollowUp", "Emergency"]),
      notes: a.string(),
      diagnosis: a.string(),
      attachments: a.string().array(),
    })
    .authorization((allow) => [allow.authenticated()]),

  Prescription: a
    .model({
      patientId: a.id().required(),
      patient: a.belongsTo("Patient", "patientId"),
      medication: a.string().required(),
      dosage: a.string().required(),
      frequency: a.string().required(),
      prescribedBy: a.string().required(),
      prescribedDate: a.date().required(),
      expiryDate: a.date(),
      status: a.enum(["Active", "Completed", "Cancelled"]),
      allergyChecked: a.boolean().default(false),
    })
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
