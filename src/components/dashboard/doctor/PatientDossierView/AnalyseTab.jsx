// src/components/dashboard/doctor/PatientDossierView/AnalysesTab.jsx
import { useState, useEffect } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchConsultationsPatiente } from "@/services/gynecologueService";
import api from "@/services/api";

export default function AnalysesTab({ patienteId }) {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [file, setFile] = useState(null);
  const [type, setType] = useState("");
  const [resultat, setResultat] = useState("");
  const [uploading, setUploading] = useState(false);
  const [analyses, setAnalyses] = useState([]);

  useEffect(() => {
    if (patienteId) {
      fetchConsultationsPatiente(patienteId).then(setConsultations).catch(console.error);
    }
  }, [patienteId]);

  const loadAnalyses = async (consultationId) => {
    try {
      const res = await api.get(`/api/consultations/${consultationId}/analyses`);
      setAnalyses(res.data?.body ?? res.data?.data ?? res.data ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConsultation = (consultationId) => {
    const consultation = consultations.find(c => c.id == consultationId);
    setSelectedConsultation(consultation);
    if (consultation) loadAnalyses(consultation.id);
    else setAnalyses([]);
  };

  const handleUpload = async () => {
    if (!selectedConsultation || !file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const dto = { type, resultat };
      formData.append("dto", JSON.stringify(dto));
      await api.post(`/api/consultations/${selectedConsultation.id}/analyses`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Analyse ajoutée avec succès");
      setFile(null);
      setType("");
      setResultat("");
      await loadAnalyses(selectedConsultation.id);
    } catch (err) {
      console.error(err);
      alert(`Erreur : ${err.response?.data?.message || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Consultation</Label>
        <select
          className="w-full rounded-xl border border-pink-100 px-3 py-2"
          onChange={(e) => handleSelectConsultation(e.target.value)}
        >
          <option value="">Choisir une consultation</option>
          {consultations.map(c => (
            <option key={c.id} value={c.id}>
              Consultation du {new Date(c.createdAt).toLocaleDateString("fr-FR")}
            </option>
          ))}
        </select>
      </div>

      {selectedConsultation && (
        <div className="border rounded-2xl p-4 space-y-3">
          <div>
            <Label>Type d'analyse</Label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full rounded-xl border border-pink-100 px-3 py-2"
              placeholder="Ex: Prise de sang, Échographie..."
            />
          </div>
          <div>
            <Label>Résultat / Commentaire</Label>
            <textarea
              rows={2}
              value={resultat}
              onChange={(e) => setResultat(e.target.value)}
              className="w-full rounded-xl border border-pink-100 px-3 py-2 text-sm"
              placeholder="Résultat de l'analyse..."
            />
          </div>
          <div>
            <Label>Fichier (PDF, image)</Label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*,application/pdf" />
          </div>
          <Button onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            Téléverser l'analyse
          </Button>
        </div>
      )}

      {analyses.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">Analyses existantes</h4>
          {analyses.map(a => (
            <div key={a.id} className="border rounded p-2 my-1 text-sm">
              <strong>{a.type}</strong> – {a.resultat}
              {a.url && (
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-500">
                  Voir fichier
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}