import logo from "@/assets/img/MomyCare-blanc.png";
import { CardTitle } from "@/components/ui/card";

// ── AuthHeader ────────────────────────────────────────────────
// Logo + titre + sous-titre — identiques sur Login et Register

export function AuthHeader({ title, subtitle }) {
  return (
    <>
      <div className="mb-4 flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 shadow-lg">
          <img src={logo} alt="MomyCare" className="h-14 w-14 object-contain" />
        </div>
      </div>

      <CardTitle className="bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-center text-2xl font-bold text-transparent">
        {title}
      </CardTitle>

      {subtitle && (
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
    </>
  );
}
