import { Home, Calendar, CalendarDays, Clock, Users, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const menuItems = [
  { key: "accueil", label: "Accueil", icon: Home },
  { key: "agenda", label: "Agenda", icon: CalendarDays },
  { key: "rdv", label: "RDV", icon: Calendar },
  { key: "disponibilites", label: "Disponibilités", icon: Clock },
  { key: "patients", label: "Patients", icon: Users },
  { key: "parametres", label: "Paramètres", icon: Settings },
];

export default function DoctorSidebar({ activeSidebar, onSelectSidebar, onLogout, counts }) {
  return (
    <aside className="w-64 border-r border-pink-100 bg-white/90 p-4 shrink-0 h-full">
      <Card className="h-full border-pink-100 shadow-sm py-4">
        <div className="flex h-full flex-col justify-between px-3">
          <div className="space-y-8">
            <div className="text-center text-lg font-black text-rose-600">MomyCare</div>
            <nav className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const ItemIcon = item.icon;
                const isActive = activeSidebar === item.key;
                return (
                  <Button
                    key={item.key}
                    type="button"
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => onSelectSidebar(item.key)}
                    className={`h-auto w-full justify-start gap-3 rounded-2xl px-4 py-3 text-sm font-bold ${
                      isActive
                        ? "bg-rose-500 text-white hover:bg-rose-600"
                        : "text-gray-500 hover:bg-rose-50 hover:text-rose-600"
                    }`}
                  >
                    <ItemIcon className="h-5 w-5" />
                    {item.label}
                    {item.key === "rdv" && (
                      <Badge
                        variant={isActive ? "outline" : "default"}
                        className={`ml-auto ${
                          isActive
                            ? "border-white/80 bg-white text-rose-600"
                            : "border-rose-100 bg-rose-500 text-white"
                        }`}
                      >
                        {counts.waiting}
                      </Badge>
                    )}
                  </Button>
                );
              })}
            </nav>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onLogout}
            className="h-auto w-full justify-start gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </Button>
        </div>
      </Card>
    </aside>
  );
}
