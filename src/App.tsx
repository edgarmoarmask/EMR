// pages/ClinicalRecordsPage.tsx
import { useState, useEffect, useCallback } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";
import type {
  Patient,
  ClinicalRecord,
  PatientListItem,
  VisitType,
} from "./types/clinical";

// ─── Amplify client ────────────────────────────────────────────────────────────
const client = generateClient<Schema>();

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getInitials(first: string, last: string) {
  return `${first[0]}${last[0]}`.toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
    time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
  };
}

const AVATAR_COLORS: Record<string, string> = {
  EA: "#4f9d8f",
  MK: "#6b7fc4",
  SJ: "#c46b9a",
  RB: "#c49a6b",
};

function avatarBg(initials: string) {
  return AVATAR_COLORS[initials] ?? "#6b8fc4";
}

const VISIT_ICON: Record<VisitType, string> = {
  Consultation: "🩺",
  LabResults: "🔬",
  FollowUp: "🔄",
  Emergency: "🚨",
};

// ─── Mock seed data (used when Amplify returns empty) ──────────────────────────
const MOCK_PATIENTS: PatientListItem[] = [
  { id: "1", firstName: "Eleanor", lastName: "Abbott", gender: "F", age: 34, emrNumber: "EMR-2940", lastVisit: "2023-10-12", physicianName: "Dr. Sterling" },
  { id: "2", firstName: "Marcus", lastName: "Knight", gender: "M", age: 52, emrNumber: "EMR-3102", lastVisit: "2023-11-05", physicianName: "Dr. Sterling" },
  { id: "3", firstName: "Sarah", lastName: "Jenkins", gender: "F", age: 29, emrNumber: "EMR-8841", lastVisit: "2023-11-02", physicianName: "Dr. Varma" },
  { id: "4", firstName: "Robert", lastName: "Benson", gender: "M", age: 61, emrNumber: "EMR-1029", lastVisit: "2023-10-29", physicianName: "Dr. Sterling" },
];

const MOCK_SELECTED: Patient = {
  id: "1", firstName: "Eleanor", lastName: "Abbott",
  gender: "F", age: 34, emrNumber: "EMR-2940",
  bloodGroup: "O Positive",
  recentDiagnosis: "Acute Bronchitis",
  chronicConditions: ["Type 2 Diabetes", "Hypertension", "Seasonal Asthma"],
  physicianName: "Dr. Sterling",
  lastVisit: "2023-10-12",
  hasAlert: true,
  alertMessage: "Patient has a documented severe allergy to Penicillin. Automated script checking is active for all new e-prescriptions.",
};

const MOCK_RECORDS: ClinicalRecord[] = [
  {
    id: "r1", patientId: "1", emrNumber: "EMR-2940",
    visitDate: "2023-10-12T14:30:00",
    physicianName: "Dr. Sterling",
    visitType: "Consultation",
    notes: "Follow-up on respiratory symptoms with Dr. Sterling",
  },
  {
    id: "r2", patientId: "1", emrNumber: "EMR-2940",
    visitDate: "2023-09-28T09:15:00",
    physicianName: "Dr. Sterling",
    visitType: "LabResults",
    notes: "Comprehensive Metabolic Panel (CMP)",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function Avatar({ initials, size = 40 }: { initials: string; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: avatarBg(initials),
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: 700,
        fontSize: size * 0.36,
        flexShrink: 0,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

function Badge({ label, color = "#e8f4f0", text = "#2a7d6a" }: { label: string; color?: string; text?: string }) {
  return (
    <span style={{
      background: color, color: text,
      fontSize: 11, fontWeight: 600,
      padding: "3px 10px", borderRadius: 20,
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.01em",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

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

export default function App() {
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showNewRecord, setShowNewRecord] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState(false);

  // ── Fetch patient list ──────────────────────────────────────────────────────
  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const { data, errors } = await client.models.Patient.list();
      if (errors || !data.length) {
        setPatients(MOCK_PATIENTS);
        setSelectedPatient(MOCK_SELECTED);
        setRecords(MOCK_RECORDS);
      } else {
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
      setPatients(MOCK_PATIENTS);
      setSelectedPatient(MOCK_SELECTED);
      setRecords(MOCK_RECORDS);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Fetch single patient + records ─────────────────────────────────────────
  const handleSelectPatient = async (id: string) => {
    try {
      const { data: p } = await client.models.Patient.get({ id });
      if (!p) return;

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
      const mock = MOCK_PATIENTS.find((p) => p.id === id);
      if (mock) {
        setSelectedPatient({ ...MOCK_SELECTED, ...mock });
        setRecords(MOCK_RECORDS);
      }
    }
  };

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
    page: {
      display: "flex", height: "100vh", background: "#f5f8f7",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      overflow: "hidden",
    } as React.CSSProperties,

    sidebar: {
      width: 240, background: "#fff",
      borderRight: "1px solid #e8eeec",
      display: "flex", flexDirection: "column" as const,
      padding: "0",
    },

    sidebarBrand: {
      padding: "20px 20px 18px",
      borderBottom: "1px solid #f0f5f3",
      display: "flex", alignItems: "center", gap: 10,
    },

    brandIcon: {
      width: 36, height: 36, borderRadius: 10,
      background: "linear-gradient(135deg, #2dc9a8, #1a9e84)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 18,
    },

    brandText: {
      fontWeight: 800, fontSize: 14, color: "#1a3a34", lineHeight: 1.2,
    },

    brandSub: { fontSize: 11, color: "#7fa89e", fontWeight: 500 },

    nav: { padding: "16px 0", flex: 1 },

    navItem: (active: boolean): React.CSSProperties => ({
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 20px", cursor: "pointer",
      background: active ? "#e8f5f1" : "transparent",
      color: active ? "#1a7a64" : "#5a7a74",
      fontWeight: active ? 700 : 500,
      fontSize: 13.5, borderLeft: active ? "3px solid #2dc9a8" : "3px solid transparent",
      transition: "all 0.15s",
      userSelect: "none",
    }),

    main: {
      flex: 1, display: "flex", flexDirection: "column" as const,
      overflow: "hidden",
    },

    topbar: {
      background: "#fff", borderBottom: "1px solid #e8eeec",
      padding: "14px 28px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
    },

    searchBox: {
      display: "flex", alignItems: "center", gap: 8,
      background: "#f0f5f3", borderRadius: 8,
      padding: "7px 14px", border: "1px solid #dce9e5",
    },

    searchInput: {
      border: "none", background: "transparent", outline: "none",
      fontSize: 13, color: "#2a4a44", width: 200,
      fontFamily: "'DM Sans', sans-serif",
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

  const navItems = [
    { label: "Dashboard", icon: "⊞", id: "dashboard" },
    { label: "Patient Queue", icon: "👤", id: "queue" },
    { label: "Clinical Records", icon: "📋", id: "clinical" },
    { label: "E-Prescriptions", icon: "💊", id: "rx" },
    { label: "Analytics", icon: "📊", id: "analytics" },
  ];

  return (
    <>
      {/* Google Font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #c5e0da; border-radius: 4px; }
      `}</style>

      <div style={s.page}>
        {/* ── Sidebar ─────────────────────────────────── */}
        <div style={s.sidebar}>
          <div style={s.sidebarBrand}>
            <div style={s.brandIcon}>🏥</div>
            <div>
              <div style={s.brandText}>City General</div>
              <div style={s.brandSub}>Clinical Portal</div>
            </div>
          </div>

          <nav style={s.nav}>
            {navItems.map((n) => (
              <div key={n.id} style={s.navItem(n.id === "clinical")}>
                <span style={{ fontSize: 16 }}>{n.icon}</span>
                {n.label}
              </div>
            ))}
          </nav>

          <div style={{ borderTop: "1px solid #f0f5f3", padding: "16px 20px" }}>
            <div style={s.navItem(false)}>
              <span style={{ fontSize: 16 }}>💬</span>Support
            </div>
            <div style={s.navItem(false)}>
              <span style={{ fontSize: 16 }}>🚪</span>Logout
            </div>
          </div>
        </div>

        {/* ── Main area ───────────────────────────────── */}
        <div style={s.main}>
          {/* Topbar */}
          <div style={s.topbar}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 22, color: "#1a3a34" }}>Clinical Records</div>
              <div style={{ fontSize: 13, color: "#7fa89e", marginTop: 2 }}>
                Manage and review patient electronic health directories
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={s.searchBox}>
                <span style={{ color: "#7fa89e", fontSize: 15 }}>🔍</span>
                <input
                  style={s.searchInput}
                  placeholder="Search records (Ctrl+K)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button style={s.newRecordBtn} onClick={() => setNewPatientForm(true)}>
                <span style={{ fontSize: 18 }}>+</span>
                Create New Record
              </button>

              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #2dc9a8, #1a9e84)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", fontWeight: 700, fontSize: 14,
              }}>
                A
              </div>
            </div>
          </div>

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
                <span>Showing {filtered.length} of 1,240 records</span>
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
      </div>

      {/* ── New Patient Modal ─────────────────────────────────────────────────── */}
      {newPatientForm && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100,
        }}>
          <div style={{
            background: "#fff", borderRadius: 18,
            padding: 32, width: 420,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
          }}>
            <div style={{ fontWeight: 800, fontSize: 18, color: "#1a3a34", marginBottom: 20 }}>
              New Patient Record
            </div>
            <form onSubmit={handleCreatePatient}>
              {[
                { name: "firstName", label: "First Name", type: "text" },
                { name: "lastName", label: "Last Name", type: "text" },
                { name: "age", label: "Age", type: "number" },
                { name: "physician", label: "Physician", type: "text" },
              ].map((f) => (
                <div key={f.name} style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#5a7a74", display: "block", marginBottom: 5 }}>
                    {f.label}
                  </label>
                  <input
                    name={f.name} type={f.type} required
                    style={{
                      width: "100%", padding: "9px 12px",
                      border: "1px solid #dce9e5", borderRadius: 9,
                      fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                      outline: "none", color: "#1a3a34",
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#5a7a74", display: "block", marginBottom: 5 }}>
                  Gender
                </label>
                <select name="gender" style={{
                  width: "100%", padding: "9px 12px",
                  border: "1px solid #dce9e5", borderRadius: 9,
                  fontSize: 13, fontFamily: "'DM Sans', sans-serif",
                  outline: "none", color: "#1a3a34", background: "#fff",
                }}>
                  <option value="F">Female</option>
                  <option value="M">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setNewPatientForm(false)}
                  style={{
                    background: "none", border: "1px solid #dce9e5",
                    borderRadius: 9, padding: "9px 20px",
                    cursor: "pointer", fontSize: 13, color: "#5a7a74",
                    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                  }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  background: "linear-gradient(135deg, #2dc9a8, #1a9e84)",
                  color: "#fff", border: "none",
                  borderRadius: 9, padding: "9px 22px",
                  cursor: "pointer", fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 700,
                }}>
                  Create Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
