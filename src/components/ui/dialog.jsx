import { createContext, useContext } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DialogContext = createContext(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("Dialog components must be used inside Dialog.");
  }
  return context;
}

function Dialog({ open = false, onOpenChange, children }) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {open ? children : null}
    </DialogContext.Provider>
  );
}

function DialogContent({ className, children, ...props }) {
  const { onOpenChange } = useDialogContext();

  return (
    <div data-slot="dialog-portal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        data-slot="dialog-overlay"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        data-slot="dialog-content"
        className={cn(
          "relative z-10 w-full max-w-lg rounded-3xl border border-pink-100 bg-white p-6 shadow-2xl",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

function DialogHeader({ className, ...props }) {
  return <div data-slot="dialog-header" className={cn("space-y-1.5", className)} {...props} />;
}

function DialogFooter({ className, ...props }) {
  return <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;
}

function DialogTitle({ className, ...props }) {
  return <h2 data-slot="dialog-title" className={cn("text-lg font-black text-foreground", className)} {...props} />;
}

function DialogDescription({ className, ...props }) {
  return <p data-slot="dialog-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function DialogClose({ className, children, ...props }) {
  const { onOpenChange } = useDialogContext();
  return (
    <button
      type="button"
      data-slot="dialog-close"
      className={cn(
        "absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className
      )}
      onClick={() => onOpenChange?.(false)}
      {...props}
    >
      {children || <X className="h-5 w-5" />}
    </button>
  );
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
