// src/components/dashboard/doctor/PatientDossierView/OrdonnanceTab.jsx
import { useState, useEffect } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchConsultationsPatiente, fetchOrdonnancesConsultation, createOrdonnance, fetchMedicaments } from "@/services/gynecologueService";
import api from "@/services/api";

export default function OrdonnanceTab({ patienteId }) {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultationId, setSelectedConsultationId] = useState("");
  const [ordonnances, setOrdonnances] = useState([]);
  const [medicaments, setMedicaments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMedicamentName, setNewMedicamentName] = useState("");
  const [addingMedicament, setAddingMedicament] = useState(false);
  const [form, setForm] = useState({ 
    medicamentId: "", 
    dureeTraitementJours: "", 
    instructions: "",
    dose: "1",
    frequence: "1 fois par jour",
    quantite: 1
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Charger consultations et médicaments
  useEffect(() => {
    if (patienteId) {
      fetchConsultationsPatiente(patienteId).then(setConsultations).catch(console.error);
      fetchMedicaments().then(setMedicaments).catch(console.error);
    }
  }, [patienteId]);

  const handleSelectConsultation = async (consultationId) => {
    setSelectedConsultationId(consultationId);
    if (consultationId) {
      setLoading(true);
      try {
        const ordos = await fetchOrdonnancesConsultation(consultationId);
        setOrdonnances(ordos || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setOrdonnances([]);
    }
  };

  // Ajouter un nouveau médicament
  const handleAddMedicament = async () => {
    if (!newMedicamentName.trim()) return;
    setAddingMedicament(true);
    try {
      const response = await api.post("/api/medicaments", { nomMedicament: newMedicamentName });
      const newMed = response.data?.body ?? response.data?.data ?? response.data;
      // Rafraîchir la liste des médicaments
      const updatedMedicaments = await fetchMedicaments();
      setMedicaments(updatedMedicaments);
      // Sélectionner automatiquement le nouveau médicament
      setForm({ ...form, medicamentId: String(newMed.id) });
      setNewMedicamentName("");
    } catch (err) {
      console.error("Erreur création médicament:", err);
      alert("Impossible d'ajouter le médicament. Vérifiez le backend.");
    } finally {
      setAddingMedicament(false);
    }
  };

  const handleSave = async () => {
    if (!selectedConsultationId) {
      alert("Veuillez sélectionner une consultation.");
      return;
    }
    if (!form.medicamentId || !form.dureeTraitementJours) {
      alert("Veuillez choisir un médicament et indiquer la durée.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        numOrdonnance: `ORD-${Date.now()}`,
        cachets: "",
        signature: "",
        lignes: [
          {
            medicamentId: parseInt(form.medicamentId, 10),
            dose: form.dose,
            frequence: form.frequence,
            quantite: form.quantite,
            instructions: form.instructions,
            dureeTraitementJours: parseInt(form.dureeTraitementJours, 10)
          }
        ]
      };
      console.log("Payload ordonnance :", payload);
      await createOrdonnance(selectedConsultationId, payload);
      
      const ordos = await fetchOrdonnancesConsultation(selectedConsultationId);
      setOrdonnances(ordos || []);
      setShowModal(false);
      setForm({ medicamentId: "", dureeTraitementJours: "", instructions: "", dose: "1", frequence: "1 fois par jour", quantite: 1 });
    } catch (err) {
      console.error("Erreur création ordonnance:", err);
      alert(`Erreur : ${err.response?.data?.message || err.message}`);
    } finally {
      setSaving(false);
    }
  };

 return (
  <div className="space-y-4">
    <div>
      <Label>Choisir une consultation</Label>
      <select
        value={selectedConsultationId}
        onChange={(e) => handleSelectConsultation(e.target.value)}
        className="w-full rounded-xl border border-pink-100 px-3 py-2"
      >
        <option value="">Sélectionner...</option>
        {consultations.map(c => (
          <option key={c.id} value={c.id}>
            Consultation du {new Date(c.createdAt).toLocaleDateString("fr-FR")}
          </option>
        ))}
      </select>
    </div>

    {selectedConsultationId && (
      <>
        <div className="flex justify-end">
          <Button onClick={() => setShowModal(true)} className="bg-rose-500">
            <Plus className="mr-2 h-4 w-4" /> Ajouter ordonnance
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-4">Chargement des ordonnances...</div>
        ) : ordonnances.length === 0 ? (
          <p className="text-gray-500 text-center">Aucune ordonnance pour cette consultation.</p>
        ) : (
          ordonnances.map(o => (
            <div key={o.id}>
              <CardContent className="py-3">
                <p className="font-medium">Ordonnance #{o.numOrdonnance}</p>
                {o.lignes?.map((ligne, idx) => (
                  <div key={idx} className="mt-2 text-sm">
                    <p>💊 {ligne.medicamentNom} – {ligne.dose}</p>
                    <p className="text-xs text-gray-500">{ligne.instructions} · {ligne.dureeTraitementJours} jours</p>
                  </div>
                ))}
              </CardContent>
            </div>
          ))
        )}
      </>
    )}

    {/* Modal d'ajout d'ordonnance avec création de médicament */}
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Nouvelle ordonnance</h3>
            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            {/* Sélection ou ajout de médicament */}
            <div>
              <Label>Médicament</Label>
              <select
                value={form.medicamentId}
                onChange={(e) => setForm({...form, medicamentId: e.target.value})}
                className="w-full rounded-xl border border-pink-100 px-3 py-2"
              >
                <option value="">Choisir un médicament existant</option>
                {medicaments.map(m => (
                  <option key={m.id} value={m.id}>{m.nom}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nouveau médicament"
                value={newMedicamentName}
                onChange={(e) => setNewMedicamentName(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddMedicament}
                disabled={addingMedicament || !newMedicamentName.trim()}
              >
                {addingMedicament ? <Loader2 className="animate-spin h-4 w-4" /> : "Ajouter"}
              </Button>
            </div>

            <div><Label>Dosage</Label><Input value={form.dose} onChange={(e) => setForm({...form, dose: e.target.value})} placeholder="ex: 1 comprimé" /></div>
            <div><Label>Fréquence</Label><Input value={form.frequence} onChange={(e) => setForm({...form, frequence: e.target.value})} placeholder="ex: matin et soir" /></div>
            <div><Label>Durée (jours) *</Label><Input type="number" value={form.dureeTraitementJours} onChange={(e) => setForm({...form, dureeTraitementJours: e.target.value})} /></div>
            <div><Label>Instructions</Label><textarea rows={2} value={form.instructions} onChange={(e) => setForm({...form, instructions: e.target.value})} className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm" placeholder="À prendre avec de l'eau..." /></div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? <Loader2 className="animate-spin h-4 w-4" /> : "Enregistrer l'ordonnance"}
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}