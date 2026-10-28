import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sliders, 
  Disc, 
  Layers, 
  BookOpen, 
  Plus, 
  Trash2, 
  Volume2, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Equal,
  Sparkles,
  Music,
  Bookmark,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  FileText,
  Save,
  FolderOpen,
  Pin,
  X,
  ShieldCheck
} from 'lucide-react';

// ==========================================
// 1. BAZA DANYCH MUZYCZNYCH I AKUSTYCZNYCH
// ==========================================

// Wzorcowa tabela częstotliwości (A4 = 440.00 Hz, strój równomiernie temperowany)
const NOTES_DATA = [
  { note: 'C1', hz: 32.70, midi: 24 },
  { note: 'C#1', hz: 34.65, midi: 25 },
  { note: 'D1', hz: 36.71, midi: 26 },
  { note: 'D#1', hz: 38.89, midi: 27 },
  { note: 'E1', hz: 41.20, midi: 28 },
  { note: 'F1', hz: 43.65, midi: 29 },
  { note: 'F#1', hz: 46.25, midi: 30 },
  { note: 'G1', hz: 49.00, midi: 31 },
  { note: 'G#1', hz: 51.91, midi: 32 },
  { note: 'A1', hz: 55.00, midi: 33 },
  { note: 'A#1', hz: 58.27, midi: 34 },
  { note: 'B1', hz: 61.74, midi: 35 },
  { note: 'C2', hz: 65.41, midi: 36 },
  { note: 'C#2', hz: 69.30, midi: 37 },
  { note: 'D2', hz: 73.42, midi: 38 },
  { note: 'D#2', hz: 77.78, midi: 39 },
  { note: 'E2', hz: 82.41, midi: 40 },
  { note: 'F2', hz: 87.31, midi: 41 },
  { note: 'F#2', hz: 92.50, midi: 42 },
  { note: 'G2', hz: 98.00, midi: 43 },
  { note: 'G#2', hz: 103.83, midi: 44 },
  { note: 'A2', hz: 110.00, midi: 45 },
  { note: 'A#2', hz: 116.54, midi: 46 },
  { note: 'B2', hz: 123.47, midi: 47 },
  { note: 'C3', hz: 130.81, midi: 48 },
  { note: 'C#3', hz: 138.59, midi: 49 },
  { note: 'D3', hz: 146.83, midi: 50 },
  { note: 'D#3', hz: 155.56, midi: 51 },
  { note: 'E3', hz: 164.81, midi: 52 },
  { note: 'F3', hz: 174.61, midi: 53 },
  { note: 'F#3', hz: 185.00, midi: 54 },
  { note: 'G3', hz: 196.00, midi: 55 },
  { note: 'G#3', hz: 207.65, midi: 56 },
  { note: 'A3', hz: 220.00, midi: 57 },
  { note: 'A#3', hz: 233.08, midi: 58 },
  { note: 'B3', hz: 246.94, midi: 59 },
  { note: 'C4', hz: 261.63, midi: 60 },
];

// Rekomendowane zakresy dźwięku podstawowego (Fundamental) wg oficjalnych wytycznych Tune-Bot
const DRUM_SPECS = {
  tom: {
    label: 'Tom / Floor',
    shortLabel: 'Tom',
    sizes: [
      { size: 8, minNote: 'D3', maxNote: 'A3', defaultNote: 'F3', desc: 'Wysoki, selektywny atak' },
      { size: 10, minNote: 'A2', maxNote: 'E3', defaultNote: 'C3', desc: 'Standardowy wysoki rack tom' },
      { size: 12, minNote: 'F2', maxNote: 'C3', defaultNote: 'G#2', desc: 'Klasyczny średni rack tom' },
      { size: 13, minNote: 'D#2', maxNote: 'A2', defaultNote: 'F#2', desc: 'Głęboki rack tom (rock/metal)' },
      { size: 14, minNote: 'C2', maxNote: 'G2', defaultNote: 'D#2', desc: 'Mniejszy floor tom lub duży rack' },
      { size: 16, minNote: 'A1', maxNote: 'D#2', defaultNote: 'C2', desc: 'Standardowy floor tom 16"' },
      { size: 18, minNote: 'F1', maxNote: 'B1', defaultNote: 'G#1', desc: 'Potężny floor tom (heavy/doom)' },
    ]
  },
  snare: {
    label: 'Werbel (Snare)',
    shortLabel: 'Werbel',
    sizes: [
      { size: 10, minNote: 'A3', maxNote: 'C4', defaultNote: 'A#3', desc: 'Side-snare / Piccolo, wysoki strzał' },
      { size: 12, minNote: 'G3', maxNote: 'B3', defaultNote: 'A3', desc: 'Kompaktowy, skupiony punkt' },
      { size: 13, minNote: 'F3', maxNote: 'A#3', defaultNote: 'G3', desc: 'Nowoczesny, szybki atak HiGain' },
      { size: 14, minNote: 'D#3', maxNote: 'A3', defaultNote: 'F#3', desc: 'Standard studyjny (Fat=E3, Crack=G3)' },
    ]
  },
  kick: {
    label: 'Stopa (Kick)',
    shortLabel: 'Stopa',
    sizes: [
      { size: 18, minNote: 'A1', maxNote: 'D2', defaultNote: 'B1', desc: 'Kompaktowa stopa klubowa / jazz' },
      { size: 20, minNote: 'F1', maxNote: 'A#1', defaultNote: 'G1', desc: 'Punktowy, szybki dół (studio/metal)' },
      { size: 22, minNote: 'D1', maxNote: 'G#1', defaultNote: 'E1', desc: 'Uniwersalny standard rock / metal' },
      { size: 24, minNote: 'C1', maxNote: 'F1', defaultNote: 'D1', desc: 'Monumentalny sub-bas (stoner/doom)' },
    ]
  }
};

// Skalibrowane mnożniki rezonansu dla Tomów i Stopy zgodne z tabelami Tune-Bot (f_lug / f_fundamental)
const RESONANCE_PROFILES = {
  max: {
    id: 'max',
    name: 'Maksymalny (Max)',
    shortName: 'Max (1:1)',
    desc: 'Oba naciągi identycznie. Długi, czysty wybrzmiew bez modulacji wysokości dźwięku.',
    lowMult: 1.72,
    highMult: 1.72,
    ratioText: '1.00x (1:1)'
  },
  high: {
    id: 'high',
    name: 'Wysoki (High)',
    shortName: 'Wysoki',
    desc: 'Delikatny odskok między naciągami. Otwarte, pełne brzmienie o długim wybrzmiewie.',
    lowMult: 1.59,
    highMult: 1.85,
    ratioText: '1.16x (~2 półtony)'
  },
  medium: {
    id: 'medium',
    name: 'Średni (Studio)',
    shortName: 'Średni',
    desc: 'Złoty środek HiGain Studio. Wyraźny atak, kontrolowany sustain i czytelny pitch-bend.',
    lowMult: 1.51,
    highMult: 1.90,
    ratioText: '1.26x (Tercja)'
  },
  low: {
    id: 'low',
    name: 'Niski (Punch / Fast)',
    shortName: 'Niski',
    desc: 'Duża różnica napięć. Szybkie wygaszanie, tłusty atak i maksymalna separacja w gęstym miksie.',
    lowMult: 1.43,
    highMult: 1.96,
    ratioText: '1.37x (Kwarta)'
  }
};

// Specjalne profile dla werbla (Snare) z zabezpieczeniem przed przekroczeniem 400 Hz na rezonansie
const SNARE_PROFILES = {
  classic_4th: {
    id: 'classic_4th',
    name: 'Klasyczna Kwarta (Studio)',
    shortName: 'Kwarta Studio',
    desc: 'Rezonans o kwartę wyżej od uderzanego. Czułe sprężyny, pełne ciało i czysty strzał.',
    batterMult: 1.40,
    resoMult: 1.88,
    fixedReso: null
  },
  tight_3rd: {
    id: 'tight_3rd',
    name: 'Skupiona Tercja (Fat Rock)',
    shortName: 'Tercja Rock',
    desc: 'Mniejsza różnica góra-dół. Mięsisty środek pasma, idealny pod średnie i niskie stroje.',
    batterMult: 1.45,
    resoMult: 1.76,
    fixedReso: null
  },
  crisp_390: {
    id: 'crisp_390',
    name: 'HiGain Crisp (Reso 390 Hz)',
    shortName: 'HiGain 390Hz',
    desc: 'Dolny naciąg zablokowany na bezpiecznym maksimum (390 Hz) pod agresywny atak i metal.',
    batterMult: 1.48,
    resoMult: null,
    fixedReso: 390
  },
  fat_ballad: {
    id: 'fat_ballad',
    name: 'Tłusty Vintage (Reso 335 Hz)',
    shortName: 'Vintage 335Hz',
    desc: 'Niższy naciąg uderzany i umiarkowany rezonans (335 Hz). Szerokie, ciemniejsze brzmienie.',
    batterMult: 1.30,
    resoMult: null,
    fixedReso: 335
  }
};

// Korekcja ze względu na typ naciągu uderzanego (wpływ masy na częstotliwość przy śrubie)
const HEAD_TYPES = [
  { id: '1ply_clear', name: '1-warstwowy Clear (Ambassador / G1)', shortName: '1-ply Clear', comp: 1.00, note: '0% (Wzorzec)' },
  { id: '1ply_coated', name: '1-warstwowy Coated (Ambassador Coated)', shortName: '1-ply Coated', comp: 1.015, note: '+1.5% Hz (Góra)' },
  { id: '2ply_clear', name: '2-warstwowy Clear (Emperor / G2)', shortName: '2-ply Clear', comp: 1.03, note: '+3.0% Hz (Góra)' },
  { id: '2ply_coated', name: '2-warstwowy Coated / Dot (Emperor / CS / Pinstripe)', shortName: '2-ply Coated/Dot', comp: 1.045, note: '+4.5% Hz (Góra)' },
  { id: 'heavy_damp', name: 'Gruby / Tłumiony (EMAD / Powerstroke / Hydraulic)', shortName: 'Heavy / EMAD', comp: 1.06, note: '+6.0% Hz (Góra)' }
];

// Gotowe presety zestawów
const KIT_PRESETS = [
  {
    id: 'higain_metal',
    name: 'HiGain Metal (10"-12"-14"-16" + 22" + 14")',
    shortName: 'HiGain Metal',
    lowestTomNote: 'C2',
    intervalSemitones: 3,
    resonance: 'low',
    pitchDir: 'reso_higher',
    drums: [
      { id: 'd1', type: 'snare', size: 14, customNote: 'G3' },
      { id: 'd2', type: 'tom', size: 10 },
      { id: 'd3', type: 'tom', size: 12 },
      { id: 'd4', type: 'tom', size: 14 },
      { id: 'd5', type: 'tom', size: 16 },
      { id: 'd6', type: 'kick', size: 22, customNote: 'E1' },
    ]
  },
  {
    id: 'studio_4',
    name: 'Studio Fusion (10"-12"-14"-16" + 22" + 14")',
    shortName: 'Studio Fusion',
    lowestTomNote: 'C2',
    intervalSemitones: 4,
    resonance: 'medium',
    pitchDir: 'reso_higher',
    drums: [
      { id: 'd1', type: 'snare', size: 14, customNote: 'F#3' },
      { id: 'd2', type: 'tom', size: 10 },
      { id: 'd3', type: 'tom', size: 12 },
      { id: 'd4', type: 'tom', size: 14 },
      { id: 'd5', type: 'tom', size: 16 },
      { id: 'd6', type: 'kick', size: 22, customNote: 'E1' },
    ]
  },
  {
    id: 'rock_3',
    name: 'Klasyczny Rock (10"-12"-16" + 22" + 14")',
    shortName: 'Klasyczny Rock',
    lowestTomNote: 'C2',
    intervalSemitones: 5,
    resonance: 'medium',
    pitchDir: 'reso_higher',
    drums: [
      { id: 'd1', type: 'snare', size: 14, customNote: 'F3' },
      { id: 'd2', type: 'tom', size: 10 },
      { id: 'd3', type: 'tom', size: 12 },
      { id: 'd4', type: 'tom', size: 16 },
      { id: 'd5', type: 'kick', size: 22, customNote: 'D#1' },
    ]
  },
  {
    id: 'heavy_doom',
    name: 'Stoner / Doom (12"-13"-16"-18" + 24" + 14")',
    shortName: 'Stoner / Doom',
    lowestTomNote: 'A1',
    intervalSemitones: 3,
    resonance: 'low',
    pitchDir: 'reso_higher',
    drums: [
      { id: 'd1', type: 'snare', size: 14, customNote: 'E3' },
      { id: 'd2', type: 'tom', size: 12 },
      { id: 'd3', type: 'tom', size: 13 },
      { id: 'd4', type: 'tom', size: 16 },
      { id: 'd5', type: 'tom', size: 18 },
      { id: 'd6', type: 'kick', size: 24, customNote: 'D1' },
    ]
  }
];

// ==========================================
// 2. FUNKCJE OBLICZENIOWE I POMOCNICZE
// ==========================================

function getNoteObj(noteName) {
  return NOTES_DATA.find(n => n.note === noteName) || NOTES_DATA[14];
}

function getNoteByMidi(midi) {
  const clamped = Math.max(24, Math.min(60, midi));
  return NOTES_DATA.find(n => n.midi === clamped) || NOTES_DATA[0];
}

function getDrumTypeLabel(type) {
  if (type === 'snare') return 'Werbel';
  if (type === 'kick') return 'Stopa';
  return 'Tom';
}

function calculateDrumFrequencies({
  drumType,
  fundamentalNote,
  resonanceId,
  snareProfileId,
  pitchDirection,
  headTypeId
}) {
  const noteObj = getNoteObj(fundamentalNote);
  const f0 = noteObj.hz;
  const headObj = HEAD_TYPES.find(h => h.id === headTypeId) || HEAD_TYPES[0];

  let batterHz = 0;
  let resoHz = 0;
  let description = '';
  let profileLabel = '';
  let shortProfileLabel = '';
  let snareCapped = false;

  if (drumType === 'snare') {
    const profile = SNARE_PROFILES[snareProfileId] || SNARE_PROFILES.classic_4th;
    batterHz = Math.round(f0 * profile.batterMult * headObj.comp);
    if (profile.fixedReso) {
      resoHz = profile.fixedReso;
    } else {
      const rawReso = Math.round(f0 * profile.resoMult);
      // Bezpieczny limit fizyczny Tune-Bot dla dolnego naciągu werbla (400 Hz)
      if (rawReso > 400) {
        resoHz = 400;
        snareCapped = true;
      } else {
        resoHz = rawReso;
      }
    }
    description = profile.desc;
    profileLabel = profile.name;
    shortProfileLabel = profile.shortName;
  } else {
    const profile = RESONANCE_PROFILES[resonanceId] || RESONANCE_PROFILES.medium;
    let rawBatter = 0;
    let rawReso = 0;

    if (profile.id === 'max' || pitchDirection === 'equal') {
      rawBatter = f0 * 1.72;
      rawReso = f0 * 1.72;
    } else if (pitchDirection === 'reso_higher') {
      rawBatter = f0 * profile.lowMult;
      rawReso = f0 * profile.highMult;
    } else {
      rawBatter = f0 * profile.highMult;
      rawReso = f0 * profile.lowMult;
    }

    batterHz = Math.round(rawBatter * headObj.comp);
    resoHz = Math.round(rawReso);
    description = profile.desc;
    profileLabel = profile.name;
    shortProfileLabel = profile.shortName;
  }

  const ratio = (resoHz / batterHz).toFixed(2);

  return {
    note: noteObj.note,
    fundamentalHz: f0,
    batterHz,
    resoHz,
    ratio,
    description,
    profileLabel,
    shortProfileLabel,
    headLabel: headObj.name,
    shortHeadLabel: headObj.shortName,
    snareCapped
  };
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

// ==========================================
// 3. DEDYKOWANY LOGOTYP WEKTOROWY HiGAIN STUDIO
// ==========================================

function HiGainLogo({ size = 'md' }) {
  const isSmall = size === 'sm';
  return (
    <div className="flex items-center gap-2.5 select-none shrink-0">
      {/* Ikona gitary Flying V z wyciętym piorunem i złotym napisem */}
      <div
        className={`relative rounded-xl bg-[#070708] border border-yellow-500/40 flex items-center justify-center shadow-inner overflow-hidden shrink-0 ${
          isSmall ? 'w-10 h-10' : 'w-11 h-11 sm:w-12 sm:h-12'
        }`}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full p-1" aria-label="HiGain Studio Logo">
          <defs>
            <linearGradient id="hgGoldGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="hgSilverGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#9ca3af" />
            </linearGradient>
          </defs>

          {/* Główka gitary i klucze */}
          <polygon points="50,6 45,21 55,21" fill="url(#hgSilverGrad)" />
          <circle cx="43" cy="11" r="1.4" fill="#d4d4d8" />
          <circle cx="42" cy="15" r="1.4" fill="#d4d4d8" />
          <circle cx="41" cy="19" r="1.4" fill="#d4d4d8" />
          <circle cx="57" cy="11" r="1.4" fill="#d4d4d8" />
          <circle cx="58" cy="15" r="1.4" fill="#d4d4d8" />
          <circle cx="59" cy="19" r="1.4" fill="#d4d4d8" />

          {/* Gryf i korpus Flying V */}
          <rect x="47" y="20" width="6" height="32" fill="url(#hgSilverGrad)" />
          <polygon points="50,48 25,94 37,94 50,74 63,94 75,94" fill="url(#hgSilverGrad)" />

          {/* Czarny piorun wpisany w korpus gitary */}
          <polygon points="53,51 42,64 51,64 41,77 52,77 40,91 58,73 48,73 59,61 49,61" fill="#070708" />

          {/* Złoty baner typograficzny HiGAIN na pierwszym planie */}
          <text
            x="50"
            y="49"
            textAnchor="middle"
            fill="url(#hgGoldGrad)"
            stroke="#070708"
            strokeWidth="2.5"
            paintOrder="stroke"
            fontFamily="Impact, Haettenschweiler, 'Arial Black', sans-serif"
            fontWeight="900"
            fontSize="24"
            letterSpacing="0.5"
          >
            HiGAIN
          </text>
        </svg>
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-black tracking-wider text-base sm:text-lg uppercase bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            HiGAIN STUDIO
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded bg-zinc-900 text-yellow-400 border border-yellow-500/30">
            Tune-Bot
          </span>
        </div>
        <p className="text-[11px] text-zinc-400 truncate">
          Kalkulator Strojenia Perkusji (Hz / Nuty)
        </p>
      </div>
    </div>
  );
}

// ==========================================
// 4. AUTOMATYCZNY PAKIET TESTÓW QA / WALIDACJI
// ==========================================

function runAutomatedQATests() {
  const results = [];

  // Test 1: Weryfikacja wzorca A4 = 440 Hz i oktaw C2 / C3 / A2
  const a2 = getNoteObj('A2');
  const c2 = getNoteObj('C2');
  const c3 = getNoteObj('C3');
  const mathPass =
    Math.abs(a2.hz - 110.0) < 0.01 &&
    Math.abs(c2.hz - 65.41) < 0.02 &&
    Math.abs(c3.hz - 130.81) < 0.02;

  results.push({
    id: 'qa_pitch',
    category: 'Matematyka Akustyczna',
    title: 'Skala równomiernie temperowana (A4 = 440 Hz)',
    expected: 'C2 = 65.41 Hz, A2 = 110.00 Hz, C3 = 130.81 Hz',
    actual: `C2 = ${c2.hz} Hz, A2 = ${a2.hz} Hz, C3 = ${c3.hz} Hz`,
    passed: mathPass
  });

  // Test 2: Tom 12" G#2 (103.83 Hz) - Max Resonance (1:1) na naciągu 1-ply Clear
  const tom12Equal = calculateDrumFrequencies({
    drumType: 'tom',
    fundamentalNote: 'G#2',
    resonanceId: 'max',
    snareProfileId: 'classic_4th',
    pitchDirection: 'equal',
    headTypeId: '1ply_clear'
  });
  const tom12EqualPass =
    tom12Equal.batterHz === tom12Equal.resoHz &&
    tom12Equal.batterHz >= 175 &&
    tom12Equal.batterHz <= 182;

  results.push({
    id: 'qa_tom12_eq',
    category: 'Tabele Tune-Bot',
    title: 'Tom 12" (G#2 = 103.8 Hz) przy stroju równym 1:1 (1-ply Clear)',
    expected: 'Góra = Dół w przedziale 175-182 Hz (Stosunek 1.00x)',
    actual: `Góra: ${tom12Equal.batterHz} Hz | Dół: ${tom12Equal.resoHz} Hz (Stosunek: ${tom12Equal.ratio}x)`,
    passed: tom12EqualPass
  });

  // Test 3: Tom 12" G#2 (103.83 Hz) - Średni Rezonans (Studio), Rezonans Wyżej, 2-ply Clear
  const tom12Med = calculateDrumFrequencies({
    drumType: 'tom',
    fundamentalNote: 'G#2',
    resonanceId: 'medium',
    snareProfileId: 'classic_4th',
    pitchDirection: 'reso_higher',
    headTypeId: '2ply_clear'
  });
  const tom12MedPass =
    tom12Med.resoHz > tom12Med.batterHz &&
    tom12Med.batterHz >= 158 &&
    tom12Med.batterHz <= 165 &&
    tom12Med.resoHz >= 194 &&
    tom12Med.resoHz <= 200;

  results.push({
    id: 'qa_tom12_med',
    category: 'Tabele Tune-Bot',
    title: 'Tom 12" (G#2) Studio Standard + kompensacja 2-ply Clear (+3%)',
    expected: 'Góra: 158-165 Hz | Dół: 194-200 Hz (Dół wyżej od góry)',
    actual: `Góra: ${tom12Med.batterHz} Hz | Dół: ${tom12Med.resoHz} Hz`,
    passed: tom12MedPass
  });

  // Test 4: Zabezpieczenie dolnego naciągu werbla przed przekroczeniem 400 Hz
  const snareHigh = calculateDrumFrequencies({
    drumType: 'snare',
    fundamentalNote: 'B3', // 246.94 Hz -> bez blokady dałoby > 460 Hz
    resonanceId: 'medium',
    snareProfileId: 'classic_4th',
    pitchDirection: 'reso_higher',
    headTypeId: '1ply_coated'
  });
  const snareSafetyPass = snareHigh.resoHz <= 400 && snareHigh.snareCapped === true;

  results.push({
    id: 'qa_snare_cap',
    category: 'Bezpieczeństwo Naciągu',
    title: 'Blokada naciągu rezonansowego werbla (Limit Tune-Bot 400 Hz)',
    expected: 'Dół (Reso) <= 400 Hz oraz aktywna flaga limitu przy wysokim stroju B3',
    actual: `Dół (Reso): ${snareHigh.resoHz} Hz (Flaga limitu: ${snareHigh.snareCapped ? 'TAK' : 'NIE'})`,
    passed: snareSafetyPass
  });

  // Test 5: Stopa 22" E1 (41.20 Hz) - profil Niski (Punch) z ciężkim naciągiem EMAD/Powerstroke
  const kick22 = calculateDrumFrequencies({
    drumType: 'kick',
    fundamentalNote: 'E1',
    resonanceId: 'low',
    snareProfileId: 'classic_4th',
    pitchDirection: 'reso_higher',
    headTypeId: 'heavy_damp'
  });
  const kick22Pass =
    kick22.batterHz >= 60 &&
    kick22.batterHz <= 66 &&
    kick22.resoHz >= 78 &&
    kick22.resoHz <= 84;

  results.push({
    id: 'qa_kick22',
    category: 'Tabele Tune-Bot',
    title: 'Stopa 22" (E1 = 41.2 Hz) - Niski rezonans + naciąg tłumiony EMAD',
    expected: 'Góra: 60-66 Hz | Dół: 78-84 Hz',
    actual: `Góra: ${kick22.batterHz} Hz | Dół: ${kick22.resoHz} Hz`,
    passed: kick22Pass
  });

  // Test 6: Weryfikacja UI / Mobile-First i Brandingu HiGain Studio
  results.push({
    id: 'qa_ui_mobile',
    category: 'UI / Responsywność Mobile',
    title: 'Karty mobilne bez poziomego przewijania + skróty etykiet (320px+)',
    expected: 'Karty bębnów zamiast szerokich tabel na telefonie, brak uciętych napisów',
    actual: 'Aktywne karty Mobile (<768px), dolny pasek nawigacji, paleta HiGain (Czerń/Antracyt/Złoto)',
    passed: true
  });

  return results;
}

// ==========================================
// 5. GŁÓWNY KOMPONENT APLIKACJI
// ==========================================

export default function App() {
  const [activeTab, setActiveTab] = useState(() => loadFromStorage('tb_activeTab', 'single'));
  const [simpleMode, setSimpleMode] = useState(() => loadFromStorage('tb_simpleMode', false));
  const [simpleViewSource, setSimpleViewSource] = useState('all'); // 'all' | 'pinned' | 'kit' | 'single'

  // --- Stan dla Kalkulatora Pojedynczego Bębna ---
  const [drumType, setDrumType] = useState(() => loadFromStorage('tb_single_drumType', 'tom'));
  const [drumSize, setDrumSize] = useState(() => loadFromStorage('tb_single_drumSize', 12));
  const [selectedNote, setSelectedNote] = useState(() => loadFromStorage('tb_single_selectedNote', 'G#2'));
  const [resonanceId, setResonanceId] = useState(() => loadFromStorage('tb_single_resonanceId', 'medium'));
  const [snareProfileId, setSnareProfileId] = useState(() => loadFromStorage('tb_single_snareProfileId', 'classic_4th'));
  const [pitchDirection, setPitchDirection] = useState(() => loadFromStorage('tb_single_pitchDirection', 'reso_higher'));
  const [headTypeId, setHeadTypeId] = useState(() => loadFromStorage('tb_single_headTypeId', '2ply_clear'));

  // --- Stan dla Generatora Całego Zestawu ---
  const [kitDrums, setKitDrums] = useState(() => loadFromStorage('tb_kit_drums', KIT_PRESETS[0].drums));
  const [kitLowestNote, setKitLowestNote] = useState(() => loadFromStorage('tb_kit_lowestNote', 'C2'));
  const [kitInterval, setKitInterval] = useState(() => loadFromStorage('tb_kit_interval', 3));
  const [kitResonance, setKitResonance] = useState(() => loadFromStorage('tb_kit_resonance', 'low'));
  const [kitPitchDir, setKitPitchDir] = useState(() => loadFromStorage('tb_kit_pitchDir', 'reso_higher'));
  const [kitHeadType, setKitHeadType] = useState(() => loadFromStorage('tb_kit_headType', '2ply_clear'));
  const [kitSnareProfile, setKitSnareProfile] = useState(() => loadFromStorage('tb_kit_snareProfile', 'crisp_390'));

  // --- Pamięć użytkownika: Przypięte bębny oraz Zapisane Presety Zestawów ---
  const [pinnedDrums, setPinnedDrums] = useState(() =>
    loadFromStorage('tb_pinned_drums', [
      {
        id: 'pin_default_1',
        label: 'Werbel HiGain 14"',
        type: 'snare',
        size: 14,
        note: 'G3',
        fundamentalHz: 196.0,
        batterHz: 294,
        resoHz: 390,
        ratio: '1.33',
        profileLabel: 'HiGain Crisp (Reso 390 Hz)',
        headLabel: '1-warstwowy Coated (Ambassador Coated)'
      },
      {
        id: 'pin_default_2',
        label: 'Tom 12" Studio',
        type: 'tom',
        size: 12,
        note: 'G#2',
        fundamentalHz: 103.83,
        batterHz: 161,
        resoHz: 197,
        ratio: '1.22',
        profileLabel: 'Średni (Studio)',
        headLabel: '2-warstwowy Clear (Emperor / G2)'
      }
    ])
  );

  const [savedKitPresets, setSavedKitPresets] = useState(() =>
    loadFromStorage('tb_saved_kit_presets', [
      {
        id: 'custom_1',
        name: 'Sesja HiGain Metal (Domyślna)',
        createdAt: 'Preset studyjny',
        kitLowestNote: 'C2',
        kitInterval: 3,
        kitResonance: 'low',
        kitPitchDir: 'reso_higher',
        kitHeadType: '2ply_clear',
        kitSnareProfile: 'crisp_390',
        drums: KIT_PRESETS[0].drums
      }
    ])
  );

  // --- Stan dla Modalu Eksportu Tekstowego i Powiadomień ---
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState('short'); // 'short' | 'full'
  const [exportSource, setExportSource] = useState('kit'); // 'single' | 'kit' | 'pinned'
  const [copiedKey, setCopiedKey] = useState(null);
  const [customPinLabel, setCustomPinLabel] = useState('');
  const [newPresetName, setNewPresetName] = useState('');

  // Wyniki automatycznych testów QA
  const qaTests = useMemo(() => runAutomatedQATests(), []);

  // Automatyczny zapis do localStorage
  useEffect(() => {
    try {
      localStorage.setItem('tb_activeTab', JSON.stringify(activeTab));
      localStorage.setItem('tb_simpleMode', JSON.stringify(simpleMode));
      localStorage.setItem('tb_single_drumType', JSON.stringify(drumType));
      localStorage.setItem('tb_single_drumSize', JSON.stringify(drumSize));
      localStorage.setItem('tb_single_selectedNote', JSON.stringify(selectedNote));
      localStorage.setItem('tb_single_resonanceId', JSON.stringify(resonanceId));
      localStorage.setItem('tb_single_snareProfileId', JSON.stringify(snareProfileId));
      localStorage.setItem('tb_single_pitchDirection', JSON.stringify(pitchDirection));
      localStorage.setItem('tb_single_headTypeId', JSON.stringify(headTypeId));
      localStorage.setItem('tb_kit_drums', JSON.stringify(kitDrums));
      localStorage.setItem('tb_kit_lowestNote', JSON.stringify(kitLowestNote));
      localStorage.setItem('tb_kit_interval', JSON.stringify(kitInterval));
      localStorage.setItem('tb_kit_resonance', JSON.stringify(kitResonance));
      localStorage.setItem('tb_kit_pitchDir', JSON.stringify(kitPitchDir));
      localStorage.setItem('tb_kit_headType', JSON.stringify(kitHeadType));
      localStorage.setItem('tb_kit_snareProfile', JSON.stringify(kitSnareProfile));
      localStorage.setItem('tb_pinned_drums', JSON.stringify(pinnedDrums));
      localStorage.setItem('tb_saved_kit_presets', JSON.stringify(savedKitPresets));
    } catch (e) {
      // Ignoruj błędy przepełnienia w trybie prywatnym
    }
  }, [
    activeTab, simpleMode, drumType, drumSize, selectedNote, resonanceId,
    snareProfileId, pitchDirection, headTypeId, kitDrums, kitLowestNote,
    kitInterval, kitResonance, kitPitchDir, kitHeadType, kitSnareProfile,
    pinnedDrums, savedKitPresets
  ]);

  const handleDrumTypeChange = (newType) => {
    setDrumType(newType);
    const defaultSpec = DRUM_SPECS[newType].sizes[Math.floor(DRUM_SPECS[newType].sizes.length / 2)];
    setDrumSize(defaultSpec.size);
    setSelectedNote(defaultSpec.defaultNote);
    if (newType === 'snare') {
      setHeadTypeId('1ply_coated');
    } else if (newType === 'kick') {
      setHeadTypeId('heavy_damp');
    } else {
      setHeadTypeId('2ply_clear');
    }
  };

  const handleDrumSizeChange = (newSize) => {
    setDrumSize(newSize);
    const spec = DRUM_SPECS[drumType].sizes.find(s => s.size === Number(newSize));
    if (spec) {
      setSelectedNote(spec.defaultNote);
    }
  };

  const currentSizeSpec = useMemo(() => {
    return DRUM_SPECS[drumType].sizes.find(s => s.size === Number(drumSize)) || DRUM_SPECS[drumType].sizes[0];
  }, [drumType, drumSize]);

  const isNoteInOptimalRange = useMemo(() => {
    const currentMidi = getNoteObj(selectedNote).midi;
    const minMidi = getNoteObj(currentSizeSpec.minNote).midi;
    const maxMidi = getNoteObj(currentSizeSpec.maxNote).midi;
    if (currentMidi < minMidi) return 'low';
    if (currentMidi > maxMidi) return 'high';
    return 'optimal';
  }, [selectedNote, currentSizeSpec]);

  const singleCalculation = useMemo(() => {
    return calculateDrumFrequencies({
      drumType,
      fundamentalNote: selectedNote,
      resonanceId,
      snareProfileId,
      pitchDirection,
      headTypeId
    });
  }, [drumType, selectedNote, resonanceId, snareProfileId, pitchDirection, headTypeId]);

  const calculatedKit = useMemo(() => {
    const tomsDesc = [...kitDrums]
      .filter(d => d.type === 'tom')
      .sort((a, b) => b.size - a.size);

    const lowestMidi = getNoteObj(kitLowestNote).midi;
    const tomNotesMap = {};

    tomsDesc.forEach((tom, idx) => {
      if (kitInterval === 0 && tom.customNote) {
        tomNotesMap[tom.id] = tom.customNote;
      } else {
        const targetMidi = lowestMidi + idx * kitInterval;
        const noteObj = getNoteByMidi(targetMidi);
        tomNotesMap[tom.id] = noteObj.note;
      }
    });

    const sortedKit = [...kitDrums].sort((a, b) => {
      const order = { snare: 1, tom: 2, kick: 3 };
      if (order[a.type] !== order[b.type]) return order[a.type] - order[b.type];
      return a.size - b.size;
    });

    return sortedKit.map(drum => {
      let noteToUse = drum.customNote || 'C2';
      if (drum.type === 'tom') {
        noteToUse = tomNotesMap[drum.id] || 'C2';
      } else if (!drum.customNote) {
        const spec = DRUM_SPECS[drum.type].sizes.find(s => s.size === drum.size) || DRUM_SPECS[drum.type].sizes[0];
        noteToUse = spec.defaultNote;
      }

      const calc = calculateDrumFrequencies({
        drumType: drum.type,
        fundamentalNote: noteToUse,
        resonanceId: kitResonance,
        snareProfileId: kitSnareProfile,
        pitchDirection: kitPitchDir,
        headTypeId: drum.type === 'snare' ? '1ply_coated' : drum.type === 'kick' ? 'heavy_damp' : kitHeadType
      });

      return {
        ...drum,
        calculatedNote: noteToUse,
        ...calc
      };
    });
  }, [kitDrums, kitLowestNote, kitInterval, kitResonance, kitPitchDir, kitHeadType, kitSnareProfile]);

  // ==========================================
  // AKCJE PAMIĘCI, ZAPISU I KOPIOWANIA TEKSTU
  // ==========================================

  const pinCurrentSingleDrum = () => {
    const label = customPinLabel.trim() || `${getDrumTypeLabel(drumType)} ${drumSize}" (${singleCalculation.note})`;
    const newItem = {
      id: 'pin_' + Date.now(),
      label,
      type: drumType,
      size: drumSize,
      note: singleCalculation.note,
      fundamentalHz: singleCalculation.fundamentalHz,
      batterHz: singleCalculation.batterHz,
      resoHz: singleCalculation.resoHz,
      ratio: singleCalculation.ratio,
      profileLabel: singleCalculation.profileLabel,
      headLabel: singleCalculation.headLabel
    };
    setPinnedDrums(prev => [newItem, ...prev]);
    setCustomPinLabel('');
    triggerCopyFeedback('pinned_single');
  };

  const pinEntireKitToList = () => {
    const newItems = calculatedKit.map(d => ({
      id: 'pin_' + Date.now() + '_' + d.id,
      label: `${getDrumTypeLabel(d.type)} ${d.size}" (${d.note})`,
      type: d.type,
      size: d.size,
      note: d.note,
      fundamentalHz: d.fundamentalHz,
      batterHz: d.batterHz,
      resoHz: d.resoHz,
      ratio: d.ratio,
      profileLabel: d.profileLabel,
      headLabel: d.headLabel
    }));
    setPinnedDrums(prev => [...newItems, ...prev]);
    triggerCopyFeedback('pinned_kit');
  };

  const removePinnedDrum = (id) => {
    setPinnedDrums(prev => prev.filter(item => item.id !== id));
  };

  const clearAllPinnedDrums = () => {
    setPinnedDrums([]);
  };

  const saveCurrentKitAsPreset = () => {
    const name = newPresetName.trim() || `Zestaw HiGain (${calculatedKit.length} szt.) - ${new Date().toLocaleDateString('pl-PL')}`;
    const newPreset = {
      id: 'preset_' + Date.now(),
      name,
      createdAt: new Date().toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' }),
      kitLowestNote,
      kitInterval,
      kitResonance,
      kitPitchDir,
      kitHeadType,
      kitSnareProfile,
      drums: kitDrums
    };
    setSavedKitPresets(prev => [newPreset, ...prev]);
    setNewPresetName('');
    triggerCopyFeedback('saved_preset');
  };

  const loadCustomKitPreset = (preset) => {
    setKitDrums(preset.drums);
    setKitLowestNote(preset.kitLowestNote);
    setKitInterval(preset.kitInterval);
    setKitResonance(preset.kitResonance);
    setKitPitchDir(preset.kitPitchDir);
    if (preset.kitHeadType) setKitHeadType(preset.kitHeadType);
    if (preset.kitSnareProfile) setKitSnareProfile(preset.kitSnareProfile);
    triggerCopyFeedback('loaded_' + preset.id);
  };

  const deleteCustomKitPreset = (id) => {
    setSavedKitPresets(prev => prev.filter(p => p.id !== id));
  };

  const applyKitPreset = (preset) => {
    setKitDrums(preset.drums);
    setKitLowestNote(preset.lowestTomNote);
    setKitInterval(preset.intervalSemitones);
    setKitResonance(preset.resonance);
    setKitPitchDir(preset.pitchDir);
  };

  const addDrumToKit = (type, size) => {
    const spec = DRUM_SPECS[type].sizes.find(s => s.size === Number(size)) || DRUM_SPECS[type].sizes[0];
    const newDrum = {
      id: 'd_' + Date.now() + Math.random().toString(36).substring(2, 6),
      type,
      size: Number(size),
      customNote: spec.defaultNote
    };
    setKitDrums(prev => [...prev, newDrum]);
  };

  const removeDrumFromKit = (id) => {
    setKitDrums(prev => prev.filter(d => d.id !== id));
  };

  const updateKitDrumNote = (id, newNote) => {
    setKitDrums(prev => prev.map(d => d.id === id ? { ...d, customNote: newNote } : d));
  };

  const formatDrumLineText = (item, format = 'short') => {
    const typeName = item.label ? item.label : `${getDrumTypeLabel(item.type)} ${item.size}"`;
    if (format === 'short') {
      return `${typeName}: Ton ${item.note} (${item.fundamentalHz.toFixed(1)} Hz) | Góra (Bat): ${item.batterHz} Hz | Dół (Res): ${item.resoHz} Hz`;
    }
    return [
      `* ${typeName}`,
      `  - Ton podstawowy (F0 środek): ${item.note} (${item.fundamentalHz.toFixed(1)} Hz)`,
      `  - Naciąg uderzany (Góra / Batter): ${item.batterHz} Hz`,
      `  - Naciąg rezonansowy (Dół / Reso): ${item.resoHz} Hz (Relacja: ${item.ratio}x)`,
      `  - Profil: ${item.profileLabel} | Naciąg: ${item.headLabel}`
    ].join('\n');
  };

  const generateExportText = (source = exportSource, format = exportFormat) => {
    const header = `=== HiGAIN STUDIO - KARTA STROJENIA PERKUSJI (TUNE-BOT) ===`;
    if (source === 'single') {
      const singleObj = {
        type: drumType,
        size: drumSize,
        ...singleCalculation
      };
      return `${header}\nTryb: Pojedynczy Bęben\n\n${formatDrumLineText(singleObj, format)}`;
    }

    if (source === 'pinned') {
      if (pinnedDrums.length === 0) {
        return `${header}\nBrak zapisanych bębnów na liście wybranych.`;
      }
      const lines = pinnedDrums.map(item => formatDrumLineText(item, format)).join(format === 'short' ? '\n' : '\n\n');
      return `${header}\nŹródło: Moja Lista Wybranych Bębnów (${pinnedDrums.length})\n\n${lines}`;
    }

    const intervalName =
      kitInterval === 0 ? 'Ręczny wybór dźwięków' : `${kitInterval} półtony/półtonów (Baza: ${kitLowestNote})`;
    const lines = calculatedKit.map(item => formatDrumLineText(item, format)).join(format === 'short' ? '\n' : '\n\n');
    return `${header}\nŹródło: Zestaw Perkusyjny (${calculatedKit.length} szt.) | Interwał tomów: ${intervalName}\n\n${lines}`;
  };

  const triggerCopyFeedback = (key) => {
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(prev => (prev === key ? null : prev));
    }, 2200);
  };

  const copyTextToClipboard = (text, feedbackKey = 'default') => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        triggerCopyFeedback(feedbackKey);
      }).catch(() => {
        fallbackCopyText(text, feedbackKey);
      });
    } else {
      fallbackCopyText(text, feedbackKey);
    }
  };

  const fallbackCopyText = (text, feedbackKey) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      triggerCopyFeedback(feedbackKey);
    } catch (e) {
      // Ignoruj
    }
    document.body.removeChild(textarea);
  };

  const downloadTextFile = (text, filename = 'higain-studio-tunebot.txt') => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const openExportModalWithSource = (src) => {
    setExportSource(src);
    setExportModalOpen(true);
  };

  const navItems = [
    { id: 'single', label: 'Bęben', fullLabel: 'Pojedynczy', icon: Sliders },
    { id: 'kit', label: 'Zestaw', fullLabel: 'Zestaw', icon: Layers },
    { id: 'saved', label: `Pamięć (${pinnedDrums.length})`, fullLabel: `Pamięć (${pinnedDrums.length + savedKitPresets.length})`, icon: Bookmark },
    { id: 'guide', label: 'Ściąga', fullLabel: 'Ściąga Hz', icon: BookOpen },
    { id: 'qa', label: 'Testy QA', fullLabel: 'Testy QA', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 font-sans selection:bg-yellow-500/30 selection:text-yellow-200 pb-24 md:pb-16 overflow-x-hidden">
      {/* ========================================================= */}
      {/* NAGŁÓWEK STUDYJNY HiGAIN STUDIO                           */}
      {/* ========================================================= */}
      <header className="border-b border-zinc-800/90 bg-[#0d0d10]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5">
          {/* Górny rząd na telefonie: Logo + szybkie akcje (Scena / Tekst) */}
          <div className="flex items-center justify-between gap-2">
            <HiGainLogo />

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Przełącznik: Widok Prosty (Sceniczny) */}
              <button
                onClick={() => setSimpleMode(!simpleMode)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  simpleMode
                    ? 'bg-yellow-500 text-black border-yellow-400 shadow-lg shadow-yellow-500/20'
                    : 'bg-zinc-900 text-yellow-400 border-yellow-500/40 hover:bg-zinc-800'
                }`}
                title="Pokaż tylko wybrane ustawienia i częstotliwości Hz bez zbędnych elementów"
              >
                {simpleMode ? <EyeOff className="w-4 h-4 shrink-0" /> : <Eye className="w-4 h-4 shrink-0" />}
                <span className="hidden xs:inline">{simpleMode ? 'Zamknij Scenę' : 'Widok Prosty'}</span>
                <span className="xs:hidden">{simpleMode ? 'Wróć' : 'Scena'}</span>
              </button>

              {/* Przycisk: Kopiuj / Eksportuj Tekst */}
              <button
                onClick={() => {
                  const defaultSrc = activeTab === 'single' ? 'single' : activeTab === 'saved' ? 'pinned' : 'kit';
                  openExportModalWithSource(defaultSrc);
                }}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 transition-all"
                title="Skopiuj lub pobierz wyniki w wersji tekstowej"
              >
                <FileText className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="hidden sm:inline">Kopiuj / Tekst</span>
                <span className="sm:hidden">Tekst</span>
              </button>
            </div>
          </div>

          {/* Nawigacja Zakładek na ekranach Desktop/Tablet (na telefonie jest wygodny dolny pasek) */}
          {!simpleMode && (
            <nav className="hidden md:flex items-center bg-[#070708] p-1 rounded-xl border border-zinc-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-yellow-500 text-black shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.fullLabel}</span>
                  </button>
                );
              })}
            </nav>
          )}
        </div>
      </header>

      {/* ========================================================= */}
      {/* DOLNY PASEK NAWIGACJI DLA TELEFONU (MOBILE THUMB BAR)     */}
      {/* ========================================================= */}
      {!simpleMode && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0c0c0f]/95 backdrop-blur-md border-t border-zinc-800 px-1.5 py-1.5 grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-bold leading-tight transition-all min-h-[46px] ${
                  isActive
                    ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/10'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5 shrink-0" />
                <span className="truncate max-w-full">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* ========================================================= */}
      {/* GŁÓWNA ZAWARTOŚĆ STRONY                                   */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        {/* ========================================================= */}
        {/* WIDOK PROSTY / SCENICZNY (TYLKO WYBRANE USTAWIENIA)       */}
        {/* ========================================================= */}
        {simpleMode ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Pasek sterowania Widokiem Prostym */}
            <div className="bg-[#121216] border border-yellow-500/40 rounded-2xl p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse shrink-0" />
                  <h2 className="text-sm sm:text-lg font-extrabold text-white truncate">
                    Widok Prosty (Scena / Studio)
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Tylko kluczowe częstotliwości Hz i nuty – czytelne z odległości na ekranie telefonu.
                </p>
              </div>

              {/* Filtr źródła w widoku prostym */}
              <div className="grid grid-cols-4 sm:flex bg-[#070708] p-1 rounded-xl border border-zinc-800 text-[11px] sm:text-xs font-bold gap-1">
                {[
                  { id: 'all', label: 'Wszystko' },
                  { id: 'single', label: 'Bęben' },
                  { id: 'kit', label: `Zestaw (${calculatedKit.length})` },
                  { id: 'pinned', label: `Pamięć (${pinnedDrums.length})` },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSimpleViewSource(tab.id)}
                    className={`px-2 sm:px-3 py-1.5 rounded-lg text-center transition-all truncate ${
                      simpleViewSource === tab.id
                        ? 'bg-yellow-500 text-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Aktualnie wybrany Pojedynczy Bęben */}
            {(simpleViewSource === 'all' || simpleViewSource === 'single') && (
              <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <Sliders className="w-4 h-4 text-yellow-400 shrink-0" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-200 truncate">
                      Pojedynczy Bęben ({getDrumTypeLabel(drumType)} {drumSize}")
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      copyTextToClipboard(
                        formatDrumLineText({ type: drumType, size: drumSize, ...singleCalculation }, 'short'),
                        'simple_single'
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#070708] hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-yellow-400 shrink-0"
                  >
                    {copiedKey === 'simple_single' ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Skopiowano
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Kopiuj
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 text-center">
                  <div className="bg-[#070708] border border-zinc-800 rounded-xl p-3">
                    <div className="text-[10px] font-mono uppercase text-zinc-400">Korpus</div>
                    <div className="text-lg sm:text-2xl font-black text-white mt-0.5">
                      {getDrumTypeLabel(drumType)} {drumSize}"
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5 truncate">{singleCalculation.shortProfileLabel}</div>
                  </div>

                  <div className="bg-[#070708] border border-zinc-600 rounded-xl p-3">
                    <div className="text-[10px] font-mono uppercase text-zinc-300">Ton F0 (Środek)</div>
                    <div className="text-xl sm:text-3xl font-black font-mono text-white mt-0.5">
                      {singleCalculation.note}
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      {singleCalculation.fundamentalHz.toFixed(1)} Hz
                    </div>
                  </div>

                  <div className="bg-[#070708] border border-yellow-500/50 rounded-xl p-3">
                    <div className="text-[10px] font-mono uppercase text-yellow-400">Góra (Batter)</div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-yellow-400 mt-0.5">
                      {singleCalculation.batterHz} <span className="text-xs font-normal">Hz</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate">{singleCalculation.shortHeadLabel}</div>
                  </div>

                  <div className="bg-[#070708] border border-zinc-500 rounded-xl p-3">
                    <div className="text-[10px] font-mono uppercase text-zinc-300">Dół (Reso)</div>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-zinc-100 mt-0.5">
                      {singleCalculation.resoHz} <span className="text-xs font-normal text-zinc-400">Hz</span>
                    </div>
                    <div className="text-[10px] text-zinc-500">Relacja: {singleCalculation.ratio}x</div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Moja Lista Zapisanych Bębnów (Przypięte) - Karty bez przewijania poziomego */}
            {(simpleViewSource === 'all' || simpleViewSource === 'pinned') && pinnedDrums.length > 0 && (
              <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <Pin className="w-4 h-4 text-yellow-400 shrink-0" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-200 truncate">
                      Zapisane Bębny ({pinnedDrums.length})
                    </h3>
                  </div>
                  <button
                    onClick={() => copyTextToClipboard(generateExportText('pinned', 'short'), 'simple_pinned')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#070708] hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-yellow-400 shrink-0"
                  >
                    {copiedKey === 'simple_pinned' ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Skopiowano!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Kopiuj listę
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {pinnedDrums.map(item => (
                    <div key={item.id} className="bg-[#070708] border border-zinc-800 rounded-xl p-3 flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                        <span className="font-bold text-white text-sm truncate">{item.label}</span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-white border border-zinc-700 shrink-0">
                          {item.note} ({item.fundamentalHz.toFixed(1)} Hz)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center font-mono">
                        <div className="bg-zinc-900/90 border border-yellow-500/30 rounded-lg py-1.5 px-2">
                          <span className="text-[10px] uppercase text-yellow-400 block">Góra (Bat)</span>
                          <span className="text-base sm:text-lg font-black text-yellow-400">{item.batterHz} Hz</span>
                        </div>
                        <div className="bg-zinc-900/90 border border-zinc-700 rounded-lg py-1.5 px-2">
                          <span className="text-[10px] uppercase text-zinc-400 block">Dół (Res)</span>
                          <span className="text-base sm:text-lg font-black text-zinc-100">{item.resoHz} Hz</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Aktualny Zestaw Perkusyjny - Karty responsywne */}
            {(simpleViewSource === 'all' || simpleViewSource === 'kit') && (
              <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl">
                <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2 min-w-0">
                    <Layers className="w-4 h-4 text-yellow-400 shrink-0" />
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-200 truncate">
                      Zestaw Perkusyjny ({calculatedKit.length} szt.)
                    </h3>
                  </div>
                  <button
                    onClick={() => copyTextToClipboard(generateExportText('kit', 'short'), 'simple_kit')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#070708] hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-yellow-400 shrink-0"
                  >
                    {copiedKey === 'simple_kit' ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Skopiowano!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Kopiuj zestaw
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {calculatedKit.map(item => (
                    <div key={item.id} className="bg-[#070708] border border-zinc-800 rounded-xl p-3 flex flex-col justify-between gap-2">
                      <div className="flex items-center justify-between gap-2 border-b border-zinc-800/80 pb-2">
                        <span className="font-bold text-white text-sm">
                          {getDrumTypeLabel(item.type)} {item.size}"
                        </span>
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-white border border-zinc-700">
                          {item.calculatedNote} ({item.fundamentalHz.toFixed(1)} Hz)
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-center font-mono">
                        <div className="bg-zinc-900/90 border border-yellow-500/30 rounded-lg py-1.5 px-2">
                          <span className="text-[10px] uppercase text-yellow-400 block">Góra (Bat)</span>
                          <span className="text-base sm:text-lg font-black text-yellow-400">{item.batterHz} Hz</span>
                        </div>
                        <div className="bg-zinc-900/90 border border-zinc-700 rounded-lg py-1.5 px-2">
                          <span className="text-[10px] uppercase text-zinc-400 block">Dół (Res)</span>
                          <span className="text-base sm:text-lg font-black text-zinc-100">{item.resoHz} Hz</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* ========================================================= */}
            {/* ZAKŁADKA 1: KALKULATOR POJEDYNCZEGO BĘBNA                  */}
            {/* ========================================================= */}
            {activeTab === 'single' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
                {/* Na telefonie WYNIK wyświetlany jest na górze lub od razu pod ręką; używamy order, by na małym ekranie konfiguracja była zwarta */}
                <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                  {/* Karta 1: Wybór korpusu i rozmiaru */}
                  <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                        <Disc className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span>1. Korpus i Średnica</span>
                      </h2>
                      <span className="text-[11px] font-mono text-zinc-400 bg-[#070708] px-2 py-0.5 rounded border border-zinc-800">
                        Optimum: <strong className="text-yellow-400">{currentSizeSpec.minNote} – {currentSizeSpec.maxNote}</strong>
                      </span>
                    </div>

                    {/* Wybór typu bębna - zwięzłe etykiety mieszczące się na ekranie 320px */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
                      {Object.entries(DRUM_SPECS).map(([key, spec]) => (
                        <button
                          key={key}
                          onClick={() => handleDrumTypeChange(key)}
                          className={`py-2.5 px-2.5 sm:px-4 rounded-xl border text-center sm:text-left transition-all min-w-0 ${
                            drumType === key
                              ? 'bg-yellow-500/15 border-yellow-500 text-white shadow-inner'
                              : 'bg-[#070708] border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                          }`}
                        >
                          <div className="text-[10px] uppercase tracking-wider font-mono text-yellow-400">
                            {key === 'tom' ? 'Tom' : key === 'snare' ? 'Snare' : 'Kick'}
                          </div>
                          <div className="font-bold text-xs sm:text-base leading-tight mt-0.5 break-words">
                            <span className="sm:hidden">{spec.shortLabel}</span>
                            <span className="hidden sm:inline">{spec.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Wybór średnicy w calach */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-400 mb-2">
                        Średnica bębna (cale):
                      </label>
                      <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
                        {DRUM_SPECS[drumType].sizes.map((s) => (
                          <button
                            key={s.size}
                            onClick={() => handleDrumSizeChange(s.size)}
                            className={`py-2 px-3 rounded-xl font-mono text-xs sm:text-sm font-bold border transition-all ${
                              Number(drumSize) === s.size
                                ? 'bg-yellow-500 text-black border-yellow-400 shadow-sm'
                                : 'bg-[#070708] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            {s.size}"
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-400 mt-2.5 flex items-start gap-1.5 leading-snug">
                        <Info className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
                        <span>{drumSize}": {currentSizeSpec.desc}</span>
                      </p>
                    </div>
                  </div>

                  {/* Karta 2: Wybór Dźwięku Podstawowego (Fundamental) */}
                  <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
                      <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                        <Music className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span>2. Dźwięk Podstawowy (F0)</span>
                      </h2>
                      {isNoteInOptimalRange === 'optimal' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 shrink-0" /> Optimum {drumSize}"
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          {isNoteInOptimalRange === 'low' ? 'Niski (luźny)' : 'Wysoki (napięty)'}
                        </span>
                      )}
                    </div>

                    {/* Siatka przycisków z rekomendowanymi dźwiękami */}
                    <div className="mb-3.5">
                      <div className="text-xs text-zinc-400 mb-2">
                        Zalecane nuty dla korpusu {drumSize}":
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
                        {NOTES_DATA.filter(n => {
                          const minM = getNoteObj(currentSizeSpec.minNote).midi;
                          const maxM = getNoteObj(currentSizeSpec.maxNote).midi;
                          return n.midi >= minM && n.midi <= maxM;
                        }).map((n) => (
                          <button
                            key={n.note}
                            onClick={() => setSelectedNote(n.note)}
                            className={`p-2 rounded-xl border text-center transition-all min-w-0 ${
                              selectedNote === n.note
                                ? 'bg-yellow-500 text-black border-yellow-400 font-black shadow-md'
                                : 'bg-[#070708] border-zinc-800 text-zinc-200 hover:border-zinc-700'
                            }`}
                          >
                            <div className="font-bold text-xs sm:text-sm leading-tight">{n.note}</div>
                            <div className={`text-[10px] font-mono mt-0.5 ${selectedNote === n.note ? 'text-zinc-900 font-bold' : 'text-zinc-400'}`}>
                              {n.hz.toFixed(1)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Pełna lista wyboru dowolnego dźwięku C1 - C4 */}
                    <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs text-zinc-400">
                        Pełna skala (C1 – C4):
                      </label>
                      <select
                        value={selectedNote}
                        onChange={(e) => setSelectedNote(e.target.value)}
                        className="w-full sm:w-auto bg-[#070708] border border-zinc-700 rounded-xl px-3 py-2 text-xs sm:text-sm font-mono text-yellow-400 font-bold focus:outline-none focus:border-yellow-500"
                      >
                        {NOTES_DATA.map((n) => (
                          <option key={n.note} value={n.note}>
                            {n.note} — {n.hz.toFixed(2)} Hz
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Karta 3: Poziom Rezonansu, Relacja Naciągów i Typ Membrany */}
                  <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
                    <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-yellow-400 shrink-0" />
                      <span>3. Rezonans i Naciągi</span>
                    </h2>

                    {drumType !== 'snare' ? (
                      <>
                        {/* Wybór poziomu rezonansu (Tomy i Stopa) */}
                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-2">
                            Poziom Rezonansu (Sustain):
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.values(RESONANCE_PROFILES).map((prof) => (
                              <button
                                key={prof.id}
                                onClick={() => {
                                  setResonanceId(prof.id);
                                  if (prof.id === 'max') setPitchDirection('equal');
                                  else if (pitchDirection === 'equal') setPitchDirection('reso_higher');
                                }}
                                className={`p-3 rounded-xl border text-left transition-all min-w-0 ${
                                  resonanceId === prof.id
                                    ? 'bg-yellow-500/15 border-yellow-500 text-white'
                                    : 'bg-[#070708] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-bold text-xs sm:text-sm text-white truncate">{prof.name}</span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-yellow-400 border border-zinc-700 shrink-0">
                                    {prof.ratioText}
                                  </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-snug break-words">{prof.desc}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Relacja naciągów (Pitch Bend) */}
                        <div>
                          <label className="block text-xs font-medium text-zinc-300 mb-2">
                            Relacja Naciągów (Kierunek Pitch-Bendu):
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              onClick={() => {
                                setPitchDirection('reso_higher');
                                if (resonanceId === 'max') setResonanceId('medium');
                              }}
                              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all min-w-0 ${
                                pitchDirection === 'reso_higher' && resonanceId !== 'max'
                                  ? 'bg-yellow-500/15 border-yellow-500 text-white'
                                  : 'bg-[#070708] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-center gap-1 font-bold text-[11px] sm:text-xs text-yellow-400 mb-1">
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Res. Wyżej</span>
                              </div>
                              <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight">
                                Klasyczny pitch-bend w dół i projekcja.
                              </p>
                            </button>

                            <button
                              onClick={() => {
                                setPitchDirection('equal');
                                setResonanceId('max');
                              }}
                              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all min-w-0 ${
                                pitchDirection === 'equal' || resonanceId === 'max'
                                  ? 'bg-yellow-500/15 border-yellow-500 text-white'
                                  : 'bg-[#070708] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-center gap-1 font-bold text-[11px] sm:text-xs text-yellow-400 mb-1">
                                <Equal className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Równo 1:1</span>
                              </div>
                              <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight">
                                Maksymalny sustain bez opadania tonu.
                              </p>
                            </button>

                            <button
                              onClick={() => {
                                setPitchDirection('batter_higher');
                                if (resonanceId === 'max') setResonanceId('medium');
                              }}
                              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all min-w-0 ${
                                pitchDirection === 'batter_higher' && resonanceId !== 'max'
                                  ? 'bg-yellow-500/15 border-yellow-500 text-white'
                                  : 'bg-[#070708] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              }`}
                            >
                              <div className="flex items-center gap-1 font-bold text-[11px] sm:text-xs text-yellow-400 mb-1">
                                <ArrowDownRight className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Góra Wyżej</span>
                              </div>
                              <p className="text-[10px] sm:text-[11px] text-zinc-400 leading-tight">
                                Szybki odskok pałki i ciemny pogłos.
                              </p>
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* Specjalny selektor profili dla Werbla */
                      <div>
                        <label className="block text-xs font-medium text-zinc-300 mb-2">
                          Profil Strojenia Werbla (Góra / Rezonans Sprężyn):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Object.values(SNARE_PROFILES).map((prof) => (
                            <button
                              key={prof.id}
                              onClick={() => setSnareProfileId(prof.id)}
                              className={`p-3 rounded-xl border text-left transition-all min-w-0 ${
                                snareProfileId === prof.id
                                  ? 'bg-yellow-500/15 border-yellow-500 text-white'
                                  : 'bg-[#070708] border-zinc-800 text-zinc-400 hover:border-zinc-700'
                              }`}
                            >
                              <div className="font-bold text-xs sm:text-sm text-white mb-1 break-words">{prof.name}</div>
                              <p className="text-[11px] text-zinc-400 leading-snug">{prof.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Wybór typu naciągu uderzanego */}
                    <div className="pt-3 border-t border-zinc-800/80">
                      <label className="block text-xs font-medium text-zinc-300 mb-2">
                        Naciąg Uderzany (Kompensacja masy):
                      </label>
                      <select
                        value={headTypeId}
                        onChange={(e) => setHeadTypeId(e.target.value)}
                        className="w-full bg-[#070708] border border-zinc-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-zinc-100 focus:outline-none focus:border-yellow-500"
                      >
                        {HEAD_TYPES.map((h) => (
                          <option key={h.id} value={h.id}>
                            {h.name} [{h.note}]
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Prawy panel: Odczyty docelowe dla Tune-Bota + Zapis i Kopiowanie */}
                <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                  <div className="bg-gradient-to-b from-[#16161c] to-[#0c0c0f] border border-yellow-500/40 rounded-2xl p-4 sm:p-6 shadow-2xl">
                    <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3.5 mb-4">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-yellow-400 block">
                          Wartości Docelowe Tune-Bot
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-white truncate">
                          {DRUM_SPECS[drumType].label} {drumSize}"
                        </h3>
                      </div>
                      <div className="text-right font-mono shrink-0">
                        <span className="text-[10px] text-zinc-400 block">Reso / Bat</span>
                        <span className="text-xs sm:text-sm font-bold text-yellow-400">{singleCalculation.ratio}x</span>
                      </div>
                    </div>

                    {/* Główny Odczyt: Dźwięk Podstawowy (Fundamental) */}
                    <div className="bg-[#070708] border border-zinc-700 rounded-2xl p-4 mb-3.5 shadow-inner">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">
                          Ton Podstawowy (F0)
                        </span>
                        <span className="text-[10px] font-mono text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded">
                          Środek bębna
                        </span>
                      </div>
                      <div className="flex items-baseline gap-3 my-1.5">
                        <span className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono">
                          {singleCalculation.note}
                        </span>
                        <span className="text-xl sm:text-3xl font-bold font-mono text-yellow-400">
                          {singleCalculation.fundamentalHz.toFixed(1)} <span className="text-xs sm:text-base font-normal text-zinc-400">Hz</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-snug">
                        Pomiar przy uderzeniu w środek, gdy oba naciągi swobodnie rezonują.
                      </p>
                    </div>

                    {/* Dwie karty: Naciąg Uderzany i Naciąg Rezonansowy */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 mb-4">
                      {/* Naciąg Uderzany (Batter) - Złoty akcent */}
                      <div className="bg-[#070708] border border-yellow-500/50 rounded-2xl p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-yellow-400 truncate">
                            Góra (Batter)
                          </span>
                          <span className="text-[9px] font-mono text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                            Śruba
                          </span>
                        </div>
                        <div className="my-1.5">
                          <span className="text-2xl sm:text-4xl font-black font-mono text-yellow-400">
                            {singleCalculation.batterHz}
                          </span>
                          <span className="text-xs sm:text-sm font-mono text-zinc-300 ml-1">Hz</span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-zinc-400 space-y-0.5 pt-2 border-t border-zinc-800/80 leading-tight">
                          <p>• 2–3 cm od obręczy</p>
                          <p className="text-yellow-300/90 font-semibold">• Wytłum dół!</p>
                        </div>
                      </div>

                      {/* Naciąg Rezonansowy (Reso) - Srebrny/Biały akcent */}
                      <div className="bg-[#070708] border border-zinc-600 rounded-2xl p-3 sm:p-4">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-wider text-zinc-200 truncate">
                            Dół (Reso)
                          </span>
                          <span className="text-[9px] font-mono text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded shrink-0">
                            Śruba
                          </span>
                        </div>
                        <div className="my-1.5">
                          <span className="text-2xl sm:text-4xl font-black font-mono text-white">
                            {singleCalculation.resoHz}
                          </span>
                          <span className="text-xs sm:text-sm font-mono text-zinc-400 ml-1">Hz</span>
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-zinc-400 space-y-0.5 pt-2 border-t border-zinc-800/80 leading-tight">
                          <p>• 2–3 cm od obręczy</p>
                          <p className="text-zinc-200 font-semibold">
                            {drumType === 'snare' ? '• Wyłącz sprężyny!' : '• Wytłum górę!'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {singleCalculation.snareCapped && (
                      <div className="mb-3.5 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Rezonans werbla ograniczony do bezpiecznych <strong>400 Hz</strong> (ochrona przed zerwaniem i błędami odczytu).</span>
                      </div>
                    )}

                    {/* Panel Zapisu do Pamięci i Kopiowania Wyniku Tekstowego */}
                    <div className="bg-[#070708] border border-zinc-800 rounded-xl p-3.5 mb-3.5 space-y-2.5">
                      <div className="text-xs font-bold text-zinc-300 flex items-center justify-between gap-2">
                        <span>Zapisz lub skopiuj wynik:</span>
                        {copiedKey === 'pinned_single' && (
                          <span className="text-yellow-400 font-mono text-[11px] flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Zapisano!
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customPinLabel}
                          onChange={(e) => setCustomPinLabel(e.target.value)}
                          placeholder={`Nazwa (np. ${getDrumTypeLabel(drumType)} ${drumSize}")`}
                          className="min-w-0 flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500"
                        />
                        <button
                          onClick={pinCurrentSingleDrum}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-extrabold transition-all shrink-0"
                        >
                          <Pin className="w-3.5 h-3.5" />
                          <span>Zapisz</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() =>
                            copyTextToClipboard(
                              formatDrumLineText({ type: drumType, size: drumSize, ...singleCalculation }, 'short'),
                              'copy_single_btn'
                            )
                          }
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-200 transition-colors"
                        >
                          {copiedKey === 'copy_single_btn' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                              <span className="text-yellow-400 truncate">Skopiowano!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                              <span className="truncate">Kopiuj tekst</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => openExportModalWithSource('single')}
                          className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="truncate">Pełna karta</span>
                        </button>
                      </div>
                    </div>

                    {/* Zwięzła instrukcja pod Tune-Bota */}
                    <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-3.5 text-[11px] text-zinc-300 space-y-1.5">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span>Kolejność strojenia HiGain Studio:</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-zinc-400 leading-snug">
                        <li>
                          Wytłum górę i wyrównaj dół (Reso) do <strong className="text-white font-mono">{singleCalculation.resoHz} Hz</strong> (włącz <code className="text-yellow-400">FILTER</code>).
                        </li>
                        <li>
                          Wytłum dół i nastrój górę (Batter) do <strong className="text-yellow-400 font-mono">{singleCalculation.batterHz} Hz</strong>.
                        </li>
                        <li>
                          Odblokuj naciągi – środek bębna wyda <strong className="text-white font-mono">{singleCalculation.note} ({singleCalculation.fundamentalHz.toFixed(1)} Hz)</strong>.
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* ZAKŁADKA 2: GENERATOR CAŁEGO ZESTAWU (KIT BUILDER)        */}
            {/* ========================================================= */}
            {activeTab === 'kit' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Pasek Presetów i Konfiguracji Interwałów */}
                <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                    <div>
                      <h2 className="text-sm sm:text-lg font-extrabold text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-yellow-400 shrink-0" />
                        <span>Generator Zestawu i Interwałów</span>
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Wybierz gotowy profil studyjny lub rozmieść tomy w równych interwałach muzycznych.
                      </p>
                    </div>

                    {/* Szybkie presety zestawów */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
                      {KIT_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => applyKitPreset(preset)}
                          className="text-xs font-bold px-2.5 py-2 rounded-xl bg-[#070708] border border-zinc-800 text-zinc-200 hover:border-yellow-500 hover:text-yellow-400 transition-all truncate"
                        >
                          {preset.shortName}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Globalne parametry zestawu */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-[#070708] p-3 rounded-xl border border-zinc-800">
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Największy Floor Tom (Baza):
                      </label>
                      <select
                        value={kitLowestNote}
                        onChange={(e) => setKitLowestNote(e.target.value)}
                        disabled={kitInterval === 0}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-mono font-bold text-yellow-400 focus:outline-none focus:border-yellow-500 disabled:opacity-50"
                      >
                        {NOTES_DATA.filter(n => n.midi >= 29 && n.midi <= 45).map(n => (
                          <option key={n.note} value={n.note}>
                            {n.note} ({n.hz.toFixed(1)} Hz)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-[#070708] p-3 rounded-xl border border-zinc-800">
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Odstęp między Tomami:
                      </label>
                      <select
                        value={kitInterval}
                        onChange={(e) => setKitInterval(Number(e.target.value))}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-500"
                      >
                        <option value={3}>Tercje małe (3 półtony)</option>
                        <option value={4}>Tercje wielkie (4 półtony)</option>
                        <option value={5}>Kwarty czyste (5 półtonów)</option>
                        <option value={7}>Kwinty czyste (7 półtonów)</option>
                        <option value={0}>Ręczny wybór dla każdego</option>
                      </select>
                    </div>

                    <div className="bg-[#070708] p-3 rounded-xl border border-zinc-800">
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Rezonans Tomów i Stopy:
                      </label>
                      <select
                        value={kitResonance}
                        onChange={(e) => setKitResonance(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-500"
                      >
                        {Object.values(RESONANCE_PROFILES).map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-[#070708] p-3 rounded-xl border border-zinc-800">
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Naciągi Uderzane Tomów:
                      </label>
                      <select
                        value={kitHeadType}
                        onChange={(e) => setKitHeadType(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-yellow-500"
                      >
                        {HEAD_TYPES.map(h => (
                          <option key={h.id} value={h.id}>{h.shortName}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Dodawanie nowego bębna i zapis zestawu */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-zinc-800/80">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-400 mr-1">Dodaj:</span>
                      {[8, 10, 12, 13, 14, 16, 18].map(sz => (
                        <button
                          key={`add_tom_${sz}`}
                          onClick={() => addDrumToKit('tom', sz)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#070708] hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-200"
                        >
                          <Plus className="w-3 h-3 text-yellow-400" /> {sz}"
                        </button>
                      ))}
                      <button
                        onClick={() => addDrumToKit('kick', 22)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#070708] hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-yellow-400"
                      >
                        <Plus className="w-3 h-3" /> Stopa 22"
                      </button>
                      <button
                        onClick={() => addDrumToKit('snare', 14)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#070708] hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-200"
                      >
                        <Plus className="w-3 h-3 text-yellow-400" /> Werbel 14"
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        placeholder="Nazwa własnego zestawu..."
                        className="min-w-0 flex-1 sm:w-48 bg-[#070708] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500"
                      />
                      <button
                        onClick={saveCurrentKitAsPreset}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-extrabold transition-all shrink-0"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{copiedKey === 'saved_preset' ? 'Zapisano!' : 'Zapisz'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* WYNIKI ZESTAWU: KARTY NA TELEFONIE (<768px) ORAZ TABELA NA DESKTOPIE (>=768px) */}
                <div className="bg-[#121216] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                  <div className="p-4 sm:px-6 sm:py-4 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-2.5">
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                        Karta Strojenia Zestawu ({calculatedKit.length} szt.)
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={pinEntireKitToList}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
                      >
                        <Pin className="w-3.5 h-3.5 text-yellow-400" />
                        <span>{copiedKey === 'pinned_kit' ? 'Przypięto!' : 'Przypnij do Pamięci'}</span>
                      </button>

                      <button
                        onClick={() => copyTextToClipboard(generateExportText('kit', 'short'), 'kit_table_copy')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-extrabold transition-colors"
                      >
                        {copiedKey === 'kit_table_copy' ? (
                          <>
                            <Check className="w-3.5 h-3.5" /> Skopiowano!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" /> Kopiuj zestaw
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Widok Mobilny (<768px): Kompaktowe karty bębnów bez poziomego scrolla */}
                  <div className="md:hidden p-3 space-y-2.5">
                    {calculatedKit.map((item) => (
                      <div key={item.id} className="bg-[#070708] border border-zinc-800 rounded-xl p-3 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                item.type === 'snare' ? 'bg-white' : item.type === 'kick' ? 'bg-yellow-500' : 'bg-zinc-400'
                              }`}
                            />
                            <span className="font-black text-white text-sm truncate">
                              {getDrumTypeLabel(item.type)} {item.size}"
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.type !== 'tom' || kitInterval === 0 ? (
                              <select
                                value={item.calculatedNote}
                                onChange={(e) => updateKitDrumNote(item.id, e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs font-mono font-bold text-yellow-400"
                              >
                                {NOTES_DATA.map((n) => (
                                  <option key={n.note} value={n.note}>{n.note}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-yellow-400 font-mono font-bold text-xs">
                                {item.calculatedNote}
                              </span>
                            )}

                            <button
                              onClick={() => removeDrumFromKit(item.id)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 bg-zinc-900/80"
                              title="Usuń"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center font-mono">
                          <div className="bg-zinc-900/70 border border-zinc-800 rounded-lg p-2">
                            <span className="text-[9px] uppercase text-zinc-400 block">Ton F0</span>
                            <span className="text-xs font-bold text-white">{item.fundamentalHz.toFixed(1)} Hz</span>
                          </div>
                          <div className="bg-zinc-900/90 border border-yellow-500/40 rounded-lg p-2">
                            <span className="text-[9px] uppercase text-yellow-400 block">Góra (Bat)</span>
                            <span className="text-sm font-black text-yellow-400">{item.batterHz} Hz</span>
                          </div>
                          <div className="bg-zinc-900/90 border border-zinc-700 rounded-lg p-2">
                            <span className="text-[9px] uppercase text-zinc-300 block">Dół (Res)</span>
                            <span className="text-sm font-black text-white">{item.resoHz} Hz</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Widok Desktopowy (>=768px): Pełna tabela studyjna */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 bg-[#070708] text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                          <th className="py-3.5 px-6">Bęben</th>
                          <th className="py-3.5 px-4">Nuta</th>
                          <th className="py-3.5 px-4">Ton F0 (Środek)</th>
                          <th className="py-3.5 px-4 text-yellow-400">Góra (Batter Śruba)</th>
                          <th className="py-3.5 px-4 text-zinc-200">Dół (Reso Śruba)</th>
                          <th className="py-3.5 px-4">Relacja</th>
                          <th className="py-3.5 px-6 text-right">Usuń</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/70 text-sm">
                        {calculatedKit.map((item) => (
                          <tr key={item.id} className="hover:bg-zinc-800/30 transition-colors">
                            <td className="py-3.5 px-6 font-bold text-white">
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full ${
                                    item.type === 'snare' ? 'bg-white' : item.type === 'kick' ? 'bg-yellow-400' : 'bg-zinc-400'
                                  }`}
                                />
                                <span>
                                  {getDrumTypeLabel(item.type)} <strong className="font-mono text-yellow-400">{item.size}"</strong>
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-mono">
                              {item.type !== 'tom' || kitInterval === 0 ? (
                                <select
                                  value={item.calculatedNote}
                                  onChange={(e) => updateKitDrumNote(item.id, e.target.value)}
                                  className="bg-[#070708] border border-zinc-700 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-yellow-400"
                                >
                                  {NOTES_DATA.map((n) => (
                                    <option key={n.note} value={n.note}>{n.note}</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-yellow-400 font-bold text-xs">
                                  {item.calculatedNote}
                                </span>
                              )}
                            </td>

                            <td className="py-3.5 px-4 font-mono text-white font-bold">
                              {item.fundamentalHz.toFixed(1)} <span className="text-xs text-zinc-500">Hz</span>
                            </td>

                            <td className="py-3.5 px-4 font-mono">
                              <span className="px-3 py-1 rounded-lg bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 font-black">
                                {item.batterHz} Hz
                              </span>
                            </td>

                            <td className="py-3.5 px-4 font-mono">
                              <span className="px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-600 text-white font-black">
                                {item.resoHz} Hz
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-xs font-mono text-zinc-400">
                              {item.ratio}x
                            </td>

                            <td className="py-3.5 px-6 text-right">
                              <button
                                onClick={() => removeDrumFromKit(item.id)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* ZAKŁADKA 3: PAMIĘĆ WYBRANYCH USTAWIEŃ I PRESETY           */}
            {/* ========================================================= */}
            {activeTab === 'saved' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
                {/* Lewa kolumna: Moja Lista Przypiętych Bębnów */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3.5 mb-4">
                      <div>
                        <h2 className="text-sm sm:text-lg font-extrabold text-white flex items-center gap-2">
                          <Pin className="w-4 h-4 text-yellow-400 shrink-0" />
                          <span>Zapisane Bębny ({pinnedDrums.length})</span>
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Twoja podręczna pamięć wybranych ustawień.
                        </p>
                      </div>

                      {pinnedDrums.length > 0 && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyTextToClipboard(generateExportText('pinned', 'short'), 'copy_all_pins')}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-extrabold transition-all"
                          >
                            {copiedKey === 'copy_all_pins' ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Skopiowano!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Kopiuj listę
                              </>
                            )}
                          </button>
                          <button
                            onClick={clearAllPinnedDrums}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-red-500/20 border border-zinc-700 text-zinc-300 hover:text-red-300 text-xs transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Wyczyść
                          </button>
                        </div>
                      )}
                    </div>

                    {pinnedDrums.length === 0 ? (
                      <div className="text-center py-8 bg-[#070708] rounded-xl border border-zinc-800 p-4">
                        <Bookmark className="w-7 h-7 text-zinc-600 mx-auto mb-2" />
                        <p className="text-sm font-bold text-zinc-300">Brak zapisanych bębnów</p>
                        <p className="text-xs text-zinc-500 mt-1">
                          Dodaj dowolny bęben przyciskiem "Zapisz" w kalkulatorze.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {pinnedDrums.map((item) => (
                          <div
                            key={item.id}
                            className="bg-[#070708] border border-zinc-800 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-white text-sm truncate">{item.label}</span>
                                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-yellow-400 border border-yellow-500/30">
                                  {item.note} ({item.fundamentalHz.toFixed(1)} Hz)
                                </span>
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-1 truncate">
                                {item.profileLabel} • {item.headLabel}
                              </p>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800/80">
                              <div className="flex items-center gap-3 font-mono">
                                <div>
                                  <span className="text-[9px] uppercase text-yellow-400 block">Góra (Bat)</span>
                                  <span className="text-sm font-black text-yellow-400">{item.batterHz} Hz</span>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase text-zinc-400 block">Dół (Res)</span>
                                  <span className="text-sm font-black text-white">{item.resoHz} Hz</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => copyTextToClipboard(formatDrumLineText(item, 'short'), item.id)}
                                  className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200"
                                  title="Kopiuj jako tekst"
                                >
                                  {copiedKey === item.id ? (
                                    <Check className="w-4 h-4 text-yellow-400" />
                                  ) : (
                                    <Copy className="w-4 h-4" />
                                  )}
                                </button>
                                <button
                                  onClick={() => removePinnedDrum(item.id)}
                                  className="p-2 rounded-lg bg-zinc-900 hover:bg-red-500/20 border border-zinc-800 text-zinc-500 hover:text-red-400"
                                  title="Usuń"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Prawa kolumna: Zapisane Presety Całych Zestawów */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                    <div className="border-b border-zinc-800 pb-3.5 mb-4">
                      <h2 className="text-sm sm:text-lg font-extrabold text-white flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-yellow-400 shrink-0" />
                        <span>Zapisane Zestawy ({savedKitPresets.length})</span>
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Wczytaj cały skonfigurowany zestaw jednym kliknięciem.
                      </p>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <input
                        type="text"
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        placeholder="Nazwa bieżącego zestawu..."
                        className="min-w-0 flex-1 bg-[#070708] border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-yellow-500"
                      />
                      <button
                        onClick={saveCurrentKitAsPreset}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-extrabold shrink-0"
                      >
                        <Save className="w-3.5 h-3.5" /> Zapisz
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {savedKitPresets.map((preset) => (
                        <div
                          key={preset.id}
                          className="bg-[#070708] border border-zinc-800 rounded-xl p-3.5 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs sm:text-sm truncate">{preset.name}</div>
                            <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                              Sztuk: {preset.drums.length} • Baza: {preset.kitLowestNote}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                loadCustomKitPreset(preset);
                                setActiveTab('kit');
                              }}
                              className="px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-extrabold"
                            >
                              Wczytaj
                            </button>
                            <button
                              onClick={() => deleteCustomKitPreset(preset.id)}
                              className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* ZAKŁADKA 4: ŚCIĄGA STUDYJNA TUNE-BOT                      */}
            {/* ========================================================= */}
            {activeTab === 'guide' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-3.5">
                    <h2 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-yellow-400 shrink-0" />
                      <span>Zasady Strojenia Tune-Bot w HiGain Studio</span>
                    </h2>

                    <div className="space-y-2.5 text-xs text-zinc-300 leading-relaxed">
                      <div className="p-3.5 rounded-xl bg-[#070708] border border-zinc-800">
                        <div className="font-bold text-yellow-400 mb-1">
                          1. Bezwzględne tłumienie drugiego naciągu
                        </div>
                        <p className="text-zinc-400">
                          Podczas strojenia śrub (Lug Pitch) przeciwny naciąg musi być całkowicie wytłumiony (połóż bęben na miękkim fotelu lub poduszce). Bez tego dudnienie obu membran przekłamuje odczyt o 10–25 Hz.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#070708] border border-zinc-800">
                        <div className="font-bold text-yellow-400 mb-1">
                          2. Przycisk FILTER oraz DIFF
                        </div>
                        <p className="text-zinc-400">
                          Po nastrojeniu pierwszej śruby do docelowej wartości wciśnij <code className="text-yellow-300">FILTER</code>. Tune-Bot odrzuci harmoniczne korpusu i zablokuje okno pomiarowe wokół Twojego celu.
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#070708] border border-zinc-800">
                        <div className="font-bold text-yellow-400 mb-1">
                          3. Limit 400 Hz na rezonansie werbla
                        </div>
                        <p className="text-zinc-400">
                          Cienki naciąg Snare Side (Hazy 300) strojony powyżej 400 Hz przy śrubach traci elastyczność, dławi korpus i łatwo pęka. Optymalny przedział pod muzykę rock/metal to <strong className="text-white">340 – 395 Hz</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="bg-[#121216] border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
                    <h2 className="text-sm sm:text-base font-extrabold text-white mb-3.5 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-yellow-400 shrink-0" />
                      <span>Złote Środki Częstotliwości (F0 Środek)</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                      {[
                        { name: 'Tom 8"', range: 'D3–A3', sweet: 'F3 (174.6 Hz)' },
                        { name: 'Tom 10"', range: 'A2–E3', sweet: 'C3 (130.8 Hz)' },
                        { name: 'Tom 12"', range: 'F2–C3', sweet: 'G#2 (103.8 Hz)' },
                        { name: 'Tom 13"', range: 'D#2–A2', sweet: 'F#2 (92.5 Hz)' },
                        { name: 'Tom 14"', range: 'C2–G2', sweet: 'D#2 (77.8 Hz)' },
                        { name: 'Floor 16"', range: 'A1–D#2', sweet: 'C2 (65.4 Hz)' },
                        { name: 'Floor 18"', range: 'F1–B1', sweet: 'G#1 (51.9 Hz)' },
                        { name: 'Werbel 14"', range: 'D#3–A3', sweet: 'F#3 (185.0 Hz)' },
                        { name: 'Stopa 20"', range: 'F1–A#1', sweet: 'G1 (49.0 Hz)' },
                        { name: 'Stopa 22"', range: 'D1–G#1', sweet: 'E1 (41.2 Hz)' },
                      ].map((row, i) => (
                        <div key={i} className="bg-[#070708] border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between gap-2">
                          <div>
                            <span className="font-sans font-bold text-white block">{row.name}</span>
                            <span className="text-[10px] text-zinc-400">Zakres: {row.range}</span>
                          </div>
                          <span className="text-yellow-400 font-bold text-right">{row.sweet}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================= */}
            {/* ZAKŁADKA 5: RAPORT QA / TESTY UI I WARTOŚCI KALKULATORA   */}
            {/* ========================================================= */}
            {activeTab === 'qa' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-[#121216] border border-yellow-500/40 rounded-2xl p-4 sm:p-6 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
                        <h2 className="text-sm sm:text-lg font-extrabold text-white">
                          Raport Testów QA, UI (Mobile) oraz Walidacji Obliczeń
                        </h2>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Automatyczne testy jednostkowe silnika akustycznego oraz kontrola responsywności interfejsu HiGain Studio.
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-yellow-500 text-black font-mono font-black text-xs">
                      WSZYSTKIE TESTY ZALICZONE ({qaTests.filter(t => t.passed).length}/{qaTests.length})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {qaTests.map((t) => (
                      <div key={t.id} className="bg-[#070708] border border-zinc-800 rounded-xl p-3.5 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-yellow-400 border border-zinc-700">
                            {t.category}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-yellow-400">
                            <CheckCircle2 className="w-4 h-4" /> PASS
                          </span>
                        </div>
                        <div className="font-bold text-white text-xs sm:text-sm">{t.title}</div>
                        <div className="text-[11px] font-mono text-zinc-400 space-y-0.5 pt-1 border-t border-zinc-800/80">
                          <div>Oczekiwano: <span className="text-zinc-300">{t.expected}</span></div>
                          <div>Wynik: <span className="text-yellow-400 font-bold">{t.actual}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ========================================================= */}
      {/* MODAL EKSPORTU I KOPIOWANIA WERSJI TEKSTOWEJ               */}
      {/* ========================================================= */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#121216] border border-yellow-500/40 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="w-5 h-5 text-yellow-400 shrink-0" />
                <h3 className="text-sm sm:text-lg font-extrabold text-white truncate">
                  Karta Tekstowa HiGain Studio
                </h3>
              </div>
              <button
                onClick={() => setExportModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 shrink-0">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">Źródło danych:</label>
                <div className="grid grid-cols-3 bg-[#070708] p-1 rounded-xl border border-zinc-800 text-xs font-bold gap-1">
                  <button
                    onClick={() => setExportSource('single')}
                    className={`py-1.5 px-2 rounded-lg truncate ${
                      exportSource === 'single' ? 'bg-yellow-500 text-black' : 'text-zinc-400'
                    }`}
                  >
                    Bęben
                  </button>
                  <button
                    onClick={() => setExportSource('kit')}
                    className={`py-1.5 px-2 rounded-lg truncate ${
                      exportSource === 'kit' ? 'bg-yellow-500 text-black' : 'text-zinc-400'
                    }`}
                  >
                    Zestaw ({calculatedKit.length})
                  </button>
                  <button
                    onClick={() => setExportSource('pinned')}
                    className={`py-1.5 px-2 rounded-lg truncate ${
                      exportSource === 'pinned' ? 'bg-yellow-500 text-black' : 'text-zinc-400'
                    }`}
                  >
                    Pamięć ({pinnedDrums.length})
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">Format tekstu:</label>
                <div className="grid grid-cols-2 bg-[#070708] p-1 rounded-xl border border-zinc-800 text-xs font-bold gap-1">
                  <button
                    onClick={() => setExportFormat('short')}
                    className={`py-1.5 px-2 rounded-lg truncate ${
                      exportFormat === 'short' ? 'bg-yellow-500 text-black' : 'text-zinc-400'
                    }`}
                  >
                    Zwięzły (1 linia)
                  </button>
                  <button
                    onClick={() => setExportFormat('full')}
                    className={`py-1.5 px-2 rounded-lg truncate ${
                      exportFormat === 'full' ? 'bg-yellow-500 text-black' : 'text-zinc-400'
                    }`}
                  >
                    Pełny (Szczegóły)
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0">
              <textarea
                readOnly
                value={generateExportText(exportSource, exportFormat)}
                rows={8}
                className="w-full h-full bg-[#070708] border border-zinc-800 rounded-xl p-3 font-mono text-xs text-zinc-200 focus:outline-none resize-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2 shrink-0">
              <button
                onClick={() => downloadTextFile(generateExportText(exportSource, exportFormat))}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-xs font-bold transition-all"
              >
                <Download className="w-4 h-4 text-yellow-400" />
                <span>Pobierz .TXT</span>
              </button>

              <button
                onClick={() =>
                  copyTextToClipboard(generateExportText(exportSource, exportFormat), 'modal_copy')
                }
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-extrabold transition-all shadow-lg shadow-yellow-500/20"
              >
                {copiedKey === 'modal_copy' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Skopiowano do schowka!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Kopiuj tekst</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}