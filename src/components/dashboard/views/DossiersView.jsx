import { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PatientDossierView from "../doctor/PatientDossierView";

export default function DossiersView({ patients }) {
  const [selectedPatient, setSelectedPatient] = useState(null);

  if (selectedPatient) {
    return <PatientDossierView patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
  }

  return (
    <Card className="border-pink-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-black">Dossiers Obstétriques & Cliniques</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {patients.map((pat) => (
          <div key={pat.id} className="flex justify-between items-center p-4 border rounded-2xl">
            <div>
              <h4 className="font-extrabold">{pat.name}</h4>
              <p className="text-xs text-gray-400">Suivi prénatal — Terme : {pat.termDate || "--"}</p>
            </div>
            <Button variant="outline" onClick={() => setSelectedPatient(pat)}>
              Consulter dossier complet
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}