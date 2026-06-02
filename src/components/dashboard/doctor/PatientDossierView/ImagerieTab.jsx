// src/components/dashboard/doctor/PatientDossierView/ImagerieTab.jsx
import { useState, useEffect } from "react";
import { Upload, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchConsultationsPatiente } from "@/services/gynecologueService";
import api from "@/services/api";

export default function ImagerieTab({ patienteId }) {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageries, setImageries] = useState([]);

  useEffect(() => {
    if (patienteId) {
      fetchConsultationsPatiente(patienteId).then(setConsultations).catch(console.error);
    }
  }, [patienteId]);

  const loadImageries = async (consultationId) => {
    try {
      const res = await api.get(`/api/consultations/${consultationId}/imageries`);
      setImageries(res.data?.body ?? res.data?.data ?? res.data ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectConsultation = (consultationId) => {
    const consultation = consultations.find(c => c.id == consultationId);
    setSelectedConsultation(consultation);
    if (consultation) loadImageries(consultation.id);
    else setImageries([]);
  };

  const handleUpload = async () => {
    if (!selectedConsultation || !file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      // ⚠️ Le backend attend "file" et "dto" (exactement ces noms)
      formData.append("file", file);
      // Le dto doit être une chaîne JSON contenant type et description
      const dto = { type: "imagerie", description };
      formData.append("dto", JSON.stringify(dto));

      await api.post(`/api/consultations/${selectedConsultation.id}/imageries`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Imagerie ajoutée avec succès");
      setFile(null);
      setDescription("");
      await loadImageries(selectedConsultation.id);
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
            <Label>Description</Label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-pink-100 px-3 py-2"
              placeholder="Échographie, IRM..."
            />
          </div>
          <div>
            <Label>Fichier (image, PDF)</Label>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="image/*,application/pdf" />
          </div>
          <Button onClick={handleUpload} disabled={uploading || !file}>
            {uploading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <ImageIcon className="h-4 w-4 mr-2" />}
            Téléverser
          </Button>
        </div>
      )}

      {imageries.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold">Imageries existantes</h4>
          {imageries.map(img => (
            <div key={img.id} className="border rounded p-2 my-1 text-sm">
              {img.description} – <a href={img.url} target="_blank" rel="noopener noreferrer">Voir</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}