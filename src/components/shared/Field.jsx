// ── Field ─────────────────────────────────────────────────────
// Wrapper label + input — utilisé par Login et Register

export function Field({ label, children }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}
