// src/components/dashboard/doctor/PatientDossierView/DossierTab.jsx
import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchDossierPatiente, updateDossierPatiente } from "@/services/gynecologueService";

export default function DossierTab({ patienteId }) {
  const [form, setForm] = useState({
    antecedents: "",
    traitement: "",
    maladieChronique: "",
    dateDeGrosses: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchDossierPatiente(patienteId)
      .then((d) => {
        setForm({
          antecedents: d?.antecedents || "",
          traitement: d?.traitement || "",
          maladieChronique: d?.maladieChronique || "",
          dateDeGrosses: d?.dateDeGrosses || "",
        });
      })
      .catch(() => setMsg("Dossier non trouvé."))
      .finally(() => setLoading(false));
  }, [patienteId]);

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      await updateDossierPatiente(patienteId, form);
      setMsg("Dossier enregistré avec succès.");
    } catch (e) {
      setMsg(e?.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-4">Chargement du dossier...</div>;

  return (
    <div className="space-y-4">
      {msg && <div className={`text-sm ${msg.includes("succès") ? "text-green-600" : "text-rose-600"}`}>{msg}</div>}

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase text-gray-500">Antécédents médicaux</label>
        <textarea
          rows={3}
          value={form.antecedents}
          onChange={(e) => setForm({ ...form, antecedents: e.target.value })}
          className="w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-rose-400"
          placeholder="Allergies, maladies antérieures, opérations..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase text-gray-500">Traitement en cours</label>
        <textarea
          rows={3}
          value={form.traitement}
          onChange={(e) => setForm({ ...form, traitement: e.target.value })}
          className="w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-rose-400"
          placeholder="Médicaments, thérapies..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase text-gray-500">Maladie chronique</label>
        <textarea
          rows={3}
          value={form.maladieChronique}
          onChange={(e) => setForm({ ...form, maladieChronique: e.target.value })}
          className="w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-rose-400"
          placeholder="Diabète, hypertension..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase text-gray-500">Date de grossesse (début)</label>
        <input
          type="date"
          value={form.dateDeGrosses}
          onChange={(e) => setForm({ ...form, dateDeGrosses: e.target.value })}
          className="w-full rounded-2xl border border-pink-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-rose-500 text-white hover:bg-rose-600 rounded-2xl">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Enregistrement..." : "Sauvegarder le dossier"}
      </Button>
    </div>
  );
}