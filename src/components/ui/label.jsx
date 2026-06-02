import { cn } from "@/lib/utils";

function Label({ className, ...props }) {
  return (
    <label
      data-slot="label"
      className={cn("text-xs font-bold uppercase tracking-wide text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Label };
