import { Calendar, Clock, ClipboardList, HeartPulse, Users, Plus, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DoctorHomeView({
  docName,
  counts,
  appointments,
  onConfirmAppointment,
  onCancelAppointment,
  onOpenAddAppointment,
  onViewDossier,
}) {
  const statusBadgeClass = (status) => {
    if (status === "En attente") return "border-rose-100 bg-rose-50 text-rose-600";
    if (status === "Confirmé") return "border-emerald-100 bg-emerald-50 text-emerald-600";
    return "border-amber-100 bg-amber-50 text-amber-600";
  };
  return (
    <>
      <div className="space-y-1.5">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-950">Bonjour, Dr. {docName}</h1>
        <p className="text-sm font-semibold text-gray-400">
          Voici un aperçu de votre journée de consultations et de suivis de grossesse.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-pink-100 bg-[#fef1f6] transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-rose-600">RDV Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-rose-950">{counts.today}</h2>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-inner">
              <Calendar className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-100 bg-[#fefcf1] transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-amber-600">En attente</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-amber-950">{counts.waiting}</h2>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-amber-500 shadow-inner">
              <Clock className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 bg-[#f1fef6] transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-emerald-600">Patients</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-emerald-950">{counts.patients}</h2>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-500 shadow-inner">
              <Users className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-violet-100 bg-[#f5f1fe] transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-wider text-violet-600">Consultations</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-violet-950">{counts.consultations}</h2>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-500 shadow-inner">
              <HeartPulse className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </section>
      <Card className="overflow-hidden border-pink-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-pink-50 pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-black text-gray-900">
            <ClipboardList className="h-5.5 w-5.5 text-rose-500" />
            Rendez-vous du jour
          </CardTitle>
          <Button
            type="button"
            onClick={onOpenAddAppointment}
            className="bg-rose-500 text-white hover:bg-rose-600"
          >
            <Plus className="h-4 w-4" />
            Ajouter rendez-vous
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-rose-50/20">
                <TableHead className="px-6 text-[10px] font-extrabold uppercase tracking-wider">Heure</TableHead>
                <TableHead className="px-6 text-[10px] font-extrabold uppercase tracking-wider">Patient</TableHead>
                <TableHead className="px-6 text-[10px] font-extrabold uppercase tracking-wider">Statut</TableHead>
                <TableHead className="px-6 text-right text-[10px] font-extrabold uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => (
                <TableRow key={appt.id}>
                  <TableCell className="px-6 font-extrabold text-rose-500">{appt.time}</TableCell>
                  <TableCell className="px-6 font-bold text-gray-900">{appt.patient}</TableCell>
                  <TableCell className="px-6">
                    <Badge className={`normal-case tracking-normal ${statusBadgeClass(appt.status)}`}>
                      {appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {appt.status === "En attente" ? (
                        <>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => onConfirmAppointment(appt.id)}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Confirmer"
                          >
                            <Check className="h-4 w-4 stroke-[3px]" />
                          </Button>
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => onCancelAppointment(appt.id)}
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100"
                            title="Annuler"
                          >
                            <X className="h-4 w-4 stroke-[3px]" />
                          </Button>
                        </>
                      ) : appt.status === "Confirmé" ? (
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                          title="Consulter dossier complet"
                          onClick={onViewDossier}
                        >
                          <ClipboardList className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Badge variant="outline" className="normal-case tracking-normal text-gray-500">
                          Annulé
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
