import { Calendar, PlusCircle, Clock, RotateCw, Check, X, Ban } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ✅ Mapping complet de tous les statuts backend : EN_ATTENTE, CONFIRME, ANNULE, REFUSER, TERMINE
function statusConfig(status) {
  switch (status) {
    case "Confirmé":
      return {
        badge: "bg-emerald-100 border-emerald-200 text-emerald-700",
        card:  "border-emerald-100 bg-emerald-50/10 hover:border-emerald-200 shadow-sm",
        icon:  "bg-emerald-50 text-emerald-500",
        showActions: true,
      };
    case "En attente":
      return {
        badge: "bg-amber-100 border-amber-200 text-amber-700",
        card:  "border-amber-100 bg-amber-50/10 hover:border-amber-200",
        icon:  "bg-amber-50 text-amber-500",
        showActions: false,
      };
    case "Annulé":
      return {
        badge: "bg-rose-100 border-rose-200 text-rose-700",
        card:  "border-rose-100 bg-rose-50/10 hover:border-rose-200",
        icon:  "bg-rose-50 text-rose-400",
        showActions: false,
      };
    case "Refusé":
      return {
        badge: "bg-red-100 border-red-200 text-red-700",
        card:  "border-red-100 bg-red-50/10 hover:border-red-200",
        icon:  "bg-red-50 text-red-400",
        showActions: false,
      };
    case "Terminé":
      return {
        badge: "bg-gray-100 border-gray-200 text-gray-600",
        card:  "border-gray-100 bg-gray-50/20 hover:border-gray-200",
        icon:  "bg-gray-100 text-gray-400",
        showActions: false,
      };
    default:
      return {
        badge: "bg-gray-100 border-gray-200 text-gray-600",
        card:  "border-gray-100 bg-gray-50/20 hover:border-gray-200",
        icon:  "bg-gray-100 text-gray-400",
        showActions: false,
      };
  }
}

// Icône selon le statut
function StatusIcon({ status, className }) {
  switch (status) {
    case "Confirmé": return <Check className={className} />;
    case "Annulé":
    case "Refusé":   return <Ban className={className} />;
    default:         return <Clock className={className} />;
  }
}

export default function PatientRendezVousView() {
  const {
    appointments,
    openBookModal,
    handleEditNextAppt,
    openCancelModal,
    reloadAppointments,
    isReloading,
  } = usePatientContext();

  // Trier : en attente → confirmé → terminé → annulé/refusé
  const ORDER = { "En attente": 0, "Confirmé": 1, "Terminé": 2, "Annulé": 3, "Refusé": 4 };
  const sorted = [...appointments].sort(
    (a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9)
  );

  return (
    <Card className="animate-fade-in border-pink-100 shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b border-pink-50 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-2xl font-black text-gray-950">
            <Calendar className="h-6 w-6 text-rose-500" />
            Gestion de mes Rendez-vous
          </CardTitle>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Consultez, programmez ou annulez vos rendez-vous médicaux.
          </p>
        </div>
        <div className="flex gap-2 flex-col sm:flex-row">
          <Button
            type="button"
            onClick={reloadAppointments}
            disabled={isReloading}
            variant="outline"
            className="h-auto rounded-2xl px-4 py-3 text-sm font-extrabold text-gray-600 hover:text-gray-700"
          >
            <RotateCw className={`h-4 w-4 ${isReloading ? "animate-spin" : ""}`} />
            {isReloading ? "Rafraîchissement..." : "Rafraîchir"}
          </Button>
          <Button
            type="button"
            onClick={openBookModal}
            className="h-auto rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600"
          >
            <PlusCircle className="h-4 w-4" />
            Prendre un rendez-vous
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 pt-6">
        {/* Compteurs par statut */}
        {appointments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {["En attente", "Confirmé", "Terminé", "Annulé", "Refusé"].map((s) => {
              const count = appointments.filter((a) => a.status === s).length;
              if (count === 0) return null;
              const { badge } = statusConfig(s);
              return (
                <Badge key={s} className={`normal-case tracking-normal ${badge}`}>
                  {count} {s}
                </Badge>
              );
            })}
          </div>
        )}

        {sorted.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50/20 p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">Aucun rendez-vous pour le moment</p>
            <p className="text-sm text-gray-500 mt-1">
              Cliquez sur le bouton ci-dessus pour prendre un rendez-vous
            </p>
          </div>
        ) : (
          sorted.map((appt) => {
            const cfg = statusConfig(appt.status);
            return (
              <div
                key={appt.id}
                className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-200 ${cfg.card}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${cfg.icon}`}>
                    <StatusIcon status={appt.status} className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h4 className="font-extrabold text-gray-900 text-base">{appt.doctor}</h4>
                      <Badge className={`normal-case tracking-normal ${cfg.badge}`}>
                        {appt.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-gray-400">
                      {appt.specialty} — <span className="text-gray-600">{appt.type}</span>
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Clock className="h-3.5 w-3.5 text-rose-400" />
                      <span>{appt.date} à {appt.time}</span>
                    </div>
                  </div>
                </div>

                {/* Actions uniquement sur les RDV Confirmés */}
                {cfg.showActions && (
                  <div className="flex items-center gap-2 mt-4 md:mt-0 self-end md:self-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleEditNextAppt(appt)}
                      className="rounded-xl border border-rose-100 bg-white px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50"
                    >
                      Modifier
                    </Button>
                    <Button
                      type="button"
                      onClick={() => openCancelModal(appt)}
                      className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                    >
                      Annuler
                    </Button>
                  </div>
                )}

                {/* Message informatif pour les RDV Refusés */}
                {appt.status === "Refusé" && (
                  <p className="mt-3 md:mt-0 text-xs text-red-500 font-medium">
                    Votre demande a été refusée. Contactez le cabinet pour plus d'informations.
                  </p>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
