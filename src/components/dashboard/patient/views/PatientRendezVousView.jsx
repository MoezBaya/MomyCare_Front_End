import { Calendar, PlusCircle, Clock, Check, X, RotateCw } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PatientRendezVousView() {
  const {
    appointments,
    openBookModal,
    handleEditNextAppt,
    openCancelModal,
    reloadAppointments,
    isReloading,
  } = usePatientContext();

  return (
    <Card className="animate-fade-in border-pink-100 shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b border-pink-50 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-2xl font-black text-gray-950">
            <Calendar className="h-6.5 w-6.5 text-rose-500" />
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
            <RotateCw className={`h-4.5 w-4.5 ${isReloading ? "animate-spin" : ""}`} />
            {isReloading ? "Rafraîchissement..." : "Rafraîchir"}
          </Button>
          <Button
            type="button"
            onClick={openBookModal}
            className="h-auto rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600"
          >
            <PlusCircle className="h-4.5 w-4.5" />
            Prendre nouveau rendez-vous
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6">
        {appointments.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-gray-50/20 p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 font-semibold">Aucun rendez-vous pour le moment</p>
            <p className="text-sm text-gray-500 mt-1">Cliquez sur le bouton ci-dessus pour prendre un rendez-vous</p>
          </div>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className={`flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border transition-all duration-200 ${
                appt.status === "Confirmé"
                  ? "border-rose-100 bg-rose-50/10 hover:border-rose-200 shadow-sm"
                  : "border-gray-100 bg-gray-50/20 hover:border-gray-200"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                  appt.status === "Confirmé" ? "bg-rose-50 text-rose-500" : "bg-gray-100 text-gray-400"
                }`}>
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h4 className="font-extrabold text-gray-900 text-base">{appt.doctor}</h4>
                    <Badge className={`normal-case tracking-normal ${
                      appt.status === "Confirmé"
                        ? "bg-rose-100 border-rose-200 text-rose-700"
                        : "bg-emerald-50 border-emerald-100 text-emerald-700"
                    }`}>
                      {appt.status}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-gray-400">{appt.specialty} — <span className="text-gray-600">{appt.type}</span></p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                    <Clock className="h-3.5 w-3.5 text-rose-400" />
                    <span>{appt.date} à {appt.time}</span>
                  </div>
                </div>
              </div>

              {appt.status === "Confirmé" && (
                <div className="flex items-center gap-2 mt-4 md:mt-0 self-end md:self-auto">
                  <Button
                    type="button"
                    variant="outline"
                    variant="ghost"
                    onClick={() => handleEditNextAppt(appt)}
                    className="rounded-xl border-rose-100 bg-white px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50"
                  >
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    onClick={openCancelModal}
                    className="rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
