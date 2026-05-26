import logo from "@/assets/img/MomyCare-blanc.png";
import { CardHeader, CardTitle } from "@/components/ui/card";

// ─── LoginHeader ──────────────────────────────────────────────
// S : gère uniquement l'en-tête visuel

export function LoginHeader() {
  return (
    <CardHeader className="pb-0">
      <div className="mb-4 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 shadow-lg">
          <img src={logo} alt="MomyCare" className="h-14 w-14 object-contain" />
        </div>
      </div>
      <CardTitle className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-center text-2xl font-bold text-transparent">
        Mon espace
      </CardTitle>
      <p className="mt-2 text-center text-sm text-gray-500">
        Connectez-vous a votre compte
      </p>
    </CardHeader>
  );
}
