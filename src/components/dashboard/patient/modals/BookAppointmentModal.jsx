import { usePatientContext } from "@/context/PatientContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ReservationDialog } from "@/components/agenda/ReservationDialog";

export default function BookAppointmentModal() {
  const {
    availableDoctors,
    selectedDoctorForBooking,
    closeBookModal,
    handleBookSuccess,
  } = usePatientContext();

  return (
    <Dialog open onOpenChange={closeBookModal}>
      <DialogContent className="max-w-none border-0 bg-transparent p-0 shadow-none">
        <ReservationDialog
          doctors={availableDoctors}
          defaultDoctor={selectedDoctorForBooking}
          onCancel={closeBookModal}
          onSuccess={handleBookSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
