import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  fetchConsultationsPatiente,
  fetchOrdonnancesConsultation,
  createOrdonnance,
  deleteOrdonnance,
  fetchMedicaments,
} from "@/services/gynecologueService";
import { Feedback, Loading, Empty, Field } from "./Shared";

const INITIAL_LIGNE = { medicamentId: "", dose: "", frequence: "", quantite: 1, instructions: "", dureeTraitementJours: 7 };

export default function OrdonnancesTab({ patienteId }) {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultId, setSelectedConsultId] = useState(null);
  const [ordonnances, setOrdonnances] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const [numOrdonnance, setNumOrdonnance] = useState("");
  const [cachets, setCachets] = useState("");
  const [lignes, setLignes] = useState([INITIAL_LIGNE]);

  useEffect(() => {
    Promise.all([fetchConsultationsPatiente(patienteId), fetchMedicaments()])
      .then(([c, m]) => {
        setConsultations(c);
        setMedicaments(m);
        if (c.length) setSelectedConsultId(c[0].id);
      })
      .finally(() => setLoading(false));
  }, [patienteId]);

  useEffect(() => {
    if (!selectedConsultId) return;
    fetchOrdonnancesConsultation(selectedConsultId).then(setOrdonnances).catch(() => setOrdonnances([]));
  }, [selectedConsultId]);

  const addLigne = () => setLignes((l) => [...l, { ...INITIAL_LIGNE }] );
  const removeLigne = (i) => setLignes((l) => l.filter((_, idx) => idx !== i));
  const updateLigne = (i, field, value) => setLignes((l) => l.map((item, idx) => idx === i ? { ...item, [field]: value } : item));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      await createOrdonnance(selectedConsultId, {
        numOrdonnance,
        cachets,
        lignes: lignes.map((l) => ({
          medicamentId: Number(l.medicamentId),
          dose: l.dose,
          frequence: l.frequence,
          quantite: Number(l.quantite),
          instructions: l.instructions,
          dureeTraitementJours: Number(l.dureeTraitementJours),
        })),
      });
      setMsg("Ordonnance créée avec succès.");
      setShowForm(false);
      setLignes([INITIAL_LIGNE]);
      const updated = await fetchOrdonnancesConsultation(selectedConsultId);
      setOrdonnances(updated);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ordId) => {
    if (!window.confirm("Supprimer cette ordonnance ?")) return;
    try {
      await deleteOrdonnance(selectedConsultId, ordId);
      setOrdonnances((o) => o.filter((item) => item.idOrdonance !== ordId));
      setMsg("Ordonnance supprimée.");
    } catch {
      setMsg("Erreur lors de la suppression.");
    }
  };

  if (loading) return <Loading />;
  if (!consultations.length) return <Empty msg="Aucune consultation trouvée. Créez une consultation d'abord." />;

  return (
    <div className="space-y-4">
      <Feedback msg={msg} />

      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Consultation</label>
        <select
          value={selectedConsultId || ""}
          onChange={(e) => setSelectedConsultId(Number(e.target.value))}
          className="w-full rounded-xl border border-pink-100 px-4 py-2.5 text-sm outline-none focus:border-rose-400"
        >
          {consultations.map((c) => (
            <option key={c.id} value={c.id}>
              #{c.id} — {c.createdAt ? new Date(c.createdAt).toLocaleDateString("fr-FR") : "Date inconnue"} — {c.compteRendu?.slice(0, 40)}...
            </option>
          ))}
        </select>
      </div>

      <Button onClick={() => setShowForm(!showForm)} className="bg-rose-500 text-white hover:bg-rose-600 rounded-2xl" size="sm">
        <Plus className="h-4 w-4" /> Nouvelle ordonnance
      </Button>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-pink-100 bg-rose-50/20 p-5 space-y-4">
          <h4 className="font-bold text-gray-900">Créer une ordonnance</h4>
          <div className="grid grid-cols-2 gap-3">
            <Field label="N° ordonnance" value={numOrdonnance} onChange={setNumOrdonnance} placeholder="ORD-2026-001" />
            <Field label="Cachets / signature" value={cachets} onChange={setCachets} placeholder="Cachet du cabinet" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Lignes d'ordonnance</p>
              <Button type="button" onClick={addLigne} size="sm" variant="outline" className="rounded-xl border-rose-200 text-rose-600">
                <Plus className="h-3.5 w-3.5" /> Ajouter
              </Button>
            </div>

            {lignes.map((ligne, i) => (
              <div key={i} className="rounded-xl border border-pink-100 bg-white p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Médicament *</label>
                    <select
                      required
                      value={ligne.medicamentId}
                      onChange={(e) => updateLigne(i, "medicamentId", e.target.value)}
                      className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm"
                    >
                      <option value="">Choisir...</option>
                      {medicaments.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Dose *</label>
                    <input
                      required
                      value={ligne.dose}
                      onChange={(e) => updateLigne(i, "dose", e.target.value)}
                      placeholder="500mg"
                      className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Fréquence *</label>
                    <input
                      required
                      value={ligne.frequence}
                      onChange={(e) => updateLigne(i, "frequence", e.target.value)}
                      placeholder="3x/jour"
                      className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Quantité *</label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      required
                      value={ligne.quantite}
                      onChange={(e) => updateLigne(i, "quantite", e.target.value)}
                      className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Durée (jours)</label>
                    <input
                      type="number"
                      min="1"
                      value={ligne.dureeTraitementJours}
                      onChange={(e) => updateLigne(i, "dureeTraitementJours", e.target.value)}
                      className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase text-gray-400">Instructions</label>
                    <input
                      value={ligne.instructions}
                      onChange={(e) => updateLigne(i, "instructions", e.target.value)}
                      placeholder="À jeun..."
                      className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                {lignes.length > 1 && (
                  <button type="button" onClick={() => removeLigne(i)} className="text-xs font-bold text-rose-500 hover:underline">
                    Supprimer cette ligne
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={saving} className="bg-rose-500 text-white hover:bg-rose-600 rounded-2xl">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Création..." : "Créer l'ordonnance"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="rounded-2xl border-gray-200">
              Annuler
            </Button>
          </div>
        </form>
      )}

      {ordonnances.length === 0 ? (
        <Empty msg="Aucune ordonnance pour cette consultation." />
      ) : (
        <div className="space-y-3">
          {ordonnances.map((ord) => (
            <div key={ord.idOrdonance} className="rounded-2xl border border-pink-100 bg-white p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900">Ordonnance #{ord.numOrdonance || ord.idOrdonance}</p>
                  <p className="text-xs text-gray-400">{ord.createdAt ? new Date(ord.createdAt).toLocaleString("fr-FR") : "--"}</p>
                </div>
                <button type="button" onClick={() => handleDelete(ord.idOrdonance)} className="text-rose-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              {(ord.lignes || []).map((l) => (
                <div key={l.idLigneOrdonnance} className="text-sm py-1.5 border-t border-pink-50 first:border-0 flex flex-wrap gap-x-4 gap-y-1">
                  <span className="font-bold text-gray-800">{l.nomMedicament}</span>
                  <span className="text-gray-500">{l.dose} · {l.frequence} · {l.quantite} unité(s)</span>
                  {l.dureeTraitementJours && <span className="text-gray-400">{l.dureeTraitementJours}j</span>}
                  {l.instructions && <span className="text-rose-600 italic">{l.instructions}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
