import { Bell, LogOut } from "lucide-react";
import MomyCareLogo from "@/components/shared/MomyCareLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function DoctorHeader({
  activeHeaderTab,
  setActiveHeaderTab,
  setActiveSidebar,
  onLogout,
  showNotifications,
  setShowNotifications,
  notifications,
  docName,
}) {
  const handleTabChange = (tabValue) => {
    setActiveHeaderTab(tabValue);
    if (tabValue === "rdv") setActiveSidebar("rdv");
  };
  return (
    <header className="h-20 border-b border-pink-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0 z-20">
      <div className="flex items-center gap-6">
        <MomyCareLogo size="md" variant="col" className="py-2" />
        <Tabs value={activeHeaderTab} onValueChange={handleTabChange}>
          <TabsList className="bg-rose-50">
            <TabsTrigger value="tableau" className="rounded-lg data-[state=active]:bg-white">
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger value="rdv" className="rounded-lg data-[state=active]:bg-white">
              Rendez-vous
            </TabsTrigger>
            <TabsTrigger value="profil" className="rounded-lg data-[state=active]:bg-white">
              Profil
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="rounded-xl border border-gray-100 text-gray-500 hover:text-gray-700"
          >
            <Bell className="h-5 w-5" />
            {!!notifications.length && (
              <Badge className="absolute -right-1 -top-1 border-white bg-rose-500 text-white">
                {notifications.length}
              </Badge>
            )}
          </Button>

          {showNotifications && (
            <Card className="absolute right-0 z-50 mt-2 w-80 border-pink-100 py-4 shadow-xl">
              <CardContent className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase">Notifications</h4>
                <div className="max-h-60 space-y-2 overflow-y-auto">
                  {notifications.length ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className="space-y-1 rounded-xl border border-rose-50/50 bg-rose-50/20 p-2.5 text-xs font-medium text-gray-700">
                        <p>{notif.text}</p>
                        <span className="block text-[10px] font-bold text-gray-400">{notif.time}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-semibold text-gray-400">Aucune notification.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex items-center gap-3 pl-2 border-l border-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500 text-white font-bold text-sm shadow-md">
            Dr
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-black text-gray-900">Dr. {docName}</p>
            <p className="text-[10px] font-bold text-gray-400">Médecin Gynécologue</p>
          </div>
          <Button
            type="button"
            onClick={onLogout}
            className="rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600"
            title="Se déconnecter"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
