import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const TabsContext = createContext(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used inside Tabs.");
  }
  return context;
}

function Tabs({ value, onValueChange, className, ...props }) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div data-slot="tabs" className={cn("w-full", className)} {...props} />
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }) {
  return (
    <div
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-auto items-center gap-1 rounded-xl bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({ className, value, ...props }) {
  const { value: currentValue, onValueChange } = useTabsContext();
  const isActive = currentValue === value;

  return (
    <button
      type="button"
      data-slot="tabs-trigger"
      data-state={isActive ? "active" : "inactive"}
      className={cn(
        "inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold transition-all",
        "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        "data-[state=inactive]:text-muted-foreground hover:data-[state=inactive]:text-foreground",
        className
      )}
      onClick={() => onValueChange?.(value)}
      {...props}
    />
  );
}

function TabsContent({ className, value, ...props }) {
  const { value: currentValue } = useTabsContext();
  if (currentValue !== value) return null;

  return <div data-slot="tabs-content" className={cn("mt-4", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
