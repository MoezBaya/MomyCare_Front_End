// ── FormFeedback ──────────────────────────────────────────────
// Messages erreur et succès — utilisés par Login et Register

export function FormFeedback({ errorMessage, successMessage }) {
  return (
    <>
      {errorMessage && (
        <p className="rounded-xl bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
          {successMessage}
        </p>
      )}
    </>
  );
}
