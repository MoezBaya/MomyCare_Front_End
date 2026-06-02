import { Search } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import PatienteGynecos from "@/components/dashboard/PatienteGynecos";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SearchDoctorModal() {
  const {
    filteredDoctors,
    searchQuery,
    setSearchQuery,
    closeSearchModal,
    selectDoctorForBooking,
    openBookModal,
    isLoadingDoctors,
  } = usePatientContext();

  const handleDoctorSelect = (doctor) => {
    selectDoctorForBooking(doctor);
    closeSearchModal();
    openBookModal();
  };

  return (
    <Dialog open onOpenChange={closeSearchModal}>
      <DialogContent className="max-w-lg space-y-4">
        <DialogClose />
        <DialogHeader className="border-b border-pink-50 pb-3">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5.5 w-5.5 text-rose-500" />
            Rechercher un Spécialiste
          </DialogTitle>
          <DialogDescription className="text-xs font-semibold">Trouvez le médecin idéal pour votre suivi.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Rechercher par nom, spécialité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl border-pink-100 py-2.5 pl-10 pr-4 font-semibold"
            />
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-400" />
          </div>

          {isLoadingDoctors ? (
            <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">Chargement des médecins...</div>
          ) : (
            <div className="max-h-[450px] overflow-y-auto pr-1">
              <PatienteGynecos doctors={filteredDoctors} onSelectDoctor={handleDoctorSelect} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
