'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, FileAudio2, FileText, Loader2, Mic, Plus, Search, Sparkles, Square, Trash2, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SearchableSelect } from '@/components/searchable-select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { usePatients } from '@/lib/patients-store';
import { MEDECINS, fmt } from '@/lib/mock-data';
import {
  createPrescriptionAndDraftFacture,
  getCatalogByCategorie,
  PRESCRIPTION_CATALOGUE,
  type PrescriptionCatalogueItem,
  type PrescriptionCategorie,
  type PrescriptionLigne,
} from '@/lib/prescriptions-store';

type SelectionMap = Record<string, { selected: boolean; qte: number }>;

type VoiceSuggestion = {
  id: string;
  code: string;
  libelle: string;
  categorie: PrescriptionCategorie;
  qte: number;
  pu: number;
  confidence: number;
  reason: string | undefined;
  selected: boolean;
};

function CatalogTable({
  items,
  selection,
  onToggle,
  onQtyChange,
}: {
  items: PrescriptionCatalogueItem[];
  selection: SelectionMap;
  onToggle: (code: string) => void;
  onQtyChange: (code: string, qte: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[26px_1fr_90px_90px] gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
        <span />
        <span>Libellé</span>
        <span className="text-right">Qté</span>
        <span className="text-right">Tarif</span>
      </div>
      <div className="max-h-[320px] overflow-auto">
        {items.map((item) => {
          const entry = selection[item.code] ?? { selected: false, qte: 1 };
          return (
            <div key={item.code} className="grid grid-cols-[26px_1fr_90px_90px] items-center gap-2 border-b border-border px-3 py-2 last:border-b-0">
              <input
                type="checkbox"
                checked={entry.selected}
                onChange={() => onToggle(item.code)}
                className="h-4 w-4 rounded border-border"
              />
              <div>
                <p className="text-sm font-medium text-foreground">{item.libelle}</p>
                <p className="text-xs text-muted-foreground">{item.code}</p>
              </div>
              <Input
                type="number"
                min={1}
                value={entry.qte}
                onChange={(e) => onQtyChange(item.code, Math.max(1, Number(e.target.value) || 1))}
                className="h-8 text-right"
              />
              <p className="text-right text-sm font-semibold text-primary">{fmt(item.tarif)}</p>
            </div>
          );
        })}
        {items.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">Aucun résultat pour cette recherche.</p>
        )}
      </div>
    </div>
  );
}

export default function PrescriptionPage() {
  const { toast } = useToast();
  const patients = usePatients();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [patientId, setPatientId] = useState(patients[0]?.id ?? '');
  const [medecinId, setMedecinId] = useState(MEDECINS.find((m) => m.actif)?.id ?? MEDECINS[0]?.id ?? '');
  const [activeTab, setActiveTab] = useState<PrescriptionCategorie>('ACTE');
  const [searchActes, setSearchActes] = useState('');
  const [searchBilans, setSearchBilans] = useState('');
  const [selection, setSelection] = useState<SelectionMap>({});
  const [ordonnance, setOrdonnance] = useState<PrescriptionLigne[]>([]);
  const [result, setResult] = useState<{ prescriptionId: string; factureId: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [voiceSuggestions, setVoiceSuggestions] = useState<VoiceSuggestion[]>([]);

  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [audioUrl]);

  const patient = patients.find((p) => p.id === patientId) ?? patients[0];

  const patientOptions = patients.map((p) => ({
    value: p.id,
    label: `${p.prenom} ${p.nom}`,
    hint: p.telephone,
  }));

  const medecinOptions = MEDECINS.filter((m) => m.actif).map((m) => ({
    value: m.id,
    label: `Dr ${m.prenom} ${m.nom}`,
    hint: m.specialite,
  }));

  const actes = useMemo(() => {
    const q = searchActes.trim().toLowerCase();
    const source = getCatalogByCategorie('ACTE');
    if (!q) return source;
    return source.filter((item) => item.libelle.toLowerCase().includes(q) || item.code.toLowerCase().includes(q));
  }, [searchActes]);

  const bilans = useMemo(() => {
    const q = searchBilans.trim().toLowerCase();
    const source = getCatalogByCategorie('BILAN');
    if (!q) return source;
    return source.filter((item) => item.libelle.toLowerCase().includes(q) || item.code.toLowerCase().includes(q));
  }, [searchBilans]);

  const toggleSelection = (code: string) => {
    setSelection((prev) => {
      const current = prev[code] ?? { selected: false, qte: 1 };
      return { ...prev, [code]: { ...current, selected: !current.selected } };
    });
  };

  const changeQte = (code: string, qte: number) => {
    setSelection((prev) => {
      const current = prev[code] ?? { selected: false, qte: 1 };
      return { ...prev, [code]: { ...current, qte } };
    });
  };

  const addSelectedToOrdonnance = () => {
    const source = activeTab === 'ACTE' ? actes : bilans;
    const selectedItems = source.filter((item) => selection[item.code]?.selected);

    if (selectedItems.length === 0) return;

    const next = [...ordonnance];
    selectedItems.forEach((item) => {
      const qte = Math.max(1, selection[item.code]?.qte ?? 1);
      const existingIndex = next.findIndex((l) => l.code === item.code);
      if (existingIndex >= 0) {
        next[existingIndex] = { ...next[existingIndex], qte: next[existingIndex].qte + qte };
      } else {
        next.push({
          code: item.code,
          libelle: item.libelle,
          categorie: item.categorie,
          qte,
          pu: item.tarif,
        });
      }
    });

    setOrdonnance(next);
    setSelection((prev) => {
      const copy = { ...prev };
      selectedItems.forEach((item) => {
        copy[item.code] = { selected: false, qte: 1 };
      });
      return copy;
    });
  };

  const removeLine = (code: string) => {
    setOrdonnance((prev) => prev.filter((l) => l.code !== code));
  };

  const mergeInOrdonnance = (incoming: PrescriptionLigne[]) => {
    if (incoming.length === 0) return;

    setOrdonnance((prev) => {
      const next = [...prev];

      incoming.forEach((line) => {
        const existingIndex = next.findIndex((l) => l.code === line.code);
        if (existingIndex >= 0) {
          next[existingIndex] = {
            ...next[existingIndex],
            qte: next[existingIndex].qte + line.qte,
          };
          return;
        }

        next.push(line);
      });

      return next;
    });
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({ title: 'Micro indisponible', description: 'Ce navigateur ne supporte pas la capture audio.', type: 'warning' });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
        }
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
      toast({ title: 'Enregistrement démarré', description: 'Dictez votre note vocale puis cliquez Stop.', type: 'info' });
    } catch {
      toast({ title: 'Micro refusé', description: 'Autorisez l accès micro pour utiliser la dictée.', type: 'warning' });
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
  };

  const handleAudioUpload = (file: File | null) => {
    if (!file) return;
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    toast({ title: 'Audio prêt', description: `${file.name} chargé pour transcription.`, type: 'info' });
  };

  const runAiExtraction = async () => {
    if (!audioBlob) {
      toast({ title: 'Audio requis', description: 'Enregistrez ou importez une note vocale avant extraction.', type: 'warning' });
      return;
    }

    setIsAiLoading(true);

    try {
      const formData = new FormData();
      const uploadFile = new File([audioBlob], 'note-vocale.webm', { type: audioBlob.type || 'audio/webm' });

      formData.append('file', uploadFile);
      formData.append('catalog', JSON.stringify(PRESCRIPTION_CATALOGUE));

      console.group('[voice-prescription] prompt envoyé à l\'IA');
      console.log('catalogue (%d items):', PRESCRIPTION_CATALOGUE.length, PRESCRIPTION_CATALOGUE);
      console.groupEnd();

      const response = await fetch('/api/doctor/voice-prescription', {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json().catch(() => null)) as {
        message?: string;
        transcription?: string;
        suggestions?: Array<{
          code?: string;
          libelle?: string;
          categorie?: PrescriptionCategorie;
          qte?: number;
          pu?: number;
          confidence?: number;
          reason?: string;
        }>;
      } | null;

      if (!response.ok) {
        throw new Error(payload?.message ?? 'Extraction indisponible');
      }

      console.group('[voice-prescription] réponse brute de l\'IA');
      console.log('transcription:', payload?.transcription);
      console.log('suggestions (%d):', payload?.suggestions?.length ?? 0, payload?.suggestions);
      console.groupEnd();
      const catalogIndex = new Map(PRESCRIPTION_CATALOGUE.map((item) => [item.code, item]));
      const nextTranscription = payload?.transcription ?? '';
      const nextSuggestions = (payload?.suggestions ?? [])
        .map((line, index) => {
          const code = line.code ?? '';
          const catalogItem = code ? catalogIndex.get(code) : undefined;

          if (!catalogItem) return null;

          return {
            id: `${catalogItem.code}-${index}`,
            code: catalogItem.code,
            libelle: catalogItem.libelle,
            categorie: catalogItem.categorie,
            qte: Math.max(1, Number(line.qte ?? 1) || 1),
            pu: catalogItem.tarif,
            confidence: Math.max(0, Math.min(1, Number(line.confidence ?? 0.65) || 0.65)),
            reason: line.reason,
            selected: true,
          };
        })
        .filter((line): line is VoiceSuggestion => Boolean(line));

      setTranscriptionText(nextTranscription);
      setVoiceSuggestions(nextSuggestions);

      toast({
        title: 'Extraction terminée',
        description:
          nextSuggestions.length > 0
            ? `${nextSuggestions.length} ligne(s) proposée(s). Vérifiez puis confirmez.`
            : 'Aucune ligne trouvée automatiquement.',
        type: nextSuggestions.length > 0 ? 'success' : 'warning',
      });
    } catch (error) {
      toast({
        title: 'Erreur IA',
        description: error instanceof Error ? error.message : 'Impossible de traiter la note vocale.',
        type: 'warning',
      });
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleVoiceSuggestion = (id: string) => {
    setVoiceSuggestions((prev) => prev.map((line) => (line.id === id ? { ...line, selected: !line.selected } : line)));
  };

  const changeVoiceSuggestionQty = (id: string, qte: number) => {
    setVoiceSuggestions((prev) => prev.map((line) => (line.id === id ? { ...line, qte: Math.max(1, qte) } : line)));
  };

  const confirmVoiceSuggestions = () => {
    const selected = voiceSuggestions.filter((line) => line.selected);

    if (selected.length === 0) {
      toast({ title: 'Aucune ligne sélectionnée', description: 'Cochez au moins une ligne avant confirmation.', type: 'warning' });
      return;
    }

    mergeInOrdonnance(
      selected.map((line) => ({
        code: line.code,
        libelle: line.libelle,
        categorie: line.categorie,
        qte: line.qte,
        pu: line.pu,
      })),
    );

    setVoiceSuggestions((prev) => prev.map((line) => ({ ...line, selected: false })));
    toast({ title: 'Lignes confirmées', description: `${selected.length} ligne(s) ajoutée(s) à l ordonnance.`, type: 'success' });
  };

  const total = ordonnance.reduce((sum, l) => sum + l.qte * l.pu, 0);

  const submitPrescription = () => {
    if (!patient || !medecinId || ordonnance.length === 0) return;

    const { prescription, facture } = createPrescriptionAndDraftFacture({
      patient: { id: patient.id, nom: patient.nom, prenom: patient.prenom },
      medecinId,
      lignes: ordonnance,
    });

    setResult({ prescriptionId: prescription.id, factureId: facture.id });
    setOrdonnance([]);
  };

  return (
    <main className="space-y-5">
      <div className="flex items-center gap-3">
        <Link href="/doctor">
          <Button variant="outline" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" />Retour</Button>
        </Link>
        <h1 className="text-lg font-bold">Prescription médicale</h1>
      </div>

      {result && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
          <CheckCircle2 className="h-4 w-4" />
          <span>Ordonnance {result.prescriptionId} créée. Brouillon {result.factureId} envoyé à la caisse.</span>
          <Link href={`/cashier/factures/${result.factureId}`} className="font-medium text-emerald-700 hover:underline">Ouvrir la facture en caisse</Link>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4 text-primary" />Volet prescription médicale</CardTitle>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Patient</Label>
                <SearchableSelect options={patientOptions} value={patientId} onChange={setPatientId} placeholder="Rechercher un patient..." />
              </div>
              <div className="space-y-1.5">
                <Label>Médecin</Label>
                <SearchableSelect options={medecinOptions} value={medecinId} onChange={setMedecinId} placeholder="Rechercher un médecin..." />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <FileAudio2 className="h-4 w-4 text-primary" />
                    Assistant vocal IA (simulation)
                  </p>
                  <p className="text-xs text-muted-foreground">Dictez la note, lancez la magie IA, puis confirmez les lignes extraites.</p>
                </div>
                <Badge variant={isRecording ? 'warning' : 'outline'}>{isRecording ? 'Enregistrement...' : 'Prêt'}</Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" className="gap-2" onClick={startRecording} disabled={isRecording || isAiLoading}>
                  <Mic className="h-4 w-4" /> Démarrer dictée
                </Button>
                <Button type="button" variant="outline" className="gap-2" onClick={stopRecording} disabled={!isRecording}>
                  <Square className="h-4 w-4" /> Stop
                </Button>
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-border px-4 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Upload className="h-4 w-4" /> Import audio
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => handleAudioUpload(e.target.files?.[0] ?? null)}
                  />
                </label>
                <Button type="button" variant="brand" className="gap-2" onClick={runAiExtraction} disabled={isAiLoading || !audioBlob}>
                  {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isAiLoading ? 'Analyse en cours...' : 'Transcrire + Extraire'}
                </Button>
              </div>

              {audioUrl && (
                <div className="mt-3 rounded-lg border border-border bg-background/80 p-2">
                  <audio controls src={audioUrl} className="w-full" />
                </div>
              )}

              <div className="mt-3 space-y-2">
                <Label>Transcription brute</Label>
                <Textarea
                  value={transcriptionText}
                  onChange={(e) => setTranscriptionText(e.target.value)}
                  placeholder="La transcription Whisper apparaîtra ici..."
                  className="min-h-[84px]"
                />
              </div>

              {voiceSuggestions.length > 0 && (
                <div className="mt-3 space-y-2 rounded-lg border border-border bg-background/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">Lignes proposées par IA</p>
                    <Button type="button" size="sm" variant="brand" onClick={confirmVoiceSuggestions}>
                      Confirmer la sélection
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {voiceSuggestions.map((line) => (
                      <div key={line.id} className="grid grid-cols-[24px_1fr_80px_90px] items-center gap-2 rounded-lg border border-border px-2 py-2">
                        <input
                          type="checkbox"
                          checked={line.selected}
                          onChange={() => toggleVoiceSuggestion(line.id)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{line.libelle}</p>
                          <p className="text-xs text-muted-foreground">
                            {line.code} · {line.categorie} · confiance {(line.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <Input
                          type="number"
                          min={1}
                          value={line.qte}
                          onChange={(e) => changeVoiceSuggestionQty(line.id, Number(e.target.value) || 1)}
                          className="h-8 text-right"
                        />
                        <p className="text-right text-sm font-semibold text-primary">{fmt(line.pu)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Tabs defaultValue="ACTE" value={activeTab} onValueChange={(v) => setActiveTab(v as PrescriptionCategorie)} className="space-y-3">
              <TabsList className="grid w-full grid-cols-2 sm:w-[260px]">
                <TabsTrigger value="ACTE">Actes</TabsTrigger>
                <TabsTrigger value="BILAN">Bilans</TabsTrigger>
              </TabsList>

              <TabsContent value="ACTE" className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={searchActes} onChange={(e) => setSearchActes(e.target.value)} className="pl-9" placeholder="Rechercher un acte..." />
                </div>
                <CatalogTable items={actes} selection={selection} onToggle={toggleSelection} onQtyChange={changeQte} />
              </TabsContent>

              <TabsContent value="BILAN" className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={searchBilans} onChange={(e) => setSearchBilans(e.target.value)} className="pl-9" placeholder="Rechercher un bilan..." />
                </div>
                <CatalogTable items={bilans} selection={selection} onToggle={toggleSelection} onQtyChange={changeQte} />
              </TabsContent>
            </Tabs>

            <Button variant="brand" className="gap-2" onClick={addSelectedToOrdonnance}>
              <Plus className="h-4 w-4" /> Ajouter à l&apos;ordonnance
            </Button>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Ordonnance en cours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ordonnance.length === 0 && <p className="text-sm text-muted-foreground">Aucune ligne ajoutée.</p>}

            {ordonnance.map((l) => (
              <div key={l.code} className="rounded-xl border border-border p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{l.libelle}</p>
                    <p className="text-xs text-muted-foreground">{l.code} · {l.categorie}</p>
                  </div>
                  <button onClick={() => removeLine(l.code)} className="text-muted-foreground hover:text-destructive" aria-label="Supprimer ligne">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Qté {l.qte}</span>
                  <strong className="text-primary">{fmt(l.qte * l.pu)}</strong>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
              <span className="text-sm font-semibold">Total prévisionnel</span>
              <strong className="text-primary">{fmt(total)}</strong>
            </div>

            <Button variant="brand" className="w-full" onClick={submitPrescription} disabled={!patient || ordonnance.length === 0}>
              Valider la prescription et créer le brouillon caisse
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
