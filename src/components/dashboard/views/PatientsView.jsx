import { useState } from "react";
import { FileText, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PatientDossierView from "../doctor/PatientDossierView";

export default function PatientsView({ patients }) {
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Si un patient est sélectionné, afficher la vue détaillée
  if (selectedPatient) {
    return (
      <PatientDossierView
        patient={selectedPatient}
        onBack={() => setSelectedPatient(null)}
      />
    );
  }

  // Sinon afficher la liste des patientes
  return (
    <Card className="rounded-3xl border-pink-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-black text-gray-900">
          Mes patientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {patients.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-pink-200 bg-rose-50/70 p-10 text-center text-gray-500">
            Aucune patiente pour le moment.
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-pink-100 bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-rose-100 p-2">
                    <User className="h-5 w-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                    <p className="text-sm text-gray-500">{patient.phone}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedPatient(patient)}
                  className="rounded-2xl border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Consulter dossier complet
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}