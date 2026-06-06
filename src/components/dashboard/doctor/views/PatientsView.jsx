import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText, Mail, Phone, Search, UserRound } from "lucide-react";
import PatientDossierView from "../PatientDossierView";

const mockPatients = [
  {
    id: 1,
    name: "Sarra Mansouri",
    email: "sarra@example.com",
    phone: "55 123 456",
    birthday: "1996-04-15",
    weekOfPregnancy: "28",
    bloodType: "B+",
    allergies: "Aucune",
  },
];

export default function PatientsView({ patients = [] }) {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [query, setQuery] = useState("");
  const sourcePatients = patients.length ? patients : mockPatients;
  const filteredPatients = sourcePatients.filter((patient) => {
    const value = `${patient.name || ""} ${patient.email || ""} ${patient.phone || ""}`.toLowerCase();
    return value.includes(query.toLowerCase());
  });

  if (selectedPatient) {
    return <PatientDossierView patient={selectedPatient} onBack={() => setSelectedPatient(null)} />;
  }

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-rose-500">Espace patientes</p>
          <h1 className="text-3xl font-black text-slate-950">Mes patientes</h1>
        </div>
        <div className="relative w-full sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une patiente..."
            className="h-11 w-full rounded-2xl border border-pink-100 bg-white pl-10 pr-4 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
          />
        </div>
      </div>

      <Card className="overflow-hidden rounded-[28px] border-pink-100 bg-white shadow-sm">
        <CardHeader className="border-b border-pink-50 bg-gradient-to-r from-white via-rose-50/50 to-violet-50/50">
          <CardTitle className="flex items-center gap-2 text-lg font-black text-slate-950">
            <UserRound className="h-5 w-5 text-rose-500" />
            Liste des patientes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPatients.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm font-medium text-slate-400">
              Aucune patiente trouvee.
            </div>
          ) : (
            <div className="divide-y divide-pink-50">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="grid gap-4 px-5 py-4 transition hover:bg-rose-50/40 md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-rose-100 to-violet-100 text-lg font-black text-rose-600">
                      {(patient.name || "P").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-black text-slate-950">{patient.name || "Patiente"}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-slate-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-rose-400" />
                          {patient.email || "--"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-rose-400" />
                          {patient.phone || "--"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-rose-400" />
                          SG {patient.weekOfPregnancy || patient.progress || "--"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedPatient(patient)}
                    className="h-11 rounded-2xl border-rose-200 bg-white px-5 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                  >
                    <FileText className="mr-2 h-4 w-4" /> Dossier
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
