import { useState } from "react";
import { Heart, Calendar, FolderHeart, User, LogOut, Menu } from "lucide-react";
import MomyCareLogo from "@/components/shared/MomyCareLogo";
import { usePatientContext } from "@/context/PatientContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const patientTabs = [
  { key: "accueil", label: "Accueil", icon: Heart },
  { key: "rdv", label: "Mes RDV", icon: Calendar },
  { key: "dossier", label: "Mon Dossier", icon: FolderHeart },
  { key: "profil", label: "Profil", icon: User },
];

export default function PatientHeader() {
  const { activeTab, setActiveTab, onLogout } = usePatientContext();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-pink-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <MomyCareLogo size="md" variant="row" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block">
          <TabsList className="bg-rose-50">
            {patientTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.key} value={tab.key} className="rounded-lg data-[state=active]:bg-white">
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowMobileMenu(true)}
            className="md:hidden rounded-xl border border-pink-100 text-gray-500"
            title="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            onClick={onLogout}
            className="h-10 w-10 rounded-xl border border-rose-100 bg-rose-50/50 text-rose-500 shadow-sm hover:bg-rose-50 hover:text-rose-600"
            title="Se déconnecter"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetContent side="left" className="border-r border-pink-100">
          <SheetHeader>
            <SheetTitle className="text-rose-600">Navigation</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-2">
            {patientTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <Button
                  key={tab.key}
                  type="button"
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setShowMobileMenu(false);
                  }}
                  className={`h-auto justify-start gap-3 rounded-xl px-4 py-3 ${
                    isActive
                      ? "bg-rose-500 text-white hover:bg-rose-600"
                      : "text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
