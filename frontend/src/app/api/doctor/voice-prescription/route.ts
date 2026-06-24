import { NextResponse } from 'next/server';

type PrescriptionCategorie = 'ACTE' | 'BILAN';

type CatalogItem = {
  code: string;
  libelle: string;
  categorie: PrescriptionCategorie;
  tarif: number;
};

type SuggestedLine = {
  code: string;
  libelle: string;
  categorie: PrescriptionCategorie;
  qte: number;
  pu: number;
  confidence: number;
  reason?: string;
};

const WHISPER_API_URL = process.env.WHISPER_API_URL ?? 'http://localhost:8000/transcribe';
const DEEPSEEK_API_URL = process.env.DEEPSEEK_API_URL ?? 'https://api.deepseek.com';
const DEEPSEEK_MODEL = process.env.DEEPSEEK_MODEL ?? 'deepseek-v4-flash';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function extractTextFromUnknown(payload: unknown): string {
  if (typeof payload === 'string') return payload;
  if (!payload || typeof payload !== 'object') return '';

  const data = payload as Record<string, unknown>;

  const directKeys = ['text', 'transcription', 'transcript', 'result', 'content'];
  for (const key of directKeys) {
    const value = data[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }

  if (Array.isArray(data.segments)) {
    const joined = data.segments
      .map((segment) => {
        if (!segment || typeof segment !== 'object') return '';
        const text = (segment as Record<string, unknown>).text;
        return typeof text === 'string' ? text : '';
      })
      .filter(Boolean)
      .join(' ')
      .trim();

    if (joined) return joined;
  }

  for (const value of Object.values(data)) {
    const extracted = extractTextFromUnknown(value);
    if (extracted) return extracted;
  }

  return '';
}

function safeCatalog(raw: string | null): CatalogItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const obj = item as Record<string, unknown>;
        const code = typeof obj.code === 'string' ? obj.code : '';
        const libelle = typeof obj.libelle === 'string' ? obj.libelle : '';
        const categorie = obj.categorie === 'ACTE' || obj.categorie === 'BILAN' ? obj.categorie : null;
        const tarif = typeof obj.tarif === 'number' ? obj.tarif : Number(obj.tarif ?? 0);

        if (!code || !libelle || !categorie || !Number.isFinite(tarif)) return null;
        return { code, libelle, categorie, tarif } as CatalogItem;
      })
      .filter((item): item is CatalogItem => Boolean(item));
  } catch {
    return [];
  }
}

function keywordScore(transcription: string, item: CatalogItem): number {
  const t = normalize(transcription);
  const l = normalize(item.libelle);
  const code = normalize(item.code);

  if (t.includes(code)) return 1;

  const words = l.split(/\s+/).filter((word) => word.length >= 4);
  if (words.length === 0) return 0;

  let hits = 0;
  for (const word of words) {
    if (t.includes(word)) hits += 1;
  }

  return hits / words.length;
}

function fallbackSuggestions(transcription: string, catalog: CatalogItem[]): SuggestedLine[] {
  if (!transcription.trim()) return [];

  const ranked = catalog
    .map((item) => ({ item, score: keywordScore(transcription, item) }))
    .filter((entry) => entry.score > 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return ranked.map(({ item, score }) => ({
    code: item.code,
    libelle: item.libelle,
    categorie: item.categorie,
    qte: 1,
    pu: item.tarif,
    confidence: Number(Math.min(0.92, Math.max(0.45, score)).toFixed(2)),
    reason: 'Suggestion heuristique locale',
  }));
}

function parseDeepseekContent(content: unknown): Array<Partial<SuggestedLine>> {
  if (typeof content !== 'string') return [];

  try {
    const parsed = JSON.parse(content) as unknown;
    if (!parsed || typeof parsed !== 'object') return [];
    const lines = (parsed as Record<string, unknown>).lignes;
    if (!Array.isArray(lines)) return [];
    return lines as Array<Partial<SuggestedLine>>;
  } catch {
    return [];
  }
}

function bestCatalogMatch(line: Partial<SuggestedLine>, catalog: CatalogItem[]): CatalogItem | null {
  if (typeof line.code === 'string') {
    const byCode = catalog.find((item) => normalize(item.code) === normalize(line.code!));
    if (byCode) return byCode;
  }

  const candidateLib = typeof line.libelle === 'string' ? normalize(line.libelle) : '';
  if (!candidateLib) return null;

  const scored = catalog
    .map((item) => ({
      item,
      score: candidateLib.includes(normalize(item.libelle)) || normalize(item.libelle).includes(candidateLib)
        ? 1
        : keywordScore(candidateLib, item),
    }))
    .sort((a, b) => b.score - a.score);

  if (!scored[0] || scored[0].score < 0.3) return null;
  return scored[0].item;
}

async function transcribeWithWhisper(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);

  const response = await fetch(WHISPER_API_URL, {
    method: 'POST',
    body: form,
  });

  if (!response.ok) {
    throw new Error(`Transcription indisponible (${response.status})`);
  }

  const payload = await response.json().catch(() => null);
  const text = extractTextFromUnknown(payload);
  if (!text) {
    throw new Error('Transcription vide');
  }
  return text;
}

async function extractWithDeepseek(transcription: string, catalog: CatalogItem[]): Promise<SuggestedLine[]> {
  if (!DEEPSEEK_API_KEY) {
    return fallbackSuggestions(transcription, catalog);
  }

  const limitedCatalog = catalog.slice(0, 120).map((item) => ({
    code: item.code,
    libelle: item.libelle,
    categorie: item.categorie,
    tarif: item.tarif,
  }));

  const systemPrompt =
    'Tu es un assistant clinique. Retourne uniquement un JSON valide avec la forme {"lignes":[{"code":"","libelle":"","categorie":"ACTE|BILAN","qte":1,"confidence":0.0,"reason":""}]}. N invente pas de categorie hors ACTE/BILAN. Confidence entre 0 et 1.';

  const userPrompt = [
    'Transcription de note vocale medecin:',
    transcription,
    '',
    'Catalogue autorise:',
    JSON.stringify(limitedCatalog),
    '',
    'Extrait les actes et bilans probables avec quantite.',
  ].join('\n');

  const response = await fetch(`${DEEPSEEK_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: DEEPSEEK_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    return fallbackSuggestions(transcription, catalog);
  }

  const payload = await response.json().catch(() => null);
  const content = payload?.choices?.[0]?.message?.content;
  const rawLines = parseDeepseekContent(content);

  const mapped: SuggestedLine[] = rawLines
    .map((line) => {
      const match = bestCatalogMatch(line, catalog);
      if (!match) return null;

      const qte = Math.max(1, Number(line.qte ?? 1) || 1);
      const confidence = Math.max(0, Math.min(1, Number(line.confidence ?? 0.65) || 0.65));
      const categorie = line.categorie === 'ACTE' || line.categorie === 'BILAN' ? line.categorie : match.categorie;

      return {
        code: match.code,
        libelle: match.libelle,
        categorie,
        qte,
        pu: match.tarif,
        confidence: Number(confidence.toFixed(2)),
        reason: typeof line.reason === 'string' ? line.reason : 'Proposition IA',
      } as SuggestedLine;
    })
    .filter((line): line is SuggestedLine => Boolean(line));

  if (mapped.length === 0) {
    return fallbackSuggestions(transcription, catalog);
  }

  const unique = new Map<string, SuggestedLine>();
  for (const line of mapped) {
    const existing = unique.get(line.code);
    if (!existing) {
      unique.set(line.code, line);
      continue;
    }

    unique.set(line.code, {
      ...existing,
      qte: existing.qte + line.qte,
      confidence: Math.max(existing.confidence, line.confidence),
    });
  }

  return Array.from(unique.values());
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ message: 'Fichier audio manquant' }, { status: 400 });
    }

    const catalog = safeCatalog(formData.get('catalog')?.toString() ?? null);
    if (catalog.length === 0) {
      return NextResponse.json({ message: 'Catalogue invalide' }, { status: 400 });
    }

    const transcription = await transcribeWithWhisper(file);
    const suggestions = await extractWithDeepseek(transcription, catalog);

    return NextResponse.json({
      transcription,
      suggestions,
      provider: DEEPSEEK_API_KEY ? 'deepseek+fallback' : 'fallback-local',
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Erreur serveur',
      },
      { status: 500 },
    );
  }
}
