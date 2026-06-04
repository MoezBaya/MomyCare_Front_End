import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderHeart, CalendarDays, ClipboardList, FileText, ImageIcon } from "lucide-react";
import { DossierTab, ConsultationsTab, OrdonnancesTab, AnalysesTab, ImageriesTab } from "./tabs";

const TABS = [
  { key: "dossier", label: "Dossier médical", icon: FolderHeart, component: DossierTab },
  { key: "consultations", label: "Consultations", icon: CalendarDays, component: ConsultationsTab },
  { key: "ordonnances", label: "Ordonnances", icon: ClipboardList, component: OrdonnancesTab },
  { key: "analyses", label: "Analyses", icon: FileText, component: AnalysesTab },
  { key: "imageries", label: "Imageries", icon: ImageIcon, component: ImageriesTab },
];

export const PatientDossierView = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState("dossier");
  const ActiveComponent = TABS.find(t => t.key === activeTab)?.component;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}><ArrowLeft className="h-4 w-4" /> Retour</Button>
        <div><h2 className="text-2xl font-black">{patient.name}</h2><p className="text-sm text-gray-400">{patient.email}</p></div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-2 rounded-3xl border border-pink-100 p-4">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition-all ${activeTab === key ? "bg-white text-rose-600 shadow-sm" : "text-gray-600 hover:bg-white/80"}`}>
              <Icon className="h-4.5 w-4.5" /> {label}
            </button>
          ))}
        </aside>
        <Card>
          <CardHeader><CardTitle>{TABS.find(t => t.key === activeTab)?.label}</CardTitle></CardHeader>
          <CardContent><ActiveComponent patientId={patient.id} /></CardContent>
        </Card>
      </div>
    </section>
  );
};