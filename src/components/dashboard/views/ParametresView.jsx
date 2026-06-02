import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
export default function ParametresView({ doctorProfile }) {
  return (
    <Card className="mx-auto max-w-3xl animate-fade-in border-pink-100 shadow-sm">
      <CardHeader className="border-b border-pink-50 pb-4 text-center">
        <CardTitle className="text-2xl font-black text-gray-950">Profil Professionnel & Réglages</CardTitle>
        <p className="mt-1 text-sm font-medium text-gray-400">Gérez vos préférences de cabinet et vos coordonnées.</p>
      </CardHeader>

      <CardContent className="space-y-4 text-sm font-semibold text-gray-600">
        <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
          <Badge variant="outline" className="normal-case tracking-normal text-gray-500">
            Nom et Titre
          </Badge>
          <p className="font-bold text-gray-950">Dr. {doctorProfile.nom}</p>
        </div>
        <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
          <Badge variant="outline" className="normal-case tracking-normal text-gray-500">
            Spécialité
          </Badge>
          <p className="font-bold text-gray-950">{doctorProfile.specialty}</p>
        </div>
        <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
          <Badge variant="outline" className="normal-case tracking-normal text-gray-500">
            Adresse du cabinet
          </Badge>
          <p className="font-bold text-gray-950">{doctorProfile.adresse || "--"}</p>
        </div>
        <div className="space-y-1 rounded-xl border border-pink-50 bg-rose-50/10 p-4">
          <Badge variant="outline" className="normal-case tracking-normal text-gray-500">
            Téléphone Pro
          </Badge>
          <p className="font-bold text-gray-950">{doctorProfile.phone || "--"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
