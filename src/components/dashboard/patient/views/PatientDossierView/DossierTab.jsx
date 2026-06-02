import { useEffect, useState } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchDossierPatiente, updateDossierPatiente } from "@/services/gynecologueService";
import { Feedback, Loading } from "./Shared";

export default function DossierTab({ patienteId }) {
  const [form, setForm] = useState({ antecedents: "", traitement: "", maladieChronique: "", dateDeGrosses: "" });
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

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <Feedback msg={msg} />

      {[
        { key: "antecedents", label: "Antécédents médicaux", placeholder: "Allergies, maladies antérieures, opérations..." },
        { key: "traitement", label: "Traitement en cours", placeholder: "Médicaments, thérapies..." },
        { key: "maladieChronique", label: "Maladie chronique", placeholder: "Diabète, hypertension..." },
      ].map(({ key, label, placeholder }) => (
        <div key={key} className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
          <textarea
            rows={3}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            placeholder={placeholder}
            className="w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 resize-none"
          />
        </div>
      ))}

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Date de grossesse (début)</label>
        <input
          type="date"
          value={form.dateDeGrosses}
          onChange={(e) => setForm((f) => ({ ...f, dateDeGrosses: e.target.value }))}
          className="rounded-2xl border border-pink-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
        />
      </div>

      <Button onClick={handleSave} disabled={saving} className="bg-rose-500 text-white hover:bg-rose-600 rounded-2xl">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {saving ? "Enregistrement..." : "Sauvegarder le dossier"}
      </Button>
    </div>
  );
}
