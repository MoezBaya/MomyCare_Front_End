import { Calendar, Clock, Check, X, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * RendezVousView — vue gynécologue.
 * Liste les RDV en attente + historique, avec actions confirmer/refuser.
 *
 * Appelle PATCH /api/rdv/{id}/repondre?accepter=true|false via useDoctorDashboard.
 * ✅ Aligné sur StatusRDV : EN_ATTENTE, CONFIRME, ANNULE, REFUSER, TERMINE
 */

// ✅ Mapping complet des 5 statuts backend
function statusClass(status) {
  if (status === "Confirmé") return "border-emerald-100 bg-emerald-50 text-emerald-700";
  if (status === "Annulé")   return "border-rose-100 bg-rose-50 text-rose-700";
  if (status === "Refusé")   return "border-red-100 bg-red-50 text-red-700";
  if (status === "Terminé")  return "border-gray-100 bg-gray-100 text-gray-600";
  return "border-amber-100 bg-amber-50 text-amber-700"; // "En attente"
}

// Traduction du motif (MotifRendezVous enum)
function motifLabel(motif) {
  const labels = {
    CONSULTATION:    "Consultation",
    ECHOGRAPHIE:     "Échographie",
    PROBLEME_MEDICAL: "Problème médical",
    GROSSESSE_RISQUE: "Grossesse à risque",
  };
  return labels[motif] || motif || "Consultation";
}

export default function RendezVousView({
  appointments,
  onConfirmAppointment,
  onCancelAppointment,
  onRefresh,
  isRefreshing,
}) {
  const pending   = appointments.filter((a) => a.status === "En attente");
  const confirmed = appointments.filter((a) => a.status === "Confirmé");
  const refused   = appointments.filter((a) => a.status === "Refusé");
  const terminated = appointments.filter((a) => a.status === "Terminé");
  const cancelled = appointments.filter((a) => a.status === "Annulé");

  return (
    <Card className="animate-fade-in border-pink-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b border-pink-50 pb-5">
        <div>
          <CardTitle className="flex items-center gap-2 text-2xl font-black text-gray-950">
            <Calendar className="h-7 w-7 text-rose-500" />
            Gestion des rendez-vous
          </CardTitle>
          <p className="mt-1 text-sm font-medium text-gray-500">
            {pending.length} en attente · {confirmed.length} confirmé(s) · {appointments.length} au total
          </p>
        </div>
        {onRefresh && (
          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="rounded-2xl"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Chargement..." : "Rafraîchir"}
          </Button>
        )}
      </CardHeader>

      <CardContent className="px-0">
        {appointments.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-400">
            <Calendar className="h-12 w-12 text-gray-200" />
            <p className="text-sm font-medium">Aucun rendez-vous.</p>
          </div>
        ) : (
          <>
            {/* ── Section : En attente ─────────────────────────────────── */}
            {pending.length > 0 && (
              <div className="mb-6">
                <p className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-50/50">
                  En attente de réponse ({pending.length})
                </p>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50/20">
                      <TableHead className="px-6">Patiente</TableHead>
                      <TableHead className="px-6">Date / Heure</TableHead>
                      <TableHead className="px-6">Motif</TableHead>
                      <TableHead className="px-6">Statut</TableHead>
                      <TableHead className="px-6 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pending.map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-amber-50/10">
                        <TableCell className="px-6 font-bold text-gray-900">{appt.patient}</TableCell>
                        <TableCell className="px-6">
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600">
                            <Clock className="h-4 w-4 text-rose-500" />
                            {appt.date && appt.time ? `${appt.date} à ${appt.time}` : appt.time || "--"}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 text-sm text-gray-500">
                          {motifLabel(appt.type)}
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge className={`normal-case tracking-normal ${statusClass(appt.status)}`}>
                            {appt.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <div className="flex justify-end gap-1.5">
                            {/* ✅ PATCH /api/rdv/{id}/repondre?accepter=true → CONFIRME */}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => onConfirmAppointment(appt.id)}
                              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl px-3 py-1.5 text-xs font-bold gap-1"
                              title="Confirmer le rendez-vous"
                            >
                              <Check className="h-3.5 w-3.5 stroke-[3px]" />
                              Confirmer
                            </Button>
                            {/* ✅ PATCH /api/rdv/{id}/repondre?accepter=false → REFUSER */}
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => onCancelAppointment(appt.id)}
                              className="bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl px-3 py-1.5 text-xs font-bold gap-1"
                              title="Refuser le rendez-vous"
                            >
                              <X className="h-3.5 w-3.5 stroke-[3px]" />
                              Refuser
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* ── Section : Confirmés + Terminés + Refusés ─────────────── */}
            {(confirmed.length > 0 || terminated.length > 0 || refused.length > 0 || cancelled.length > 0) && (
              <div>
                <p className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 bg-gray-50/50">
                  Historique
                </p>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/20">
                      <TableHead className="px-6">Patiente</TableHead>
                      <TableHead className="px-6">Date / Heure</TableHead>
                      <TableHead className="px-6">Motif</TableHead>
                      <TableHead className="px-6">Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...confirmed, ...terminated, ...refused, ...cancelled].map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-gray-50/10">
                        <TableCell className="px-6 font-bold text-gray-900">{appt.patient}</TableCell>
                        <TableCell className="px-6">
                          <span className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600">
                            <Clock className="h-4 w-4 text-rose-500" />
                            {appt.date && appt.time ? `${appt.date} à ${appt.time}` : appt.time || "--"}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 text-sm text-gray-500">
                          {motifLabel(appt.type)}
                        </TableCell>
                        <TableCell className="px-6">
                          <Badge className={`normal-case tracking-normal ${statusClass(appt.status)}`}>
                            {appt.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
