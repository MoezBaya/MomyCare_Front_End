// src/components/dashboard/PatientDashboard.jsx
import { useState } from "react";
import MomyCareLogo from "@/components/shared/MomyCareLogo";
import { Calendar, Home, FileText, User, LogOut, Heart, Menu, X, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PatientProvider } from "@/context/PatientContext";
import { usePatientDashboard } from "@/hooks/usePatientDashboard";
import PatientHomeView from "./PatientHomeView";
import PatientRendezVousView from "./patient/views/PatientRendezVousView";
import PatientProfilView from "./patient/views/PatientProfilView";
import BookAppointmentModal from "./patient/modals/BookAppointmentModal";
import SearchDoctorModal from "./patient/modals/SearchDoctorModal";
import EditProfileModal from "./patient/modals/EditProfileModal";
import CancelAppointmentModal from "./patient/modals/CancelAppointmentModal";
import MonGynecologue from "./patient/views/MonGynecologue";
import PatientFullFile from "./patient/views/PatientFullFile";

export default function PatientDashboard({ user, onLogout }) {
  const dashboard = usePatientDashboard(user, onLogout);
  const {
    activeTab,
    setActiveTab,
    showBookModal,
    showSearchModal,
    showEditProfileModal,
    showCancelModal,
  } = dashboard;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "rdv", label: "Mes rendez-vous", icon: Calendar },
    { id: "dossier", label: "Mon dossier médical", icon: FileText },
    { id: "gyneco", label: "Mon gynécologue", icon: Stethoscope },
    { id: "profil", label: "Mon profil", icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "accueil":
        return <PatientHomeView />;
      case "rdv":
        return <PatientRendezVousView />;
      case "dossier":
        return <PatientFullFile />;   // ← composant dynamique
      case "profil":
        return <PatientProfilView />;
      case "gyneco":
        return <MonGynecologue />;
      default:
        return <PatientHomeView />;
    }
  };

  return (
    <PatientProvider value={dashboard}>
      <div className="flex h-screen bg-[#fcf8fa] overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden md:flex md:w-64 flex-col border-r border-pink-100 bg-white shadow-sm">
          <div className="p-5 border-b border-pink-50">
            <div className="flex items-center gap-2 text-rose-600">
              <MomyCareLogo size="md" variant="col" className="py-2" />
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-rose-50 text-rose-600"
                    : "text-gray-600 hover:bg-rose-50/50 hover:text-rose-500"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-pink-50">
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-rose-50/50 hover:text-rose-500"
            >
              <LogOut className="h-5 w-5" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Bouton menu mobile */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl animate-slide-in">
              <div className="flex justify-end p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4 border-b border-pink-50">
                <div className="flex items-center gap-2 text-rose-600">
                  <Heart className="h-6 w-6 fill-rose-100" />
                  <span className="text-xl font-bold">MomyCare</span>
                </div>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium ${
                      activeTab === item.id
                        ? "bg-rose-50 text-rose-600"
                        : "text-gray-600 hover:bg-rose-50/50"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-rose-50/50"
                >
                  <LogOut className="h-5 w-5" />
                  Déconnexion
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Contenu principal */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{renderContent()}</main>
      </div>

      {/* Modals */}
      {showBookModal && <BookAppointmentModal />}
      {showSearchModal && <SearchDoctorModal />}
      {showEditProfileModal && <EditProfileModal />}
      {showCancelModal && <CancelAppointmentModal />}
    </PatientProvider>
  );
}