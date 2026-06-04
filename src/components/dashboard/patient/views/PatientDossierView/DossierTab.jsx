import { useDossier } from "@/hooks/useDossier";
import { Loading, Feedback, Field } from "@/components/shared";

export const DossierTab = ({ patientId }) => {
  const { dossier, loading, error, save } = useDossier(patientId);
  const [form, setForm] = useState({ antecedents: "", allergies: "", traitementsEnCours: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (dossier) setForm({
      antecedents: dossier.antecedents || "",
      allergies: dossier.allergies || "",
      traitementsEnCours: dossier.traitementsEnCours || "",
      notes: dossier.notes || "",
    });
  }, [dossier]);

  const handleSave = async () => {
    setSaving(true);
    const res = await save(form);
    if (res.success) setMsg("Dossier mis à jour.");
    else setMsg("Erreur lors de la sauvegarde.");
    setSaving(false);
  };

  if (loading) return <Loading />;
  if (error) return <Feedback type="error" msg="Impossible de charger le dossier." />;

  return (
    <div className="space-y-4">
      <Feedback msg={msg} />
      {Object.keys(form).map(key => (
        <Field key={key} label={key} value={form[key]} onChange={v => setForm(f => ({ ...f, [key]: v }))} multiline />
      ))}
      <Button onClick={handleSave} disabled={saving}>{saving ? "Enregistrement..." : "Sauvegarder"}</Button>
    </div>
  );
};