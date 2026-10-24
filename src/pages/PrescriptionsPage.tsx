// pages/PrescriptionsPage.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../amplify/data/resource";
import type { PatientListItem, Prescription, PrescriptionStatus } from "../types/clinical";
import { MOCK_PATIENTS, MOCK_PRESCRIPTIONS } from "../data/mock";
import {
  Badge, CardHeader, Th, Topbar, SearchBox, Modal, Field, EmptyState, StatCard,
} from "../components/ui";
import {
  cardStyle, inputStyle, primaryBtn, ghostBtn, formatDate, C, FONT,
} from "../components/theme";

const client = generateClient<Schema>();

const STATUS_STYLE: Record<PrescriptionStatus, { bg: string; fg: string }> = {
  Active: { bg: "#e8f4f0", fg: "#2a7d6a" },
  Completed: { bg: "#e8eefb", fg: "#3d54a6" },
  Cancelled: { bg: "#f1f1f1", fg: "#777" },
};

const FILTERS: Array<PrescriptionStatus | "All"> = ["All", "Active", "Completed", "Cancelled"];

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  // Patients' alert text, used for a simple allergy cross-check when prescribing.
  const [alerts, setAlerts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [usingMock, setUsingMock] = useState(false);
  const [filter, setFilter] = useState<PrescriptionStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formPatientId, setFormPatientId] = useState("");
  const [formMed, setFormMed] = useState("");

  const load = useCallback(async () => {
    try {
      const [pRes, rxRes] = await Promise.all([
        client.models.Patient.list(),
        client.models.Prescription.list(),
      ]);
      if (pRes.errors || !pRes.data.length) throw new Error("empty");
      setPatients(
        pRes.data.map((p) => ({
          id: p.id, firstName: p.firstName ?? "", lastName: p.lastName ?? "",
          gender: (p.gender ?? "M") as "M" | "F" | "Other", age: p.age ?? 0,
          emrNumber: `EMR-${p.id.slice(-4).toUpperCase()}`,
          lastVisit: p.lastVisit ?? "", physicianName: p.physicianName ?? "",
        }))
      );
      setAlerts(
        Object.fromEntries(pRes.data.filter((p) => p.hasAlert && p.alertMessage).map((p) => [p.id, p.alertMessage!]))
      );
      setPrescriptions(
        (rxRes.data ?? []).map((r) => ({
          id: r.id, patientId: r.patientId, medication: r.medication,
          dosage: r.dosage, frequency: r.frequency, prescribedBy: r.prescribedBy,
          prescribedDate: r.prescribedDate, expiryDate: r.expiryDate ?? undefined,
          status: (r.status ?? "Active") as PrescriptionStatus,
          allergyChecked: r.allergyChecked ?? false,
        }))
      );
      setUsingMock(false);
    } catch {
      setPatients(MOCK_PATIENTS);
      setPrescriptions(MOCK_PRESCRIPTIONS);
      setAlerts({ "1": "Patient has a documented severe allergy to Penicillin." });
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const patientName = (id: string) => {
    const p = patients.find((x) => x.id === id);
    return p ? `${p.firstName} ${p.lastName}` : "Unknown patient";
  };

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return prescriptions
      .filter((r) => filter === "All" || r.status === filter)
      .filter((r) =>
        r.medication.toLowerCase().includes(q) ||
        patientName(r.patientId).toLowerCase().includes(q) ||
        r.prescribedBy.toLowerCase().includes(q))
      .sort((a, b) => b.prescribedDate.localeCompare(a.prescribedDate));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prescriptions, patients, filter, search]);

  const setStatus = async (rx: Prescription, status: PrescriptionStatus) => {
    // Optimistic update; persist when connected to Amplify.
    setPrescriptions((list) => list.map((r) => (r.id === rx.id ? { ...r, status } : r)));
    if (usingMock) return;
    try {
      await client.models.Prescription.update({ id: rx.id, status });
    } catch (err) {
      console.error("Update prescription error:", err);
      load();
    }
  };

  // Simple allergy cross-check against the selected patient's alert text.
  const allergyWarning =
    formPatientId && formMed.trim() && alerts[formPatientId]?.toLowerCase().includes(formMed.trim().toLowerCase())
      ? alerts[formPatientId]
      : null;

  const closeForm = () => { setShowForm(false); setFormPatientId(""); setFormMed(""); };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const input = {
      patientId: String(fd.get("patientId")),
      medication: String(fd.get("medication")),
      dosage: String(fd.get("dosage")),
      frequency: String(fd.get("frequency")),
      prescribedBy: String(fd.get("prescribedBy")),
      prescribedDate: new Date().toISOString().slice(0, 10),
      expiryDate: String(fd.get("expiryDate") || "") || undefined,
      status: "Active" as const,
      allergyChecked: fd.get("allergyChecked") === "on",
    };
    try {
      if (usingMock) {
        setPrescriptions((l) => [{ id: `rx${Date.now()}`, ...input }, ...l]);
      } else {
        await client.models.Prescription.create(input);
        await load();
      }
      closeForm();
    } catch (err) {
      console.error("Create prescription error:", err);
    }
  };

  const active = prescriptions.filter((r) => r.status === "Active");
  const cols = "1.6fr 1.6fr 1.3fr 1.2fr 1fr 1fr 150px";

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Topbar title="E-Prescriptions" subtitle="Issue, track and manage patient prescriptions">
        <SearchBox value={search} onChange={setSearch} placeholder="Search medication or patient" />
        <button style={primaryBtn} onClick={() => setShowForm(true)}>
          <span style={{ fontSize: 18 }}>+</span> New Prescription
        </button>
      </Topbar>

      <div style={{ flex: 1, overflow: "hidden", padding: "24px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          <StatCard icon="💊" label="Active" value={active.length} />
          <StatCard
            icon="⚠️" label="Awaiting Allergy Check"
            value={active.filter((r) => !r.allergyChecked).length}
            tone={active.some((r) => !r.allergyChecked) ? "warn" : "default"}
          />
          <StatCard icon="✅" label="Completed" value={prescriptions.filter((r) => r.status === "Completed").length} />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          {FILTERS.map((f) => {
            const on = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 16px", borderRadius: 10, cursor: "pointer",
                fontFamily: FONT, fontSize: 13, fontWeight: 700,
                border: `1px solid ${on ? C.accent : C.borderInput}`,
                background: on ? C.accentBg : "#fff",
                color: on ? C.accentText : C.textMuted,
              }}>{f}</button>
            );
          })}
        </div>

        <div style={{ ...cardStyle, flex: 1, display: "flex", flexDirection: "column" }}>
          <CardHeader title="Prescriptions" />
          <div style={{ flex: 1, overflowY: "auto" }}>
            <div style={{
              display: "grid", gridTemplateColumns: cols, padding: "0 22px",
              borderBottom: `1px solid ${C.borderSoft}`, background: "#fafcfb",
            }}>
              <Th>Medication</Th><Th>Patient</Th><Th>Dosage</Th><Th>Prescribed</Th><Th>Allergy</Th><Th>Status</Th><Th />
            </div>

            {loading ? (
              <EmptyState message="Loading prescriptions…" />
            ) : visible.length === 0 ? (
              <EmptyState message="No prescriptions match this view." />
            ) : (
              visible.map((r) => {
                const st = STATUS_STYLE[r.status];
                return (
                  <div key={r.id} style={{
                    display: "grid", gridTemplateColumns: cols, padding: "0 22px",
                    alignItems: "center", borderBottom: "1px solid #f5f8f7",
                  }}>
                    <div style={{ padding: "14px 0" }}>
                      <div style={{ fontWeight: 700, fontSize: 13.5, color: C.text }}>{r.medication}</div>
                      <div style={{ fontSize: 11.5, color: C.textFaint }}>{r.frequency}</div>
                    </div>
                    <div style={{ fontSize: 13, color: C.textBody }}>{patientName(r.patientId)}</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>{r.dosage}</div>
                    <div>
                      <div style={{ fontSize: 13, color: C.textMuted }}>{formatDate(r.prescribedDate)}</div>
                      <div style={{ fontSize: 11.5, color: C.textFaint }}>{r.prescribedBy}</div>
                    </div>
                    <div>
                      {r.allergyChecked
                        ? <Badge label="Checked" />
                        : <Badge label="Not checked" color="#ffe1d6" text="#c44a1a" />}
                    </div>
                    <div><Badge label={r.status} color={st.bg} text={st.fg} /></div>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      {r.status === "Active" && (
                        <>
                          <button style={ghostBtn} onClick={() => setStatus(r, "Completed")}>Complete</button>
                          <button style={ghostBtn} onClick={() => setStatus(r, "Cancelled")}>Cancel</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <Modal title="New Prescription" onClose={closeForm}>
          <form onSubmit={handleCreate}>
            <Field label="Patient">
              <select
                name="patientId" required style={inputStyle}
                value={formPatientId} onChange={(e) => setFormPatientId(e.target.value)}
              >
                <option value="" disabled>Select a patient…</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.emrNumber})</option>
                ))}
              </select>
            </Field>
            <Field label="Medication">
              <input name="medication" required style={inputStyle} value={formMed} onChange={(e) => setFormMed(e.target.value)} />
            </Field>
            {allergyWarning && (
              <div style={{
                background: C.warnBg, border: `1px solid ${C.warnBorder}`, color: "#7a3a1a",
                borderRadius: 10, padding: "10px 12px", fontSize: 12.5, marginBottom: 14, lineHeight: 1.5,
              }}>
                <strong style={{ color: C.warnText }}>Allergy alert:</strong> {allergyWarning}
              </div>
            )}
            <Field label="Dosage"><input name="dosage" required placeholder="e.g. 500 mg" style={inputStyle} /></Field>
            <Field label="Frequency"><input name="frequency" required placeholder="e.g. Twice daily" style={inputStyle} /></Field>
            <Field label="Prescribed By"><input name="prescribedBy" required defaultValue="Dr. Sterling" style={inputStyle} /></Field>
            <Field label="Expiry Date (optional)"><input name="expiryDate" type="date" style={inputStyle} /></Field>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: C.textBody, marginBottom: 6 }}>
              <input name="allergyChecked" type="checkbox" /> I have reviewed this patient's allergies
            </label>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 20 }}>
              <button type="button" style={{ ...ghostBtn, padding: "9px 20px", fontSize: 13 }} onClick={closeForm}>Cancel</button>
              <button type="submit" style={{ ...primaryBtn, padding: "9px 22px", boxShadow: "none" }}>Issue Prescription</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
