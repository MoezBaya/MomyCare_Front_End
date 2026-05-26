import { Button } from "@/components/ui/button";
import { ROLES } from "@/constants/registerConstants";

// ─── RoleSelector ─────────────────────────────────────────────
// S : gère uniquement la sélection du rôle

export function RoleSelector({ currentRole, onRoleChange }) {
  const roles = [
    { value: ROLES.PATIENTE,    label: "Patiente" },
    { value: ROLES.GYNECOLOGUE, label: "Gynecologue" },
  ];

  return (
    <div className="mb-5 grid grid-cols-2 rounded-xl bg-rose-50 p-1">
      {roles.map(({ value, label }) => (
        <Button
          key={value}
          type="button"
          variant="ghost"
          className={
            currentRole === value
              ? "rounded-lg bg-white text-rose-600 shadow-sm hover:bg-white"
              : "rounded-lg text-gray-600 hover:bg-white/70"
          }
          onClick={() => onRoleChange(value)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
