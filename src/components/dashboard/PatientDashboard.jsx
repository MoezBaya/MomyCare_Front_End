import { PatientProvider } from "@/context/PatientContext";
import { usePatientDashboard } from "@/hooks/usePatientDashboard";
import PatientHeader from "@/components/dashboard/PatientHeader";
import PatientHomeView from "@/components/dashboard/PatientHomeView";
import PatientFile from "@/components/dashboard/PatientFile";
import PatientRendezVousView from "@/components/dashboard/patient/views/PatientRendezVousView";
import PatientProfilView from "@/components/dashboard/patient/views/PatientProfilView";
import BookAppointmentModal from "@/components/dashboard/patient/modals/BookAppointmentModal";
import SearchDoctorModal from "@/components/dashboard/patient/modals/SearchDoctorModal";
import CancelAppointmentModal from "@/components/dashboard/patient/modals/CancelAppointmentModal";
import EditProfileModal from "@/components/dashboard/patient/modals/EditProfileModal";

export default function PatientDashboard({ user, onLogout }) {
  const dashboard = usePatientDashboard(user);
  const {
    activeTab,
    isLoadingData,
    showBookModal,
    showEditProfileModal,
    showCancelModal,
    showSearchModal,
  } = dashboard;

  const viewRegistry = {
    accueil: <PatientHomeView />,
    rdv: <PatientRendezVousView />,
    dossier: <PatientFile />,
    profil: <PatientProfilView />,
  };

  return (
    <PatientProvider value={{ ...dashboard, user, onLogout }}>
      <div className="min-h-screen bg-[#fcf8fa] font-sans antialiased text-gray-800 selection:bg-rose-500 selection:text-white">
        <PatientHeader />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {isLoadingData && (
            <p className="mb-4 text-xs font-semibold text-rose-500">Chargement des donnees...</p>
          )}

          {viewRegistry[activeTab] || viewRegistry.accueil}
        </main>

        {showBookModal && <BookAppointmentModal />}
        {showSearchModal && <SearchDoctorModal />}
        {showEditProfileModal && <EditProfileModal />}
        {showCancelModal && <CancelAppointmentModal />}
      </div>
    </PatientProvider>
  );
}
