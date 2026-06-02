import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Plus, Check, FileText, FlaskConical } from "lucide-react";
import { fetchConsultationsPatiente } from "@/services/gynecologueService";

export default function Prescriptions({ prescriptions = [], patients = [], isDoctor = false, onSavePrescription }) {
  const [patientId, setPatientId] = useState(patients?.[0]?.id ?? "");
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [reason, setReason] = useState("Suivi de grossesse");
  const [newMedication, setNewMedication] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [medications, setMedications] = useState([]);
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const selectedPatient = patients.find((patient) => patient.id === patientId) || null;
  const selectedConsultation = consultations.find((consultation) => consultation.id === selectedConsultationId) || null;

  useEffect(() => {
    if (!patientId) {
      setConsultations([]);
      setSelectedConsultationId(null);
      return;
    }

    fetchConsultationsPatiente(patientId)
      .then((data) => {
        setConsultations(data || []);
        setSelectedConsultationId(data?.[0]?.id ?? null);
      })
      .catch(() => {
        setConsultations([]);
        setSelectedConsultationId(null);
      });
  }, [patientId]);

  const medicationSummary = useMemo(() => {
    return medications.map((item) => `${item.name} (${item.dosage})`).join(" • ");
  }, [medications]);

  const handleAddMedication = () => {
    if (!newMedication.trim() || !newDosage.trim()) return;
    setMedications([...medications, { name: newMedication.trim(), dosage: newDosage.trim() }]);
    setNewMedication("");
    setNewDosage("");
  };

  const handleRemoveMedication = (index) => {
    setMedications(medications.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedPatient || !selectedConsultationId || medications.length === 0) {
      setMessage("Veuillez sélectionner une patiente, une consultation et ajouter au moins une ligne d'ordonnance.");
      return;
    }

    if (!onSavePrescription) {
      setMessage("Action non supportée dans ce contexte.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        patientName: selectedPatient.name,
        motif: reason,
        medicaments: medications.map((item) => `${item.name} - ${item.dosage}`).join(", "),
        date: new Date().toISOString(),
      };

      await onSavePrescription(selectedConsultationId, payload);
      setMessage("Ordonnance enregistrée avec succès.");
      setMedications([]);
      setReason("Suivi de grossesse");
    } catch  {
      setMessage("Impossible d'enregistrer l'ordonnance. Veuillez réessayer.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {isDoctor && (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 text-rose-600 mb-5">
              <FlaskConical className="h-5 w-5" />
              <div>
                <h3 className="text-xl font-black text-gray-950">Rédacteur d'ordonnance</h3>
                <p className="text-sm text-gray-500">Créez une ordonnance comme un examen clinique, avec un seul flux de saisie.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm">
                  <span className="block text-gray-500 uppercase tracking-[0.2em] font-black">Patiente</span>
                  <select
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                  >
                    <option value="">Sélectionnez une patiente</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm">
                  <span className="block text-gray-500 uppercase tracking-[0.2em] font-black">Consultation</span>
                  <select
                    value={selectedConsultationId || ""}
                    onChange={(e) => setSelectedConsultationId(e.target.value)}
                    disabled={!consultations.length}
                    className="w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <option value="">Sélectionnez une consultation</option>
                    {consultations.map((consultation) => (
                      <option key={consultation.id} value={consultation.id}>
                        {consultation.compteRendu || consultation.createdAt || consultation.id}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm">
                    <span className="block text-gray-500 uppercase tracking-[0.2em] font-black">Ligne d'ordonnance</span>
                    <input
                      value={newMedication}
                      onChange={(e) => setNewMedication(e.target.value)}
                      placeholder="Ex : Amoxicilline 500mg"
                      className="w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                    />
                  </label>
                  <label className="space-y-2 text-sm">
                    <span className="block text-gray-500 uppercase tracking-[0.2em] font-black">Instructions</span>
                    <input
                      value={newDosage}
                      onChange={(e) => setNewDosage(e.target.value)}
                      placeholder="Posologie, durée, remarques"
                      className="w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
                    />
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-rose-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-rose-600 transition-all"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter la ligne
                </button>
              </div>

              {medications.length > 0 && (
                <div className="rounded-3xl border border-pink-100 bg-white p-4 text-sm text-gray-600">
                  <p className="font-bold text-gray-900">Lignes d'ordonnance</p>
                  <ul className="mt-3 space-y-2">
                    {medications.map((med, index) => (
                      <li key={`${med.name}-${index}`} className="flex items-center justify-between rounded-2xl border border-pink-50 bg-rose-50/70 px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{med.name}</p>
                          <p className="text-xs text-gray-500">{med.dosage}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(index)}
                          className="text-rose-600 text-xs font-bold hover:underline"
                        >
                          Supprimer
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {message && <p className="text-sm font-semibold text-rose-600">{message}</p>}

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600 transition-all"
              >
                <Check className="h-4 w-4" />
                {isSaving ? "Enregistrement..." : "Enregistrer l'ordonnance"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 text-rose-600 mb-5">
              <ClipboardList className="h-5 w-5" />
              <div>
                <h3 className="text-xl font-black text-gray-950">Ordonnances récentes</h3>
                <p className="text-sm text-gray-500">Résultat des prescriptions enregistrées.</p>
              </div>
            </div>

            {prescriptions.length > 0 ? (
              <div className="grid gap-4">
                {prescriptions.map((prescription) => (
                  <article key={prescription.id || prescription.date || prescription.patient} className="rounded-3xl border border-pink-50 bg-white p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-gray-900">{prescription.patient || "Patiente"}</p>
                        <p className="text-xs text-gray-500 mt-1">{prescription.date || "Date inconnue"}</p>
                      </div>
                      <FileText className="h-5 w-5 text-rose-500" />
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{prescription.meds || prescription.medicaments || "Aucun médicament listé."}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
                Aucune ordonnance disponible pour le moment.
              </div>
            )}
          </div>
        </section>
      )}

      {!isDoctor && (
        <section className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 shadow-sm">
          <div className="flex items-center gap-3 text-rose-600 mb-5">
            <ClipboardList className="h-5 w-5" />
            <div>
              <h3 className="text-xl font-black text-gray-950">Ordonnances récentes</h3>
              <p className="text-sm text-gray-500">Suivi des prescriptions stockées dans le dossier médical.</p>
            </div>
          </div>

          {prescriptions.length > 0 ? (
            <div className="grid gap-4">
              {prescriptions.map((prescription) => (
                <article key={prescription.id || prescription.date || prescription.patient} className="rounded-3xl border border-pink-50 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-black text-gray-900">{prescription.patient || "Patiente"}</p>
                      <p className="text-xs text-gray-500 mt-1">{prescription.date || "Date inconnue"}</p>
                    </div>
                    <FileText className="h-5 w-5 text-rose-500" />
                  </div>
                  <p className="mt-3 text-sm text-gray-600">{prescription.meds || prescription.medicaments || "Aucun médicament listé."}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
              Aucun ordonnance disponible pour le moment.
            </div>
          )}
        </section>
      )}
    </div>
  );
}
