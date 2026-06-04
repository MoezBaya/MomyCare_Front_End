import { useConsultations } from "@/hooks/useConsultations";
import { Loading, Empty, ConsultationCard, ConsultationForm } from "@/components/shared";

export const ConsultationsTab = ({ patientId }) => {
  const { consultations, loading, add } = useConsultations(patientId);
  const [showForm, setShowForm] = useState(false);

  if (loading) return <Loading />;
  if (!consultations.length) return <Empty msg="Aucune consultation" action={() => setShowForm(true)} />;

  return (
    <div>
      <Button onClick={() => setShowForm(!showForm)}>Nouvelle consultation</Button>
      {showForm && <ConsultationForm onSubmit={add} onCancel={() => setShowForm(false)} />}
      <div className="space-y-3 mt-4">
        {consultations.map(c => <ConsultationCard key={c.id} consultation={c} />)}
      </div>
    </div>
  );
};