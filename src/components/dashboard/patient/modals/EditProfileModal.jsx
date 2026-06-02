import { usePatientContext } from "@/context/PatientContext";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditProfileModal() {
  const {
    editProfileForm,
    setEditProfileForm,
    handleSaveProfile,
    closeEditProfileModal,
  } = usePatientContext();

  return (
    <Dialog open onOpenChange={closeEditProfileModal}>
      <DialogContent className="max-w-lg space-y-4">
        <DialogClose />
        <DialogHeader className="border-b border-pink-50 pb-3">
          <DialogTitle className="text-xl">Modifier mon profil</DialogTitle>
          <DialogDescription className="text-xs font-semibold">
            Mettez à jour vos coordonnées de contact et votre adresse.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSaveProfile(editProfileForm);
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="edit-name">Nom complet</Label>
              <Input
                id="edit-name"
                type="text"
                required
                value={editProfileForm.nom}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, nom: e.target.value })}
                className="h-11 rounded-xl border-pink-100 px-3.5"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="edit-phone">Téléphone</Label>
              <Input
                id="edit-phone"
                type="text"
                required
                value={editProfileForm.phone}
                onChange={(e) => setEditProfileForm({ ...editProfileForm, phone: e.target.value })}
                className="h-11 rounded-xl border-pink-100 px-3.5"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-email">Adresse Email</Label>
            <Input
              id="edit-email"
              type="email"
              required
              value={editProfileForm.email}
              onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
              className="h-11 rounded-xl border-pink-100 px-3.5"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="edit-address">Adresse de résidence</Label>
            <Input
              id="edit-address"
              type="text"
              required
              value={editProfileForm.adresse}
              onChange={(e) => setEditProfileForm({ ...editProfileForm, adresse: e.target.value })}
              className="h-11 rounded-xl border-pink-100 px-3.5"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 h-auto rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 py-3.5 text-sm font-extrabold text-white hover:from-rose-600 hover:to-pink-600"
            >
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeEditProfileModal}
              className="flex-1 h-auto rounded-2xl border-gray-200 py-3.5 text-sm font-bold text-gray-500 hover:bg-gray-50"
            >
              Fermer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
