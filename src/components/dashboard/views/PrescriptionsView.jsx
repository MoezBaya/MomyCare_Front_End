import Prescriptions from "@/components/dashboard/Prescriptions";

export default function PrescriptionsView({ prescriptions, patients, onSavePrescription }) {
  return (
    <section className="animate-fade-in">
      <Prescriptions
        prescriptions={prescriptions}
        patients={patients}
        isDoctor={true}
        onSavePrescription={onSavePrescription}
      />
    </section>
  );
}
