import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function Feedback({ msg }) {
  if (!msg) return null;
  const ok = msg.includes("succès") || msg.includes("enregistr") || msg.includes("créé");
  return (
    <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
      ok ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
    }`}>
      {ok ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
      {msg}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
    </div>
  );
}

export function Empty({ msg }) {
  return <div className="rounded-2xl border border-pink-100 bg-rose-50/10 p-8 text-center text-sm text-gray-500">{msg}</div>;
}

export function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-pink-100 px-3 py-2.5 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-200"
      />
    </div>
  );
}
