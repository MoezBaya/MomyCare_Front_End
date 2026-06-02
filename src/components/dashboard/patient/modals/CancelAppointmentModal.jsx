import { AlertCircle } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function CancelAppointmentModal() {
  const { appointmentToCancel, closeCancelModal, handleCancelAppointment } = usePatientContext();

  if (!appointmentToCancel) return null;

  return (
    <Dialog open onOpenChange={closeCancelModal}>
      <DialogContent className="max-w-md space-y-4 text-center">
        <DialogClose />

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-rose-100 bg-rose-50 text-rose-500 shadow-inner">
          <AlertCircle className="h-6 w-6" />
        </div>
        <DialogHeader className="space-y-1">
          <DialogTitle>Annuler le Rendez-vous ?</DialogTitle>
          <DialogDescription className="text-xs font-semibold leading-relaxed text-gray-400">
            Êtes-vous sûre de vouloir annuler votre consultation avec{" "}
            <strong className="text-gray-700">{appointmentToCancel.doctor}</strong> prévue le{" "}
            <strong className="text-gray-700">{appointmentToCancel.date}</strong> ?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 pt-2">
          <Button
          type="button"
            onClick={() => handleCancelAppointment(appointmentToCancel.id)}
            className="flex-1 bg-rose-500 text-sm font-extrabold text-white hover:bg-rose-600"
        >
            Confirmer l'annulation
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={closeCancelModal}
            className="flex-1 border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50"
          >
            Garder le RDV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
