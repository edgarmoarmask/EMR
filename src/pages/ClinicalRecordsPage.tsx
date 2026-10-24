// pages/ClinicalRecordsPage.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import type {
  Patient,
  ClinicalRecord,
  PatientListItem,
  VisitType,
} from "../types/clinical";
import { MOCK_PATIENTS } from "../data/mock";
import { getMockPatient, getMockRecords } from "../data/mockClinical";
import {
  Avatar, Topbar, SearchBox, Modal, Field,
} from "../components/ui";
import {
  getInitials, formatDate, inputStyle, primaryBtn, FONT,
} from "../components/theme";

// ─── Amplify client ────────────────────────────────────────────────────────────
const client = generateClient<Schema>();

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

const VISIT_ICON: Record<VisitType, string> = {
  Consultation: "🩺",
  LabResults: "🔬",
  FollowUp: "🔄",
  Emergency: "🚨",
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function Chip({ label }: { label: string }) {
  return (
    <span style={{
      background: "#f0f7f5", color: "#1d6b5e",
      border: "1px solid #c5e0da",
      fontSize: 11, fontWeight: 600,
      padding: "4px 10px", borderRadius: 20,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {label}
    </span>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ClinicalRecordsPage() {
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newPatientForm, setNewPatientForm] = useState(false);

  const usingMock = useRef(false);  // true when the patient list came from mock data
  const selectSeq = useRef(0);      // ignores stale responses from rapid clicks

  // ── Load mock detail + records for one patient ──────────────────────────────
  const loadMockPatient = useCallback((id: string) => {
    setSelectedPatient(getMockPatient(id));
    setRecords(getMockRecords(id));
  }, []);

  // ── Fetch single patient + records ─────────────────────────────────────────
  const handleSelectPatient = useCallback(async (id: string) => {
    // Mock mode: no point calling Amplify, just show this patient's mock data.
    if (usingMock.current) {
      loadMockPatient(id);
      return;
    }

    const seq = ++selectSeq.current;
    try {
      const { data: p } = await client.models.Patient.get({ id });
      if (seq !== selectSeq.current) return;
      if (!p) { loadMockPatient(id); return; }

      const mapped: Patient = {
        id: p.id,
        firstName: p.firstName ?? "",
        lastName: p.lastName ?? "",
        gender: (p.gender ?? "M") as "M" | "F" | "Other",
        age: p.age ?? 0,
        emrNumber: `EMR-${p.id.slice(-4).toUpperCase()}`,
        bloodGroup: p.bloodGroup as Patient["bloodGroup"],
        recentDiagnosis: p.recentDiagnosis ?? undefined,
        chronicConditions: (p.chronicConditions ?? []).filter(Boolean) as string[],
        physicianName: p.physicianName ?? undefined,
        lastVisit: p.lastVisit ?? undefined,
        hasAlert: p.hasAlert ?? false,
        alertMessage: p.alertMessage ?? undefined,
      };
      setSelectedPatient(mapped);

      const { data: recs } = await client.models.ClinicalRecord.list({
        filter: { patientId: { eq: id } },
      });
      if (seq !== selectSeq.current) return;
      setRecords(
        (recs ?? []).map((r) => ({
          id: r.id,
          patientId: r.patientId,
          emrNumber: r.emrNumber,
          visitDate: r.visitDate,
          physicianName: r.physicianName,
          visitType: r.visitType as VisitType,
          notes: r.notes ?? undefined,
        }))
      );
    } catch {
      if (seq === selectSeq.current) loadMockPatient(id);
    }
  }, [loadMockPatient]);

  // ── Fetch patient list ──────────────────────────────────────────────────────
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    const useMock = () => {
      usingMock.current = true;
      setPatients(MOCK_PATIENTS);
      loadMockPatient(MOCK_PATIENTS[0].id);
    };
    try {
      const { data, errors } = await client.models.Patient.list();
      if (errors || !data.length) {
        useMock();
      } else {
        usingMock.current = false;
        const list: PatientListItem[] = data.map((p) => ({
          id: p.id,
          firstName: p.firstName ?? "",
          lastName: p.lastName ?? "",
          gender: (p.gender ?? "M") as "M" | "F" | "Other",
          age: p.age ?? 0,
          emrNumber: `EMR-${p.id.slice(-4).toUpperCase()}`,
          lastVisit: p.lastVisit ?? new Date().toISOString(),
          physicianName: p.physicianName ?? "",
        }));
        setPatients(list);
        if (list.length) handleSelectPatient(list[0].id);
      }
    } catch {
      useMock();
    } finally {
      setLoading(false);
    }
  }, [handleSelectPatient, loadMockPatient]);

  // ── Create new patient ──────────────────────────────────────────────────────
  const handleCreatePatient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    try {
      await client.models.Patient.create({
        firstName: fd.get("firstName") as string,
        lastName: fd.get("lastName") as string,
        gender: fd.get("gender") as "M" | "F" | "Other",
        age: Number(fd.get("age")),
        physicianName: fd.get("physician") as string,
      });
      setNewPatientForm(false);
      fetchPatients();
    } catch (err) {
      console.error("Create patient error:", err);
    }
  };

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      p.emrNumber.toLowerCase().includes(q) ||
      p.physicianName.toLowerCase().includes(q)
    );
  });

  // ─── Styles ──────────────────────────────────────────────────────────────────
  const s = {
    main: {
      flex: 1, display: "flex", flexDirection: "column" as const,
      overflow: "hidden",
    },

    content: {
      flex: 1, display: "flex", gap: 20,
      padding: "24px 28px", overflow: "hidden",
    },

    tableCard: {
      flex: "1 1 55%", background: "#fff",
      borderRadius: 16, border: "1px solid #e0ebe8",
      display: "flex", flexDirection: "column" as const,
      overflow: "hidden",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    },

    tableHeader: {
      padding: "18px 22px 14px",
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #f0f5f3",
    },

    tableTitle: { fontWeight: 800, fontSize: 16, color: "#1a3a34" },

    table: { flex: 1, overflowY: "auto" as const },

    thead: {
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr 32px",
      padding: "0 22px",
      borderBottom: "1px solid #f0f5f3",
      background: "#fafcfb",
    },

    th: {
      padding: "10px 0", fontSize: 11,
      fontWeight: 700, color: "#7fa89e",
      letterSpacing: "0.06em", textTransform: "uppercase" as const,
    },

    trow: (active: boolean): React.CSSProperties => ({
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr 32px",
      padding: "0 22px",
      alignItems: "center",
      borderBottom: "1px solid #f5f8f7",
      cursor: "pointer",
      background: active ? "#edf7f4" : "transparent",
      transition: "background 0.12s",
    }),

    td: { padding: "14px 0", fontSize: 13, color: "#2a4a44" },

    patientName: { fontWeight: 700, fontSize: 13.5, color: "#1a3a34" },
    patientSub: { fontSize: 11.5, color: "#7fa89e", marginTop: 1 },

    detailCard: {
      flex: "1 1 40%", background: "#fff",
      borderRadius: 16, border: "1px solid #e0ebe8",
      display: "flex", flexDirection: "column" as const,
      overflow: "hidden",
      boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
    },

    detailHeader: {
      padding: "20px 22px 16px",
      borderBottom: "1px solid #f0f5f3",
      display: "flex", alignItems: "flex-start",
      justifyContent: "space-between",
    },

    detailBody: {
      flex: 1, overflowY: "auto" as const, padding: "18px 22px",
    },

    infoGrid: {
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18,
    },

    infoBox: {
      background: "#f5faf8", borderRadius: 10,
      padding: "12px 14px", border: "1px solid #e0ebe8",
    },

    infoLabel: { fontSize: 11, color: "#7fa89e", fontWeight: 600, marginBottom: 4 },
    infoValue: { fontSize: 14, fontWeight: 800, color: "#1a3a34" },

    sectionTitle: {
      fontSize: 13, fontWeight: 700, color: "#2a4a44",
      marginBottom: 10, display: "flex", alignItems: "center", gap: 6,
    },

    activityItem: {
      display: "flex", gap: 12, padding: "12px 0",
      borderBottom: "1px solid #f0f5f3",
    },

    activityDot: {
      width: 8, height: 8, borderRadius: "50%",
      background: "#2dc9a8", flexShrink: 0, marginTop: 5,
    },

    alertBox: {
      background: "#fff5f0", border: "1px solid #ffd6c0",
      borderRadius: 12, padding: "14px 16px",
      margin: "0 22px 18px",
    },

    alertTitle: {
      display: "flex", alignItems: "center", gap: 8,
      fontWeight: 700, color: "#c44a1a", fontSize: 13.5, marginBottom: 6,
    },

    ctaBtn: {
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      background: "#f0f5f3", border: "1px solid #dce9e5",
      borderRadius: 10, padding: "11px 16px",
      color: "#2a4a44", fontWeight: 600, fontSize: 13,
      cursor: "pointer", margin: "0 22px 18px",
      fontFamily: "'DM Sans', sans-serif",
      transition: "background 0.15s",
    },

    newRecordBtn: {
      background: "linear-gradient(135deg, #2dc9a8, #1a9e84)",
      color: "#fff", border: "none",
      borderRadius: 10, padding: "9px 18px",
      fontWeight: 700, fontSize: 13, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 6,
      fontFamily: "'DM Sans', sans-serif",
      boxShadow: "0 2px 8px rgba(45,201,168,0.25)",
    },
  };

  return (
    <>
      <div style={s.main}>
        <Topbar
          title="Clinical Records"
          subtitle="Manage and review patient electronic health directories"
        >
          <SearchBox value={search} onChange={setSearch} placeholder="Search records (Ctrl+K)" />
          <button style={primaryBtn} onClick={() => setNewPatientForm(true)}>
            <span style={{ fontSize: 18 }}>+</span>
            Create New Record
          </button>
        </Topbar>

          {/* Content */}
          <div style={s.content}>
            {/* ── Patient Directory Table ── */}
            <div style={s.tableCard}>
              <div style={s.tableHeader}>
                <span style={s.tableTitle}>Patient Directory</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button style={{ background: "none", border: "1px solid #dce9e5", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 14 }}>⊞</button>
                  <button style={{ background: "none", border: "1px solid #dce9e5", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: 14 }}>≡</button>
                </div>
              </div>

              <div style={s.table}>
                <div style={s.thead}>
                  <div style={s.th}>Patient Name</div>
                  <div style={s.th}>ID</div>
                  <div style={s.th}>Last Visit</div>
                  <div style={s.th}>Physician</div>
                  <div style={s.th}></div>
                </div>

                {loading ? (
                  <div style={{ padding: 32, textAlign: "center", color: "#7fa89e", fontSize: 14 }}>
                    Loading records…
                  </div>
                ) : (
                  filtered.map((p) => {
                    const initials = getInitials(p.firstName, p.lastName);
                    const active = selectedPatient?.id === p.id;
                    return (
                      <div
                        key={p.id}
                        style={s.trow(active)}
                        onClick={() => handleSelectPatient(p.id)}
                      >
                        <div style={{ ...s.td, display: "flex", alignItems: "center", gap: 10 }}>
                          <Avatar initials={initials} size={36} />
                          <div>
                            <div style={s.patientName}>{p.firstName} {p.lastName}</div>
                            <div style={s.patientSub}>{p.gender}, {p.age} yrs</div>
                          </div>
                        </div>
                        <div style={{ ...s.td, color: "#6a9e94", fontSize: 12, fontWeight: 600 }}>
                          #{p.emrNumber}
                        </div>
                        <div style={{ ...s.td, color: "#5a7a74" }}>
                          {formatDate(p.lastVisit)}
                        </div>
                        <div style={{ ...s.td, color: "#5a7a74" }}>
                          {p.physicianName}
                        </div>
                        <div style={{ ...s.td, color: "#2dc9a8", fontWeight: 700, textAlign: "center" }}>›</div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{
                padding: "12px 22px",
                borderTop: "1px solid #f0f5f3",
                display: "flex", justifyContent: "space-between",
                fontSize: 12, color: "#7fa89e",
                alignItems: "center",
              }}>
                <span>Showing {filtered.length} of {patients.length} records</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ background: "none", border: "1px solid #dce9e5", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 12, color: "#5a7a74" }}>Previous</button>
                  <button style={{ background: "none", border: "1px solid #dce9e5", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontSize: 12, color: "#5a7a74" }}>Next</button>
                </div>
              </div>
            </div>

            {/* ── Patient Detail Panel ── */}
            {selectedPatient && (
              <div style={s.detailCard}>
                {/* Header */}
                <div style={s.detailHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ position: "relative" }}>
                      <Avatar initials={getInitials(selectedPatient.firstName, selectedPatient.lastName)} size={52} />
                      <div style={{
                        position: "absolute", bottom: 0, right: 0,
                        width: 14, height: 14, borderRadius: "50%",
                        background: "#2dc9a8", border: "2px solid #fff",
                      }} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 17, color: "#1a3a34" }}>
                        {selectedPatient.firstName} {selectedPatient.lastName}
                      </div>
                      <div style={{ fontSize: 12, color: "#7fa89e", marginTop: 2 }}>
                        Patient File: {selectedPatient.emrNumber}
                      </div>
                    </div>
                  </div>
                  <button style={{
                    background: "none", border: "1px solid #dce9e5",
                    borderRadius: 8, padding: "6px 10px",
                    cursor: "pointer", fontSize: 15, color: "#5a7a74",
                  }}>↗</button>
                </div>

                <div style={s.detailBody}>
                  {/* Info grid */}
                  <div style={s.infoGrid}>
                    <div style={s.infoBox}>
                      <div style={s.infoLabel}>Recent Diagnosis</div>
                      <div style={{ ...s.infoValue, color: "#1a7a64" }}>
                        {selectedPatient.recentDiagnosis ?? "—"}
                      </div>
                    </div>
                    <div style={s.infoBox}>
                      <div style={s.infoLabel}>Blood Group</div>
                      <div style={{ ...s.infoValue, color: "#1a3a34" }}>
                        {selectedPatient.bloodGroup ?? "—"}
                      </div>
                    </div>
                  </div>

                  {/* Chronic conditions */}
                  {(selectedPatient.chronicConditions?.length ?? 0) > 0 && (
                    <div style={{ marginBottom: 18 }}>
                      <div style={s.sectionTitle}>
                        <span>⚠</span> Chronic Conditions
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {selectedPatient.chronicConditions!.map((c) => (
                          <Chip key={c} label={c} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Activity */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={s.sectionTitle}>Recent Activity</div>
                    {records.length === 0 && (
                      <div style={{ fontSize: 12.5, color: "#7fa89e", padding: "8px 0" }}>
                        No recent activity recorded.
                      </div>
                    )}
                    {records.map((r) => {
                      const dt = formatDateTime(r.visitDate);
                      return (
                        <div key={r.id} style={s.activityItem}>
                          <div style={s.activityDot} />
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a3a34" }}>
                              {VISIT_ICON[r.visitType] ?? "📄"}{" "}
                              {r.visitType === "LabResults" ? "Lab Results Uploaded" : r.visitType}
                            </div>
                            <div style={{ fontSize: 12, color: "#5a7a74", marginTop: 2 }}>
                              {r.notes}
                            </div>
                            <div style={{ fontSize: 11, color: "#7fa89e", marginTop: 3 }}>
                              {dt.date} • {dt.time}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Export button */}
                <button style={s.ctaBtn}>
                  🖨 Export Medical Summary
                </button>

                {/* Alert */}
                {selectedPatient.hasAlert && selectedPatient.alertMessage && (
                  <div style={s.alertBox}>
                    <div style={s.alertTitle}>
                      <span style={{ fontSize: 18 }}>✳</span> Clinical Alert
                    </div>
                    <div style={{ fontSize: 12.5, color: "#7a3a1a", lineHeight: 1.55 }}>
                      {selectedPatient.alertMessage}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
      </div>

      {/* ── New Patient Modal ─────────────────────────────────────────────────── */}
      {newPatientForm && (
        <Modal title="New Patient Record" onClose={() => setNewPatientForm(false)}>
          <form onSubmit={handleCreatePatient}>
            {[
              { name: "firstName", label: "First Name", type: "text" },
              { name: "lastName", label: "Last Name", type: "text" },
              { name: "age", label: "Age", type: "number" },
              { name: "physician", label: "Physician", type: "text" },
            ].map((f) => (
              <Field key={f.name} label={f.label}>
                <input name={f.name} type={f.type} required style={inputStyle} />
              </Field>
            ))}

            <Field label="Gender">
              <select name="gender" style={inputStyle}>
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="Other">Other</option>
              </select>
            </Field>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button type="button" onClick={() => setNewPatientForm(false)}
                style={{
                  background: "none", border: "1px solid #dce9e5",
                  borderRadius: 9, padding: "9px 20px",
                  cursor: "pointer", fontSize: 13, color: "#5a7a74",
                  fontFamily: FONT, fontWeight: 600,
                }}>
                Cancel
              </button>
              <button type="submit" style={{ ...primaryBtn, padding: "9px 22px", boxShadow: "none" }}>
                Create Record
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
