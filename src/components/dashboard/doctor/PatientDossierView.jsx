// src/components/dashboard/doctor/PatientDossierView.jsx
import { useState, useMemo } from "react";
import { 
  ArrowLeft, User, Calendar, Baby, Droplet, AlertCircle, 
  FileText, Activity, Syringe, Image, Scissors, Download 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DossierTab from "./PatientDossierView/DossierTab";
import ConsultationsTab from "./PatientDossierView/ConsultationTab";
import OrdonnancesTab from "./PatientDossierView/OrdonnanceTab";
import AnalysesTab from "./PatientDossierView/AnalyseTab";
import ImageriesTab from "./PatientDossierView/ImagerieTab";

export default function PatientDossierView({ patient, onBack }) {
  const [activeTab, setActiveTab] = useState("dossier");

  // Calcul de l'âge à partir de la date de naissance (si fournie)
  const age = useMemo(() => {
    if (!patient.birthday) return "";
    const birth = new Date(patient.birthday);
    const diff = Date.now() - birth.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }, [patient.birthday]);

  const exportToPDF = () => {
    alert("Fonction d'export PDF à venir");
    // À implémenter avec jspdf si besoin
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="rounded-2xl">
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
          <div>
            <h2 className="text-2xl font-black text-gray-950">{patient.name}</h2>
            <p className="text-sm text-gray-500">{patient.email} · {patient.phone}</p>
          </div>
        </div>
        <Button variant="outline" onClick={exportToPDF} className="rounded-2xl border-rose-200 text-rose-600">
          <Download className="mr-2 h-4 w-4" /> Exporter le dossier (PDF)
        </Button>
      </div>

      {/* Cartes récapitulatives */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-pink-100 bg-gradient-to-br from-rose-50/50 to-white shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <User className="h-8 w-8 text-rose-500" />
            <div>
              <p className="text-xs text-gray-500">Âge</p>
              <p className="text-lg font-bold">{age || "–"} ans</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-pink-100 bg-gradient-to-br from-rose-50/50 to-white shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <Baby className="h-8 w-8 text-rose-500" />
            <div>
              <p className="text-xs text-gray-500">Terme grossesse</p>
              <p className="text-lg font-bold">SG {patient.weekOfPregnancy || "–"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-pink-100 bg-gradient-to-br from-rose-50/50 to-white shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <Droplet className="h-8 w-8 text-rose-500" />
            <div>
              <p className="text-xs text-gray-500">Groupe sanguin</p>
              <p className="text-lg font-bold">{patient.bloodType || "–"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-pink-100 bg-gradient-to-br from-rose-50/50 to-white shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="h-8 w-8 text-rose-500" />
            <div>
              <p className="text-xs text-gray-500">Allergies</p>
              <p className="text-lg font-bold truncate">{patient.allergies || "Aucune"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 bg-transparent p-0">
          {[
            { key: "dossier", label: "Dossier médical", icon: FileText },
            { key: "consultations", label: "Consultations", icon: Activity },
            { key: "ordonnances", label: "Ordonnances", icon: Scissors },
            { key: "analyses", label: "Analyses", icon: Syringe },
            { key: "imageries", label: "Imageries", icon: Image },
          ].map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="rounded-2xl data-[state=active]:bg-rose-500 data-[state=active]:text-white px-4 py-2"
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="dossier"><DossierTab patienteId={patient.id} /></TabsContent>
        <TabsContent value="consultations"><ConsultationsTab patienteId={patient.id} /></TabsContent>
        <TabsContent value="ordonnances"><OrdonnancesTab patienteId={patient.id} /></TabsContent>
        <TabsContent value="analyses"><AnalysesTab patienteId={patient.id} /></TabsContent>
        <TabsContent value="imageries"><ImageriesTab patienteId={patient.id} /></TabsContent>
      </Tabs>
    </div>
  );
}