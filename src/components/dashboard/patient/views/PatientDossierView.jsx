/**
 * PatientDossierView.jsx
 * ======================
 * Vue détaillée du dossier d'une patiente pour le gynécologue.
 * Accessible depuis PatientsView en cliquant "Consulter dossier".
 *
 * Onglets :
 *   - Dossier médical (antécédents, traitement, maladie chronique)
 *   - Consultations (liste + créer)
 *   - Ordonnances (par consultation + créer)
 *   - Analyses (liste + upload)
 *   - Imageries (liste + upload)
 */

import { useState } from "react";
import {
  ArrowLeft, FolderHeart, CalendarDays, ClipboardList,
  FileText, ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DossierTab from "./PatientDossierView/DossierTab";
import ConsultationsTab from "./PatientDossierView/ConsultationsTab";
import OrdonnancesTab from "./PatientDossierView/OrdonnancesTab";
import AnalysesTab from "./PatientDossierView/AnalysesTab";
import ImageriesTab from "./PatientDossierView/ImageriesTab";

const TABS = [
  { key: "dossier",       label: "Dossier médical",  icon: FolderHeart   },
  { key: "consultations", label: "Consultations",   icon: CalendarDays  },
  { key: "ordonnances",   label: "Ordonnances",      icon: ClipboardList },
  { key: "analyses",      label: "Analyses",         icon: FileText      },
  { key: "imageries",     label: "Imageries",        icon: ImageIcon     },
];

export default function PatientDossierView({ patient, onBack }) {
  const [activeTab, setActiveTab] = useState("dossier");

  return (
    <section className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" onClick={onBack}
          className="rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-600">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <div>
          <h2 className="text-2xl font-black text-gray-950">{patient.name}</h2>
          <p className="text-sm text-gray-400">{patient.email} · {patient.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[220px_1fr] gap-6">
        <aside className="space-y-2 rounded-3xl border border-pink-100 bg-rose-50/10 p-4">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} type="button" onClick={() => setActiveTab(key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm transition-all ${
                activeTab === key ? "bg-white text-rose-600 shadow-sm font-bold" : "text-gray-600 hover:bg-white/80 font-medium"
              }`}>
              <Icon className="h-4.5 w-4.5" />
              {label}
            </button>
          ))}
        </aside>

        <Card className="border-pink-100 shadow-sm">
          <CardHeader className="border-b border-pink-50 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-black text-gray-900">
              {TABS.find((t) => t.key === activeTab)?.label}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            {activeTab === "dossier"       && <DossierTab patienteId={patient.id} />}
            {activeTab === "consultations" && <ConsultationsTab patienteId={patient.id} />}
            {activeTab === "ordonnances"   && <OrdonnancesTab patienteId={patient.id} />}
            {activeTab === "analyses"      && <AnalysesTab patienteId={patient.id} />}
            {activeTab === "imageries"     && <ImageriesTab patienteId={patient.id} />}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
