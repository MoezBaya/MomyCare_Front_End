import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  Loader2,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  Image,
  Calendar,
  Pill,
  Microscope,
  Camera,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";

export default function PatientFullFile() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [details, setDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      setError(null);
      const res = await api.get("/api/consultations/mes-consultations");
      let consults = res.data?.body ?? res.data ?? [];
      setConsultations(Array.isArray(consults) ? consults : []);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger vos consultations.");
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (consultationId) => {
    if (details[consultationId]) return;

    setLoadingDetails((prev) => ({ ...prev, [consultationId]: true }));
    try {
      const [ordonnancesRes, analysesRes, imageriesRes] = await Promise.all([
        api.get(`/api/consultations/${consultationId}/ordonnances`),
        api.get(`/api/consultations/${consultationId}/analyses`),
        api.get(`/api/consultations/${consultationId}/imageries`),
      ]);

      setDetails((prev) => ({
        ...prev,
        [consultationId]: {
          ordonnances: ordonnancesRes.data?.body ?? ordonnancesRes.data ?? [],
          analyses: analysesRes.data?.body ?? analysesRes.data ?? [],
          imageries: imageriesRes.data?.body ?? imageriesRes.data ?? [],
        },
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [consultationId]: false }));
    }
  };

  const toggleExpand = (id) => {
    const newId = expandedId === id ? null : id;
    setExpandedId(newId);
    if (newId) loadDetails(newId);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-rose-500" />
        <p className="mt-4 text-gray-500">Chargement de votre dossier médical...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-600">{error}</p>
        <button onClick={loadConsultations} className="mt-4 text-rose-600 underline">
          Réessayer
        </button>
      </div>
    );
  }

  if (consultations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-12 text-center border border-pink-100">
        <Calendar className="h-16 w-16 text-rose-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800">Aucune consultation</h3>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          Vous n'avez pas encore de consultation. Prenez rendez-vous avec un gynécologue pour débuter votre suivi.
        </p>
        <button
          onClick={() => (window.location.href = "/recherche-gyneco")}
          className="mt-6 inline-flex items-center gap-2 bg-rose-500 text-white px-6 py-2.5 rounded-xl hover:bg-rose-600 transition"
        >
          <Calendar className="h-4 w-4" />
          Prendre rendez-vous
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">Mon dossier médical</h1>
        <p className="text-rose-100 mt-1">
          {consultations.length} consultation{consultations.length > 1 ? "s" : ""} enregistrée
          {consultations.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Liste scrollable */}
      <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
        {consultations.map((consult) => (
          <ConsultationCard
            key={consult.id} // ✅ clé unique
            consultation={consult}
            expanded={expandedId === consult.id}
            onToggle={() => toggleExpand(consult.id)}
            details={details[consult.id]}
            loadingDetails={loadingDetails[consult.id]}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- Sous-composants ----------
function ConsultationCard({ consultation, expanded, onToggle, details, loadingDetails }) {
  const dateFormatted = consultation.date
    ? new Date(consultation.date).toLocaleDateString("fr-FR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Date inconnue";

  const timeFormatted = consultation.date
    ? new Date(consultation.date).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all hover:shadow-lg">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-start gap-4">
          <div className="bg-rose-100 rounded-full p-3 text-rose-600">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              Consultation du {dateFormatted}
            </h3>
            {timeFormatted && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{timeFormatted}</span>
              </div>
            )}
            {consultation.type && (
              <span className="inline-block mt-2 text-xs font-medium bg-gray-100 text-gray-700 rounded-full px-3 py-1">
                {consultation.type}
              </span>
            )}
          </div>
        </div>
        <div className="text-rose-500">
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-5 bg-gray-50/30 space-y-6">
          {loadingDetails ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
            </div>
          ) : (
            details && (
              <>
                <Section
                  title="Ordonnances"
                  icon={FileText}
                  items={details.ordonnances}
                  emptyMessage="Aucune ordonnance prescrite"
                  renderItem={(ord) => <OrdonnanceItem key={ord.idOrdonance || ord.id} ord={ord} />}
                />
                <Section
                  title="Analyses"
                  icon={Microscope}
                  items={details.analyses}
                  emptyMessage="Aucune analyse disponible"
                  renderItem={(ana) => <AnalyseItem key={ana.id} analyse={ana} />}
                />
                <Section
                  title="Imageries"
                  icon={Camera}
                  items={details.imageries}
                  emptyMessage="Aucune image médicale"
                  renderItem={(img) => <ImagerieItem key={img.id} image={img} />}
                />
              </>
            )
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, icon: Icon, items, emptyMessage, renderItem }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-rose-100 rounded-full p-1.5 text-rose-600">
          <Icon className="h-4 w-4" />
        </div>
        <h4 className="text-sm font-bold uppercase tracking-wide text-gray-500">{title}</h4>
        {items.length > 0 && (
          <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5">
            {items.length}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm border border-dashed border-gray-200">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-3">{items.map(renderItem)}</div>
      )}
    </div>
  );
}

function OrdonnanceItem({ ord }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-gray-800">Ordonnance n° {ord.numOrdonance || ord.id}</p>
          {ord.date && (
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(ord.date).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
        <button className="text-rose-500 hover:text-rose-700 p-1 rounded-full hover:bg-rose-50 transition">
          <Eye className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 space-y-2">
        {(ord.lignes || []).map((ligne, idx) => (
          <div key={idx} className="flex items-start gap-2 text-sm">
            <Pill className="h-4 w-4 text-rose-500 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-medium text-gray-700">{ligne.nomMedicament}</span>
              <span className="text-gray-500 ml-2">{ligne.dose}</span>
              <div className="text-xs text-gray-400">{ligne.frequence}</div>
              {ligne.instructions && (
                <div className="text-xs text-rose-600 italic mt-1">{ligne.instructions}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyseItem({ analyse }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">{analyse.typeAnalyse || "Analyse biologique"}</p>
          {analyse.dateAnalyse && (
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(analyse.dateAnalyse).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
        {analyse.fichierNom && (
          <button className="text-rose-500 hover:text-rose-700 p-1 rounded-full hover:bg-rose-50 transition">
            <Eye className="h-4 w-4" />
          </button>
        )}
      </div>
      {analyse.resultats && (
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{analyse.resultats}</p>
      )}
      {analyse.fichierNom && (
        <div className="mt-2 text-xs text-rose-600 flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span>{analyse.fichierNom}</span>
        </div>
      )}
    </div>
  );
}

function ImagerieItem({ image }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-gray-800">{image.typeImagerie || "Examen d'imagerie"}</p>
          {image.dateImagerie && (
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date(image.dateImagerie).toLocaleDateString("fr-FR")}
            </p>
          )}
        </div>
        {image.fichierNom && (
          <button className="text-rose-500 hover:text-rose-700 p-1 rounded-full hover:bg-rose-50 transition">
            <Eye className="h-4 w-4" />
          </button>
        )}
      </div>
      {image.commentaire && <p className="text-sm text-gray-600 mt-2">{image.commentaire}</p>}
      {image.fichierNom && (
        <div className="mt-2 text-xs text-rose-600 flex items-center gap-1">
          <FileText className="h-3 w-3" />
          <span>{image.fichierNom}</span>
        </div>
      )}
    </div>
  );
}