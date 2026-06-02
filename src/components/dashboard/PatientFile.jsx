import { useEffect, useState } from "react";
import { FolderHeart, CalendarDays, FileText, HeartPulse, ClipboardList, Info } from "lucide-react";
import {
  fetchPatientDossier,
  fetchPatientConsultations,
  fetchConsultationAnalyses,
  fetchConsultationImageries,
  fetchPatientPrescriptions,
} from "@/services/dashboardService";
import GeneralInfo from "./GeneralInfo";
import Consultations from "./Consultations";
import Analyses from "./Analyses";
import Imageries from "./Imageries";
import Prescriptions from "./Prescriptions";
import { usePatientContext } from "@/context/PatientContext";

const TABS = [
  { key: "general",       label: "Général",       icon: FolderHeart   },
  { key: "consultations", label: "Consultations", icon: CalendarDays  },
  { key: "analyses",      label: "Analyses",      icon: FileText      },
  { key: "imageries",     label: "Imageries",     icon: ClipboardList },
  { key: "prescriptions", label: "Ordonnances",   icon: HeartPulse    },
];

export default function PatientFile() {
  const { user } = usePatientContext();

  const [activeTab,              setActiveTab]              = useState("general");
  const [dossier,                setDossier]                = useState(null);
  const [dossierNotFound,        setDossierNotFound]        = useState(false);
  const [consultations,          setConsultations]          = useState([]);
  const [selectedConsultationId, setSelectedConsultationId] = useState(null);
  const [analyses,               setAnalyses]               = useState([]);
  const [imageries,              setImageries]              = useState([]);
  const [prescriptions,          setPrescriptions]          = useState([]);
  const [isLoading,              setIsLoading]              = useState(false);

  // Chargement initial — pas besoin de passer user (JWT suffit)
  useEffect(() => {
    let isMounted = true;
    async function loadFile() {
      setIsLoading(true);
      try {
        const [dossierData, consultationsData, prescriptionsData] = await Promise.allSettled([
          fetchPatientDossier(),
          fetchPatientConsultations(),
          fetchPatientPrescriptions(),
        ]);

        if (!isMounted) return;

        // Dossier — gérer le cas 404 (pas encore créé par le médecin)
        if (dossierData.status === "fulfilled") {
          setDossier(dossierData.value);
          setDossierNotFound(false);
        } else {
          const status = dossierData.reason?.response?.status;
          setDossierNotFound(status === 404 || !status);
          setDossier(null);
        }

        const consults = consultationsData.status === "fulfilled"
          ? (consultationsData.value || []) : [];
        setConsultations(consults);
        setSelectedConsultationId(consults[0]?.id || null);

        setPrescriptions(
          prescriptionsData.status === "fulfilled" ? (prescriptionsData.value || []) : []
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadFile();
    return () => { isMounted = false; };
  }, [user]);

  // Chargement analyses / imageries quand la consultation sélectionnée change
  useEffect(() => {
    if (!selectedConsultationId) { setAnalyses([]); setImageries([]); return; }
    let isMounted = true;
    Promise.allSettled([
      fetchConsultationAnalyses(selectedConsultationId),
      fetchConsultationImageries(selectedConsultationId),
    ]).then(([a, im]) => {
      if (!isMounted) return;
      setAnalyses(a.status === "fulfilled" ? a.value : []);
      setImageries(im.status === "fulfilled" ? im.value : []);
    });
    return () => { isMounted = false; };
  }, [selectedConsultationId]);

  const selectedConsultation =
    consultations.find((c) => c.id === selectedConsultationId) || consultations[0] || null;

  return (
    <section className="bg-white rounded-3xl border border-pink-100 p-6 shadow-sm animate-fade-in">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between border-b border-pink-50 pb-6 mb-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-600">Dossier</p>
          <h2 className="text-3xl font-black text-gray-950 flex items-center gap-3">
            <FolderHeart className="h-7 w-7 text-rose-500" />
            Mon dossier médical
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Toutes vos informations médicales rassemblées en un seul endroit.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-4 rounded-3xl border border-pink-100 bg-rose-50/10 p-5">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-4 text-left transition-all ${
                activeTab === key
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-gray-600 hover:bg-white/90"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </aside>

        <div className="space-y-6">
          {isLoading ? (
            <div className="rounded-3xl border border-pink-100 bg-rose-50/10 p-6 text-center text-sm text-gray-500">
              Chargement du dossier patient...
            </div>
          ) : (
            <>
              {activeTab === "general" && (
                dossierNotFound ? (
                  <div className="flex flex-col items-center gap-4 rounded-3xl border border-amber-100 bg-amber-50/30 p-10 text-center">
                    <Info className="h-10 w-10 text-amber-400" />
                    <div>
                      <p className="font-extrabold text-gray-800">Dossier médical non encore créé</p>
                      <p className="mt-1 text-sm text-gray-500">
                        Votre gynécologue n'a pas encore ouvert votre dossier médical.
                        Contactez-le lors de votre prochain rendez-vous.
                      </p>
                    </div>
                  </div>
                ) : (
                  <GeneralInfo dossier={dossier} user={user} />
                )
              )}
              {activeTab === "consultations" && (
                <Consultations
                  consultations={consultations}
                  selectedId={selectedConsultationId}
                  onSelect={setSelectedConsultationId}
                />
              )}
              {activeTab === "analyses" && (
                <Analyses analyses={analyses} consultation={selectedConsultation} />
              )}
              {activeTab === "imageries" && (
                <Imageries imageries={imageries} consultation={selectedConsultation} />
              )}
              {activeTab === "prescriptions" && (
                <Prescriptions prescriptions={prescriptions} isDoctor={false} />
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
