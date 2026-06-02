import { useEffect, useState } from "react";
import { Plus, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchConsultationsPatiente, fetchImageriesConsultation, addImagerie } from "@/services/gynecologueService";
import { Feedback, Loading, Empty, Field } from "./Shared";

export default function ImageriesTab({ patienteId }) {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultId, setSelectedConsultId] = useState(null);
  const [imageries, setImageries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ type: "", description: "" });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchConsultationsPatiente(patienteId)
      .then((c) => {
        setConsultations(c);
        if (c.length) setSelectedConsultId(c[0].id);
      })
      .finally(() => setLoading(false));
  }, [patienteId]);

  useEffect(() => {
    if (!selectedConsultId) return;
    fetchImageriesConsultation(selectedConsultId).then(setImageries).catch(() => setImageries([]));
  }, [selectedConsultId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMsg("Veuillez joindre un fichier.");
      return;
    }
    setSaving(true);
    setMsg("");
    try {
      const added = await addImagerie(selectedConsultId, form, file);
      setImageries((im) => [added, ...im]);
      setMsg("Imagerie ajoutée avec succès.");
      setShowForm(false);
      setForm({ type: "", description: "" });
      setFile(null);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Erreur lors de l'ajout.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (!consultations.length) return <Empty msg="Aucune consultation trouvée. Créez une consultation d'abord." />;

  return (
    <div className="space-y-4">
      <Feedback msg={msg} />
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1 flex-1 min-w-[200px]">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Consultation</label>
          <select
            value={selectedConsultId || ""}
            onChange={(e) => setSelectedConsultId(Number(e.target.value))}
            className="w-full rounded-xl border border-pink-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
          >
            {consultations.map((c) => (
              <option key={c.id} value={c.id}>
                #{c.id} — {c.createdAt ? new Date(c.createdAt).toLocaleDateString("fr-FR") : "N/A"}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-rose-500 text-white hover:bg-rose-600 rounded-2xl self-end" size="sm">
          <Plus className="h-4 w-4" /> Ajouter une imagerie
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-pink-100 bg-rose-50/20 p-5 space-y-3">
          <h4 className="font-bold text-gray-900">Nouvelle imagerie</h4>
          <Field label="Type *" value={form.type} onChange={(v) => setForm((f) => ({ ...f, type: v }))} placeholder="Échographie, IRM, Radio..." />
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Observations..."
              className="w-full rounded-2xl border border-pink-100 px-4 py-3 text-sm outline-none focus:border-rose-400 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Fichier image *</label>
            <input
              type="file"
              accept="image/*,.pdf,.dicom"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-sm text-gray-600 file:rounded-xl file:border-0 file:bg-rose-50 file:px-4 file:py-2 file:text-xs file:font-bold file:text-rose-600"
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit" disabled={saving} className="bg-rose-500 text-white hover:bg-rose-600 rounded-2xl">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Ajout..." : "Enregistrer"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-2xl border-gray-200">
              Annuler
            </Button>
          </div>
        </form>
      )}

      {imageries.length === 0 ? (
        <Empty msg="Aucune imagerie pour cette consultation." />
      ) : (
        <div className="space-y-3">
          {imageries.map((im) => (
            <div key={im.id} className="rounded-2xl border border-pink-100 bg-white p-4">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">{im.type}</span>
                <span className="text-xs text-gray-400">{im.dateImagerie ? new Date(im.dateImagerie).toLocaleDateString("fr-FR") : "--"}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{im.description || "--"}</p>
              {im.fichierNom && <p className="mt-1 text-xs text-rose-600 font-semibold">📎 {im.fichierNom}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
