import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ── SubmitButton ──────────────────────────────────────────────
// Bouton submit avec état loading — utilisé par Login et Register

export function SubmitButton({ isSubmitting, label, loadingLabel, className }) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={cn(
        "w-full rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 py-2 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:from-rose-600 hover:to-pink-700",
        className
      )}
    >
      {isSubmitting ? loadingLabel : label}
    </Button>
  );
}
