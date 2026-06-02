import { createContext, useContext } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const SheetContext = createContext(null);

function useSheetContext() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet components must be used inside Sheet.");
  }
  return context;
}

function Sheet({ open = false, onOpenChange, children }) {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {open ? children : null}
    </SheetContext.Provider>
  );
}

const sideClasses = {
  left: "left-0 top-0 h-full w-[85%] max-w-sm rounded-r-3xl",
  right: "right-0 top-0 h-full w-[85%] max-w-sm rounded-l-3xl",
  top: "left-0 top-0 w-full rounded-b-3xl",
  bottom: "bottom-0 left-0 w-full rounded-t-3xl",
};

function SheetContent({ side = "left", className, children, ...props }) {
  const { onOpenChange } = useSheetContext();

  return (
    <div data-slot="sheet-portal" className="fixed inset-0 z-50">
      <div
        data-slot="sheet-overlay"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
        onClick={() => onOpenChange?.(false)}
      />
      <div
        data-slot="sheet-content"
        className={cn(
          "absolute z-10 border border-pink-100 bg-white p-5 shadow-2xl",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}

function SheetHeader({ className, ...props }) {
  return <div data-slot="sheet-header" className={cn("space-y-1.5", className)} {...props} />;
}

function SheetTitle({ className, ...props }) {
  return <h2 data-slot="sheet-title" className={cn("text-lg font-black text-foreground", className)} {...props} />;
}

function SheetDescription({ className, ...props }) {
  return <p data-slot="sheet-description" className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

function SheetClose({ className, children, ...props }) {
  const { onOpenChange } = useSheetContext();
  return (
    <button
      type="button"
      data-slot="sheet-close"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
};
