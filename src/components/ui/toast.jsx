import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const variantClasses = {
  success: "bg-emerald-600 text-white",
  error: "bg-rose-600 text-white",
  info: "bg-slate-900 text-white",
};

export function Toast({ id, message, variant = "success", onDismiss }) {
  return (
    <div className={cn("group flex items-center justify-between gap-4 rounded-3xl px-4 py-3 shadow-lg shadow-slate-200/20", variantClasses[variant])}>
      <div className="flex-1 text-sm font-semibold">{message}</div>
      <button type="button" aria-label="Fermer" onClick={() => onDismiss(id)} className="rounded-full p-1 text-white/80 transition hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export function ToastViewport({ toasts = [], onDismiss }) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[1000] flex w-full max-w-sm flex-col gap-3 px-4">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
