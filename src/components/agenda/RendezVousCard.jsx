import { Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function statusVariant(status) {
  if (status === "Confirmé") return "bg-emerald-100 text-emerald-700";
  if (status === "Refusé") return "bg-rose-100 text-rose-700";
  if (status === "Terminé") return "bg-slate-100 text-slate-700";
  if (status === "Annulé") return "bg-pink-50 text-pink-700";
  return "bg-amber-100 text-amber-700";
}

export function RendezVousCard({ appointment, onConfirm, onCancel }) {
  return (
    <Card className="rounded-3xl border border-pink-100 shadow-sm">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-black text-gray-900">{appointment.patient}</CardTitle>
          <p className="text-sm text-gray-500">{appointment.type}</p>
        </div>
        <Badge className={`rounded-full py-2 px-3 text-xs font-semibold ${statusVariant(appointment.status)}`}>
          {appointment.status}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-rose-500" />
            <span>{appointment.date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4 text-rose-500" />
            <span>{appointment.time}</span>
          </div>
          <p className="text-sm text-gray-500">Gynécologue : {appointment.doctor}</p>
        </div>

        <div className="grid gap-2">
          {onConfirm ? (
            <Button type="button" variant="secondary" size="sm" onClick={() => onConfirm(appointment.id)}>
              <CheckCircle2 className="mr-2 h-4 w-4" /> Confirmer
            </Button>
          ) : null}
          {onCancel ? (
            <Button type="button" variant="outline" size="sm" onClick={() => onCancel(appointment.id)}>
              <XCircle className="mr-2 h-4 w-4" /> Refuser
            </Button>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
