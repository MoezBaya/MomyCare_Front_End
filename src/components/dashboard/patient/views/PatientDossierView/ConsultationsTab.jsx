import { useEffect, useState, useCallback } from "react";
import { Plus, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchConsultationsPatiente, createConsultation } from "@/services/gynecologueService";
import { Feedback, Loading, Empty } from "./Shared";

export default function ConsultationsTab({ patienteId }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    compteRendu: "",
    tension: "",
    pouls: "",
    saturationOxygene: "",
    temperature: "",
    poulsBebe: "",
  });

  const loadConsultations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchConsultationsPatiente(patienteId);
      setConsultations(data);
    } catch {
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  }, [patienteId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadConsultations();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadConsultations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      await createConsultation({
        compteRendu: form.compteRendu,
        tension: parseFloat(form.tension),
        pouls: parseInt(form.pouls, 10),
        saturationOxygene: parseFloat(form.saturationOxygene),
        temperature: parseFloat(form.temperature),
        poulsBebe: form.poulsBebe ? parseInt(form.poulsBebe, 10) : null,
        patienteId: Number(patienteId),
      });
      setMsg("Consultation créée avec succès.");
      setShowForm(false);
      setForm({ compteRendu: "", tension: "", pouls: "", saturationOxygene: "", temperature: "", poulsBebe: "" });
      await loadConsultations();
    } catch (err) {
      setMsg(err?.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-500">{consultations.length} consultation(s)</p>
        <Button onClick={() => setShowForm(!showForm)} className="bg-rose-500 text-white hover:bg-rose-600 rounded-2xl" size="sm">
          <Plus className="h-4 w-4" /> Nouvelle consultation
        </Button>
      </div>

      <Feedback msg={msg} />

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-pink-100 bg-rose-50/20 p-5 space-y-4">
          <h4 className="font-bold text-gray-900">Nouvelle consultation</h4>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Compte rendu *</label>
            <textarea
              rows={4}
              required
              value={form.compteRendu}
              onChange={(e) => setForm((f) => ({ ...f, compteRendu: e.target.value }))}
              placeholder="Observations cliniques, conclusions..."
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { key: "tension", label: "Tension (mmHg) *", type: "number", step: "0.1", min: "0", placeholder: "12.5" },
              { key: "pouls", label: "Pouls (bpm) *", type: "number", min: "0", max: "300", placeholder: "80" },
              { key: "saturationOxygene", label: "SpO₂ (%) *", type: "number", step: "0.1", min: "0", max: "100", placeholder: "98" },
              { key: "temperature", label: "Température (°C) *", type: "number", step: "0.1", min: "30", max: "45", placeholder: "37.2" },
              { key: "poulsBebe", label: "Pouls bébé (bpm)", type: "number", min: "0", max: "300", placeholder: "140" },
            ].map(({ key, label, ...rest }) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
                <input
                  {...rest}
                  value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm outline-none focus:border-rose-400"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving} className="bg-rose-500 text-white hover:bg-rose-600 rounded-2xl">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-2xl border-gray-200">
              Annuler
            </Button>
          </div>
        </form>
      )}

      {consultations.length === 0 ? (
        <Empty msg="Aucune consultation enregistrée." />
      ) : (
        <div className="space-y-3">
          {consultations.map((c) => (
            <div key={c.id} className="rounded-2xl border border-pink-100 bg-white p-4 space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-xs font-bold text-gray-400">{c.createdAt ? new Date(c.createdAt).toLocaleString("fr-FR") : "--"}</p>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">#{c.id}</span>
              </div>
              <p className="text-sm text-gray-700">{c.compteRendu}</p>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-gray-500">
                <span>Tension : {c.tension} mmHg</span>
                <span>·</span>
                <span>Pouls : {c.pouls} bpm</span>
                <span>·</span>
                <span>SpO₂ : {c.saturationOxygene}%</span>
                <span>·</span>
                <span>T° : {c.temperature}°C</span>
                {c.poulsBebe && (
                  <>
                    <span>·</span>
                    <span>Bébé : {c.poulsBebe} bpm</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
