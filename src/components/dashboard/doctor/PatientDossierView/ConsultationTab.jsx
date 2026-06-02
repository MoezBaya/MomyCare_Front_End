// src/components/dashboard/doctor/PatientDossierView/ConsultationTab.jsx
import { useState, useEffect } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchConsultationsPatiente, createConsultation } from "@/services/gynecologueService";

export default function ConsultationTab({ patienteId }) {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    compteRendu: "",
    tension: "",
    pouls: "",
    saturationOxygene: "",
    temperature: "",
    poulsBebe: "",
  });
  const [saving, setSaving] = useState(false);

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const data = await fetchConsultationsPatiente(patienteId);
      setConsultations(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patienteId) loadConsultations();
  }, [patienteId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await createConsultation({ ...form, patienteId });
      await loadConsultations();
      setShowModal(false);
      setForm({ compteRendu: "", tension: "", pouls: "", saturationOxygene: "", temperature: "", poulsBebe: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-8">Chargement...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)} className="bg-rose-500 hover:bg-rose-600">
          <Plus className="mr-2 h-4 w-4" /> Nouvelle consultation
        </Button>
      </div>

      {consultations.length === 0 ? (
        <p className="text-gray-500 text-center">Aucune consultation.</p>
      ) : (
        consultations.map(c => (
          <Card key={c.id}>
            <CardHeader><CardTitle className="text-md">Consultation du {new Date(c.createdAt).toLocaleDateString("fr-FR")}</CardTitle></CardHeader>
            <CardContent><p className="text-sm">{c.compteRendu || "Pas de compte rendu"}</p></CardContent>
          </Card>
        ))
      )}

      {/* Modal maison (pas de dépendance aux Dialog de shadcn) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Ajouter une consultation</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <Label>Compte rendu</Label>
                <textarea
                  rows={3}
                  value={form.compteRendu}
                  onChange={(e) => setForm({...form, compteRendu: e.target.value})}
                  className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm"
                  placeholder="Compte rendu..."
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><Label>Tension</Label><Input value={form.tension} onChange={(e) => setForm({...form, tension: e.target.value})} /></div>
                <div><Label>Pouls</Label><Input value={form.pouls} onChange={(e) => setForm({...form, pouls: e.target.value})} /></div>
                <div><Label>SpO₂</Label><Input value={form.saturationOxygene} onChange={(e) => setForm({...form, saturationOxygene: e.target.value})} /></div>
                <div><Label>Température</Label><Input value={form.temperature} onChange={(e) => setForm({...form, temperature: e.target.value})} /></div>
                <div><Label>Pouls bébé</Label><Input value={form.poulsBebe} onChange={(e) => setForm({...form, poulsBebe: e.target.value})} /></div>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? <Loader2 className="animate-spin h-4 w-4" /> : "Enregistrer"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}