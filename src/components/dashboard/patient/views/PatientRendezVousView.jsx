// src/components/dashboard/patient/views/PatientRendezVousView.jsx
import { useState, useEffect } from "react";
import { Calendar, User, MapPin, Briefcase, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePatientContext } from "@/context/PatientContext";
import { fetchAvailableGynecos } from "@/services/patientService";

export default function PatientRendezVousView() {
  const { appointments, openBookModal, selectDoctorForBooking } = usePatientContext();

  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger la liste des gynécologues depuis l'API
  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      try {
        const data = await fetchAvailableGynecos();
        setDoctors(data);
        if (data.length > 0) setSelectedDoctorId(data[0].id.toString());
      } catch (error) {
        console.error("Erreur chargement médecins", error);
      } finally {
        setLoading(false);
      }
    };
    loadDoctors();
  }, []);

  const selectedDoctor = doctors.find(d => d.id.toString() === selectedDoctorId);

  const handleBook = () => {
    if (selectedDoctor) {
      selectDoctorForBooking(selectedDoctor);
      openBookModal();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-rose-100 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <Calendar className="h-5 w-5 text-rose-500" />
            Prendre rendez-vous
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Sélecteur du gynécologue */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Choisir un gynécologue
            </label>
            {loading ? (
              <p>Chargement...</p>
            ) : (
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full rounded-xl border border-pink-100 bg-white px-4 py-3 text-sm"
              >
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Affichage du médecin sélectionné */}
          {selectedDoctor && (
            <div className="mt-4 p-4 rounded-2xl border border-rose-100 bg-rose-50/30">
              <div className="flex flex-wrap gap-4 items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-rose-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{selectedDoctor.name}</h3>
                    <p className="text-sm text-rose-600">{selectedDoctor.specialty}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {selectedDoctor.hospital}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {selectedDoctor.experience}</span>
                      <span className="flex items-center gap-1 text-amber-500"><Star className="h-3 w-3 fill-current" /> {selectedDoctor.rating}</span>
                    </div>
                  </div>
                </div>
                <Button onClick={handleBook} className="rounded-xl bg-rose-500 hover:bg-rose-600">
                  Prendre rendez-vous
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Liste des rendez-vous existants */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Mes rendez-vous à venir</h2>
        {appointments.length === 0 ? (
          <Card className="border-rose-100">
            <CardContent className="py-8 text-center text-gray-500">
              Aucun rendez-vous à venir.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {appointments.map((appt) => (
              <Card key={appt.id} className="border-rose-100">
                <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="font-semibold text-gray-900">{appt.doctor}</p>
                      <p className="text-sm text-gray-500">{appt.date} à {appt.time} – {appt.type}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`border-rose-200 ${appt.status === "Confirmé" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {appt.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}