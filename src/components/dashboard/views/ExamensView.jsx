// src/components/dashboard/views/ExamensView.jsx
import {  RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Search, Filter, FileText, Image, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import api from "@/services/api";

export default function ExamensView() {
  const [activeTab, setActiveTab] = useState("analyses");
  const [search, setSearch] = useState("");
  const [analyses, setAnalyses] = useState([]);
  const [imageries, setImageries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [patientsMap, setPatientsMap] = useState({});

  useEffect(() => {
    fetchAllExamens();
  }, []);

  const fetchAllExamens = async () => {
    setLoading(true);
    try {
      // Récupérer toutes les patientes du gynécologue
      const patientsRes = await api.get("/api/patientes/mes-patientes");
      const patients = patientsRes.data?.body ?? patientsRes.data?.data ?? patientsRes.data ?? [];
      const map = {};
      patients.forEach(p => { map[p.id] = p; });

      let allAnalyses = [];
      let allImageries = [];

      for (const patient of patients) {
        // Récupérer toutes les consultations de chaque patiente
        const consultsRes = await api.get(`/api/consultations/patientes/${patient.id}`);
        const consultations = consultsRes.data?.body ?? consultsRes.data?.data ?? consultsRes.data ?? [];
        for (const consult of consultations) {
          const [analysesRes, imageriesRes] = await Promise.all([
            api.get(`/api/consultations/${consult.id}/analyses`),
            api.get(`/api/consultations/${consult.id}/imageries`)
          ]);
          const analyses = analysesRes.data?.body ?? analysesRes.data?.data ?? analysesRes.data ?? [];
          const imageries = imageriesRes.data?.body ?? imageriesRes.data?.data ?? imageriesRes.data ?? [];
          allAnalyses = allAnalyses.concat(analyses.map(a => ({ ...a, patient, consultation: consult })));
          allImageries = allImageries.concat(imageries.map(i => ({ ...i, patient, consultation: consult })));
        }
      }
      setAnalyses(allAnalyses);
      setImageries(allImageries);
      setPatientsMap(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter(a =>
    a.type?.toLowerCase().includes(search.toLowerCase()) ||
    a.resultat?.toLowerCase().includes(search.toLowerCase()) ||
    a.patient?.nom?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredImageries = imageries.filter(i =>
    i.type?.toLowerCase().includes(search.toLowerCase()) ||
    i.description?.toLowerCase().includes(search.toLowerCase()) ||
    i.patient?.nom?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>📋 Tous les examens (analyses & imageries)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher par patiente, type ou résultat..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={fetchAllExamens}>
              <RefreshCw className="mr-2 h-4 w-4" /> Rafraîchir
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="analyses">🔬 Analyses ({analyses.length})</TabsTrigger>
              <TabsTrigger value="imageries">🖼️ Imageries ({imageries.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="analyses" className="mt-4">
              {loading && <p>Chargement des analyses...</p>}
              {!loading && filteredAnalyses.length === 0 && <p>Aucune analyse trouvée.</p>}
              <div className="space-y-3">
                {filteredAnalyses.map((a) => (
                  <Card key={a.id} className="hover:shadow-md transition">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{a.type}</p>
                          <p className="text-sm text-gray-600">{a.resultat}</p>
                          <div className="flex gap-3 mt-2 text-xs text-gray-400">
                            <span><User className="inline h-3 w-3" /> {a.patient?.nom} {a.patient?.prenom}</span>
                            <span><Calendar className="inline h-3 w-3" /> {new Date(a.dateAnalyse).toLocaleDateString()}</span>
                          </div>
                        </div>
                        {a.url && (
                          <Button variant="link" asChild>
                            <a href={a.url} target="_blank" rel="noopener noreferrer">Voir fichier</a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="imageries" className="mt-4">
              {loading && <p>Chargement des imageries...</p>}
              {!loading && filteredImageries.length === 0 && <p>Aucune imagerie trouvée.</p>}
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredImageries.map((img) => (
                  <Card key={img.id} className="hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-semibold">{img.type}</p>
                          <p className="text-sm">{img.description}</p>
                          <p className="text-xs text-gray-400 mt-1">Patiente : {img.patient?.nom} {img.patient?.prenom}</p>
                        </div>
                        {img.url && (
                          <Button variant="link" asChild>
                            <a href={img.url} target="_blank">🖼️</a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}