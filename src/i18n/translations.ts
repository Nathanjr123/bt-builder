import type { Language } from '../types';

// All UI strings live here, keyed by a stable identifier. Node-specific
// labels/descriptions live in nodeDefinitions.ts (also bilingual).
export const TRANSLATIONS = {
  appTitle: { en: 'Behavior Tree Builder', pl: 'Kreator Drzewa Zachowań' },
  appSubtitle: {
    en: 'Visually configure your AI agent strategy',
    pl: 'Wizualnie skonfiguruj strategię agenta AI',
  },

  // Palette
  paletteTitle: { en: 'Node Palette', pl: 'Paleta węzłów' },
  togglePalette: { en: 'Toggle palette', pl: 'Przełącz paletę' },
  paletteHint: {
    en: 'Drag onto the canvas, or click to add at the centre.',
    pl: 'Przeciągnij na planszę lub kliknij, aby dodać na środku.',
  },
  categoryComposite: { en: 'Composite Nodes', pl: 'Węzły złożone' },
  categoryCondition: { en: 'Condition Nodes', pl: 'Węzły warunkowe' },
  categoryAction: { en: 'Action Nodes', pl: 'Węzły akcji' },

  // Property panel
  propertiesTitle: { en: 'Properties', pl: 'Właściwości' },
  noSelection: {
    en: 'Select a node on the canvas to edit its properties.',
    pl: 'Zaznacz węzeł na planszy, aby edytować jego właściwości.',
  },
  customLabel: { en: 'Custom Label', pl: 'Etykieta własna' },
  customLabelPlaceholder: { en: 'e.g. Emergency Healing', pl: 'np. Awaryjne leczenie' },
  nodeType: { en: 'Node Type', pl: 'Typ węzła' },
  description: { en: 'Description', pl: 'Opis' },
  parameters: { en: 'Parameters', pl: 'Parametry' },
  deleteNode: { en: 'Delete Node', pl: 'Usuń węzeł' },

  // Toolbar / actions
  addNode: { en: 'Add', pl: 'Dodaj' },
  clearCanvas: { en: 'Clear Canvas', pl: 'Wyczyść planszę' },
  clearConfirm: {
    en: 'Remove all nodes and connections?',
    pl: 'Usunąć wszystkie węzły i połączenia?',
  },
  loadExample: { en: 'Load Example', pl: 'Wczytaj przykład' },
  fitView: { en: 'Fit View', pl: 'Dopasuj widok' },

  // Export panel
  exportTitle: { en: 'YAML Preview', pl: 'Podgląd YAML' },
  exportButton: { en: 'Export to YAML', pl: 'Eksportuj do YAML' },
  copyButton: { en: 'Copy', pl: 'Kopiuj' },
  copied: { en: 'Copied!', pl: 'Skopiowano!' },
  showExport: { en: 'Show Code', pl: 'Pokaż kod' },
  hideExport: { en: 'Hide Code', pl: 'Ukryj kod' },
  minimizePanel: { en: 'Minimize', pl: 'Minimalizuj' },
  restorePanel: { en: 'Restore', pl: 'Przywróć' },
  closePanel: { en: 'Close', pl: 'Zamknij' },
  enterFullscreen: { en: 'Fullscreen', pl: 'Pełny ekran' },
  exitFullscreen: { en: 'Exit fullscreen', pl: 'Zamknij pełny ekran' },

  // Validation
  validationOk: { en: 'Tree is valid.', pl: 'Drzewo jest poprawne.' },
  validationTitle: { en: 'Validation', pl: 'Walidacja' },
  warnNoRoot: {
    en: 'No root node found. Add a Selector or Sequence with no parent.',
    pl: 'Brak węzła głównego. Dodaj Selektor lub Sekwencję bez rodzica.',
  },
  warnMultipleRoots: {
    en: 'Multiple root nodes detected. Only the first is exported.',
    pl: 'Wykryto wiele węzłów głównych. Eksportowany jest tylko pierwszy.',
  },
  warnRootNotComposite: {
    en: 'The root should be a composite node (Selector or Sequence).',
    pl: 'Węzeł główny powinien być węzłem złożonym (Selektor lub Sekwencja).',
  },
  warnLeafHasChildren: {
    en: 'Condition/Action nodes cannot have children: ',
    pl: 'Węzły warunkowe/akcji nie mogą mieć dzieci: ',
  },
  warnEmptyCanvas: {
    en: 'Canvas is empty. Add a node to begin.',
    pl: 'Plansza jest pusta. Dodaj węzeł, aby rozpocząć.',
  },

  // Help / guide
  help: { en: 'Help', pl: 'Pomoc' },
  guideTitle: { en: 'How to use the BT Builder', pl: 'Jak korzystać z Kreatora BT' },
  guideIntro: {
    en: 'Build your AI agent strategy in four simple steps. No coding needed — just drag, connect, configure, and export.',
    pl: 'Zbuduj strategię agenta AI w czterech prostych krokach. Bez kodowania — przeciągnij, połącz, skonfiguruj i eksportuj.',
  },
  step1Title: { en: '1 · Add nodes', pl: '1 · Dodaj węzły' },
  step1Body: {
    en: 'Drag a node from the left palette onto the canvas, or click it to drop one in the centre. Start with a Selector or Sequence as your root.',
    pl: 'Przeciągnij węzeł z palety po lewej na planszę lub kliknij, aby dodać go na środku. Zacznij od Selektora lub Sekwencji jako korzenia.',
  },
  step2Title: { en: '2 · Connect them', pl: '2 · Połącz je' },
  step2Body: {
    en: 'Drag from a composite node’s bottom dot to another node’s top dot. The node with no parent is the root. Each node keeps only one parent.',
    pl: 'Przeciągnij od dolnej kropki węzła złożonego do górnej kropki innego węzła. Węzeł bez rodzica jest korzeniem. Każdy węzeł ma jednego rodzica.',
  },
  step3Title: { en: '3 · Configure', pl: '3 · Skonfiguruj' },
  step3Body: {
    en: 'Click any node to open the Properties panel on the right. Give it a custom label and set its values (e.g. health threshold, ability name).',
    pl: 'Kliknij węzeł, aby otworzyć panel Właściwości po prawej. Nadaj etykietę i ustaw wartości (np. próg zdrowia, nazwę zdolności).',
  },
  step4Title: { en: '4 · Export', pl: '4 · Eksportuj' },
  step4Body: {
    en: 'The YAML preview updates live and flags problems. When the Validation banner is green, click Export to YAML to download your strategy file.',
    pl: 'Podgląd YAML aktualizuje się na żywo i sygnalizuje błędy. Gdy baner Walidacji jest zielony, kliknij Eksportuj do YAML, aby pobrać plik.',
  },
  legendTitle: { en: 'Node types', pl: 'Typy węzłów' },
  legendComposite: {
    en: 'Composite — control flow. Selector (?) tries children until one works; Sequence (->) runs them in order.',
    pl: 'Złożone — sterowanie przepływem. Selektor (?) próbuje dzieci po kolei; Sekwencja (->) uruchamia je po kolei.',
  },
  legendCondition: {
    en: 'Condition — a yes/no check (health, cooldown, distance, status effect).',
    pl: 'Warunkowe — sprawdzenie tak/nie (zdrowie, odnowienie, dystans, efekt statusu).',
  },
  legendAction: {
    en: 'Action — something the agent does (cast, use item, move, interact).',
    pl: 'Akcji — coś, co robi agent (rzuca, używa przedmiotu, idzie, wchodzi w interakcję).',
  },
  tryExampleTitle: { en: 'Try a ready-made example', pl: 'Wypróbuj gotowy przykład' },
  tryExampleBody: {
    en: 'Load a sample strategy to see a complete tree and its YAML instantly.',
    pl: 'Wczytaj przykładową strategię, aby od razu zobaczyć kompletne drzewo i jego YAML.',
  },
  loadThis: { en: 'Load this', pl: 'Wczytaj to' },
  gotIt: { en: 'Got it — start building', pl: 'Rozumiem — zacznij budować' },
  dontShowAgain: { en: 'Don’t show this automatically', pl: 'Nie pokazuj automatycznie' },

  // Profiles / persistence
  profileTitle: { en: 'Choose your profile', pl: 'Wybierz swój profil' },
  profileIntro: {
    en: 'Pick a profile name to load and continue your work — no password needed. Your tree is saved automatically.',
    pl: 'Wybierz nazwę profilu, aby wczytać i kontynuować pracę — bez hasła. Twoje drzewo zapisuje się automatycznie.',
  },
  existingProfiles: { en: 'Continue a profile', pl: 'Kontynuuj profil' },
  noProfilesYet: { en: 'No saved profiles yet.', pl: 'Brak zapisanych profili.' },
  newProfile: { en: 'Create a new profile', pl: 'Utwórz nowy profil' },
  profileNamePlaceholder: { en: 'e.g. KayuuWow', pl: 'np. KayuuWow' },
  createAndContinue: { en: 'Create & continue', pl: 'Utwórz i kontynuuj' },
  continueLabel: { en: 'Continue', pl: 'Kontynuuj' },
  switchProfile: { en: 'Switch profile', pl: 'Zmień profil' },
  loadingProfiles: { en: 'Loading…', pl: 'Wczytywanie…' },
  cloudOn: { en: 'Cloud sync on — available on any device', pl: 'Synchronizacja w chmurze — dostępne na każdym urządzeniu' },
  cloudOff: { en: 'Local mode — saved on this device only', pl: 'Tryb lokalny — zapis tylko na tym urządzeniu' },
  saving: { en: 'Saving…', pl: 'Zapisywanie…' },
  saved: { en: 'Saved', pl: 'Zapisano' },
  saveError: { en: 'Save failed', pl: 'Błąd zapisu' },
  profileTaken: { en: 'That name already exists — continue it below.', pl: 'Ta nazwa już istnieje — kontynuuj ją poniżej.' },
  signedInAs: { en: 'Profile', pl: 'Profil' },

  // Misc
  language: { en: 'Language', pl: 'Język' },
  close: { en: 'Close', pl: 'Zamknij' },
  emptyCanvasHint: {
    en: 'Drag a node from the palette, or click one to start building.',
    pl: 'Przeciągnij węzeł z palety lub kliknij, aby rozpocząć budowę.',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS;

export function translate(key: TranslationKey, lang: Language): string {
  return TRANSLATIONS[key][lang];
}
