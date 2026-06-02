import { Edit3, User } from "lucide-react";
import { usePatientContext } from "@/context/PatientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PatientProfilView() {
  const { profile, openEditProfileModal } = usePatientContext();

  return (
    <Card className="mx-auto max-w-2xl animate-fade-in border-pink-100 shadow-sm">
      <CardHeader className="border-b border-pink-50 pb-4 text-center">
        <CardTitle className="text-2xl font-black text-gray-950">Mes informations personnelles</CardTitle>
        <p className="mt-1 text-sm font-medium text-gray-400">
          Vérifiez ou mettez à jour vos informations de contact et de suivi.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 text-sm font-semibold text-gray-600">
          <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
            <Badge variant="outline" className="normal-case tracking-normal text-gray-500">Nom complet</Badge>
            <p className="font-bold text-gray-950">{profile.nom}</p>
          </div>
          <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
            <Badge variant="outline" className="normal-case tracking-normal text-gray-500">Matricule</Badge>
            <p className="font-bold text-gray-950">{profile.matricule}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
              <Badge variant="outline" className="normal-case tracking-normal text-gray-500">Téléphone</Badge>
              <p className="font-bold text-gray-950">{profile.phone}</p>
            </div>
            <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
              <Badge variant="outline" className="normal-case tracking-normal text-gray-500">Adresse Email</Badge>
              <p className="font-bold text-gray-950">{profile.email}</p>
            </div>
          </div>
          <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
            <Badge variant="outline" className="normal-case tracking-normal text-gray-500">Adresse de résidence</Badge>
            <p className="font-bold text-gray-950">{profile.adresse}</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
              <Badge variant="outline" className="normal-case tracking-normal text-gray-500">Semaine de grossesse</Badge>
              <p className="font-bold text-gray-950">{profile.weekOfPregnancy}</p>
            </div>
            <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
              <Badge variant="outline" className="normal-case tracking-normal text-gray-500">Groupe sanguin</Badge>
              <p className="font-bold text-gray-950">{profile.bloodType}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
          type="button"
          onClick={openEditProfileModal}
            className="rounded-2xl bg-rose-500 px-6 py-3 text-sm font-extrabold text-white shadow-md hover:bg-rose-600"
          >
            <Edit3 className="h-4 w-4" />
            Modifier mon profil
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
