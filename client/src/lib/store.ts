// Global State Management for KidsFinance Pro
// All data is persisted to localStorage

export interface Lesson {
  id: string | number;
  t: string; // title
  e: string; // emoji
  ct: string; // content
  x: number; // xp
  p?: string[]; // points
  ex?: string; // extra info
  c?: string; // color
  q: Quiz[]; // questions
  _c?: boolean; // custom flag
}

export interface Quiz {
  q: string; // question
  o: string[]; // options
  c: number; // correct answer index
}

export interface Challenge {
  id: string | number;
  t: string; // title
  e: string; // emoji
  d: string; // description
  a: string | number; // answer
  x: number; // xp
  h: string; // hint
  _c?: boolean; // custom flag
}

export interface Transaction {
  amt: number;
  type: 'in' | 'out';
  desc: string;
  date: string;
  time: string;
}

export interface Goal {
  n: string; // name
  a: number; // amount
}

export interface AppState {
  // User info
  name: string;
  lang: 'en' | 'de' | 'fr' | 'es';
  pin: string;

  // Progress
  xp: number;
  streak: number;
  dL: string[]; // done lessons (ids)
  dC: string[]; // done challenges (ids)

  // Piggy bank
  piggy: number;
  tx: Transaction[];
  goal: Goal | null;

  // Custom content
  cL: Lesson[];
  cC: Challenge[];

  // Theme
  theme?: 'purple' | 'blue' | 'green' | 'orange' | 'pink' | 'dark';

  // Current state
  curL?: Lesson;
  curC?: Challenge;
  qStep?: number;
  qSc?: number;
  qAns?: boolean;
}

const DEFAULT_STATE: AppState = {
  name: 'Kid',
  lang: 'en',
  pin: '1234',
  xp: 0,
  streak: 0,
  dL: [],
  dC: [],
  piggy: 0,
  tx: [],
  goal: null,
  cL: [],
  cC: [],
};

const STORAGE_KEY = 'kidsfinance_pro_state';

export function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_STATE, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return { ...DEFAULT_STATE };
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function resetState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// Import comprehensive lessons
import { COMPREHENSIVE_LESSONS, COMPREHENSIVE_CHALLENGES } from './lessons-content';

// Default lessons data - mapped from comprehensive content
export const LESSONS: Lesson[] = COMPREHENSIVE_LESSONS.map(l => ({
  id: l.id,
  t: l.title,
  e: l.emoji,
  ct: l.content,
  x: l.xp,
  p: l.keyPoints,
  ex: l.example,
  c: '#6366f1',
  q: l.questions,
}));

export const CHALLENGES: Challenge[] = COMPREHENSIVE_CHALLENGES.map(c => ({
  id: c.id,
  t: c.title,
  e: c.emoji,
  d: c.description,
  a: c.answer,
  x: c.xp,
  h: c.hint,
}));

export const LEVELS = [
  { x: 0, n: 'Saving Basics', e: '🐣' },
  { x: 100, n: 'Money Learner', e: '🐥' },
  { x: 250, n: 'Smart Saver', e: '🐔' },
  { x: 500, n: 'Finance Expert', e: '🦅' },
  { x: 1000, n: 'Money Master', e: '👑' },
];

export const TRANSLATIONS = {
  en: {
    appSub: 'Learn money the fun way!',
    lessons: 'Lessons',
    challenges: 'Challenges',
    piggyBank: 'Piggy Bank',
    badges: 'Badges',
    parentArea: 'Parent Area',
    parentSub: 'Add lessons, challenges & more',
    balance: 'balance',
    totalIn: 'Total In ↑',
    totalOut: 'Total Out ↓',
    savingsGoal: '🎯 Savings Goal',
    goalName: 'Goal name',
    goalAmt: '$',
    setGoal: 'Set Goal',
    addMoney: '💰 Add Money',
    iSpent: '💸 I Spent',
    pinRequired: '🔐 Parent PIN required',
    whereFrom: 'Where from? (e.g. allowance, chores)',
    addMoneyBtn: 'Add Money ✓',
    whatBought: 'What did you buy?',
    recordSpending: 'Record Spending 💸',
    history: '📋 History',
    entries: 'entries',
    backToLessons: 'Back to Lessons',
    takeQuiz: 'Take the Quiz! 🧠',
    checkAnswer: 'Check Answer ✓',
    tryAgain: 'Try Again',
    next: 'Next →',
    finish: 'Finish! 🎉',
    lessonComplete: 'Lesson Complete!',
    keepPracticing: 'Keep Practicing!',
    correct: 'Correct!',
    notQuite: 'Not quite!',
    hint: 'Hint:',
    enterPin: 'Enter →',
    wrongPin: 'Wrong PIN.',
    pinDefault: 'PIN (default: 1234)',
    progress: 'CHILD PROGRESS',
    bonusXP: 'BONUS XP',
    giveXP: 'Give!',
    resetProgress: '🗑️ Reset Progress',
    addLesson: 'ADD CUSTOM LESSON',
    addChallenge: 'ADD CUSTOM CHALLENGE',
    saved: 'SAVED',
    saveLesson: '💾 Save Lesson',
    saveChallenge: '💾 Save Challenge',
    childName: 'CHILD NAME',
    changePin: 'CHANGE PIN',
    backup: 'BACKUP',
    saveNow: '💾 Save Now',
    exportJSON: '📤 Export JSON',
    save: '💾 Save',
    noTx: 'No transactions yet 👀',
    goalReached: '✅ Goal reached! 🎉',
    installApp: 'Install as App',
    installSub: 'Add to homescreen — works offline!',
    install: 'Install',
    streak: 'day streak',
    maxLevel: '🏆 Max Level!',
    xpTo: 'XP to',
    score: 'Score:',
    earnedXP: 'XP Earned! ⭐',
  },
  de: {
    appSub: 'Lerne Geld auf spielerische Art!',
    lessons: 'Lektionen',
    challenges: 'Aufgaben',
    piggyBank: 'Sparschwein',
    badges: 'Abzeichen',
    parentArea: 'Elternbereich',
    parentSub: 'Lektionen, Aufgaben & mehr',
    balance: 'Guthaben',
    totalIn: 'Einnahmen ↑',
    totalOut: 'Ausgaben ↓',
    savingsGoal: '🎯 Sparziel',
    goalName: 'Zielname',
    goalAmt: 'CHF',
    setGoal: 'Ziel setzen',
    addMoney: '💰 Geld hinzufügen',
    iSpent: '💸 Ausgegeben',
    pinRequired: '🔐 Eltern-PIN erforderlich',
    whereFrom: 'Woher? (z.B. Taschengeld, Aufgaben)',
    addMoneyBtn: 'Geld hinzufügen ✓',
    whatBought: 'Was hast du gekauft?',
    recordSpending: 'Ausgabe eintragen 💸',
    history: '📋 Verlauf',
    entries: 'Einträge',
    backToLessons: 'Zurück zu Lektionen',
    takeQuiz: 'Quiz starten! 🧠',
    checkAnswer: 'Antwort prüfen ✓',
    tryAgain: 'Nochmal versuchen',
    next: 'Weiter →',
    finish: 'Fertig! 🎉',
    lessonComplete: 'Lektion abgeschlossen!',
    keepPracticing: 'Weiter üben!',
    correct: 'Richtig!',
    notQuite: 'Nicht ganz!',
    hint: 'Hinweis:',
    enterPin: 'Einloggen →',
    wrongPin: 'Falscher PIN.',
    pinDefault: 'PIN (Standard: 1234)',
    progress: 'FORTSCHRITT',
    bonusXP: 'BONUS XP',
    giveXP: 'Geben!',
    resetProgress: '🗑️ Fortschritt zurücksetzen',
    addLesson: 'EIGENE LEKTION HINZUFÜGEN',
    addChallenge: 'EIGENE AUFGABE HINZUFÜGEN',
    saved: 'GESPEICHERT',
    saveLesson: '💾 Lektion speichern',
    saveChallenge: '💾 Aufgabe speichern',
    childName: 'NAME DES KINDES',
    changePin: 'PIN ÄNDERN',
    backup: 'DATENSICHERUNG',
    saveNow: '💾 Jetzt speichern',
    exportJSON: '📤 JSON exportieren',
    save: '💾 Speichern',
    noTx: 'Noch keine Transaktionen 👀',
    goalReached: '✅ Ziel erreicht! 🎉',
    installApp: 'Als App installieren',
    installSub: 'Zum Homescreen hinzufügen — auch offline!',
    install: 'Installieren',
    streak: 'Tage Serie',
    maxLevel: '🏆 Max Level!',
    xpTo: 'XP bis',
    score: 'Punkte:',
    earnedXP: 'XP verdient! ⭐',
  },
  fr: {
    appSub: 'Apprends l\'argent de façon amusante!',
    lessons: 'Leçons',
    challenges: 'Défis',
    piggyBank: 'Tirelire',
    badges: 'Badges',
    parentArea: 'Espace Parents',
    parentSub: 'Ajouter leçons, défis & plus',
    balance: 'solde',
    totalIn: 'Entrées ↑',
    totalOut: 'Sorties ↓',
    savingsGoal: '🎯 Objectif d\'épargne',
    goalName: 'Nom de l\'objectif',
    goalAmt: '€',
    setGoal: 'Définir objectif',
    addMoney: '💰 Ajouter argent',
    iSpent: '💸 J\'ai dépensé',
    pinRequired: '🔐 PIN parental requis',
    whereFrom: 'D\'où? (ex: argent de poche)',
    addMoneyBtn: 'Ajouter ✓',
    whatBought: 'Qu\'as-tu acheté?',
    recordSpending: 'Enregistrer dépense 💸',
    history: '📋 Historique',
    entries: 'entrées',
    backToLessons: 'Retour aux leçons',
    takeQuiz: 'Faire le quiz! 🧠',
    checkAnswer: 'Vérifier ✓',
    tryAgain: 'Réessayer',
    next: 'Suivant →',
    finish: 'Terminer! 🎉',
    lessonComplete: 'Leçon terminée!',
    keepPracticing: 'Continue à pratiquer!',
    correct: 'Correct!',
    notQuite: 'Pas tout à fait!',
    hint: 'Indice:',
    enterPin: 'Entrer →',
    wrongPin: 'PIN incorrect.',
    pinDefault: 'PIN (défaut: 1234)',
    progress: 'PROGRÈS',
    bonusXP: 'BONUS XP',
    giveXP: 'Donner!',
    resetProgress: '🗑️ Réinitialiser',
    addLesson: 'AJOUTER UNE LEÇON',
    addChallenge: 'AJOUTER UN DÉFI',
    saved: 'SAUVEGARDÉ',
    saveLesson: '💾 Sauvegarder leçon',
    saveChallenge: '💾 Sauvegarder défi',
    childName: 'NOM DE L\'ENFANT',
    changePin: 'CHANGER PIN',
    backup: 'SAUVEGARDE',
    saveNow: '💾 Sauvegarder',
    exportJSON: '📤 Exporter JSON',
    save: '💾 Sauver',
    noTx: 'Pas encore de transactions 👀',
    goalReached: '✅ Objectif atteint! 🎉',
    installApp: 'Installer comme app',
    installSub: 'Ajouter à l\'écran d\'accueil!',
    install: 'Installer',
    streak: 'jours de suite',
    maxLevel: '🏆 Niveau max!',
    xpTo: 'XP pour',
    score: 'Puntos:',
    earnedXP: 'XP gagnés! ⭐',
  },
  es: {
    appSub: '¡Aprende sobre dinero de forma divertida!',
    lessons: 'Lecciones',
    challenges: 'Retos',
    piggyBank: 'Alcancía',
    badges: 'Insignias',
    parentArea: 'Área de Padres',
    parentSub: 'Agregar lecciones, retos y más',
    balance: 'saldo',
    totalIn: 'Ingresos ↑',
    totalOut: 'Gastos ↓',
    savingsGoal: '🎯 Meta de ahorro',
    goalName: 'Nombre de meta',
    goalAmt: '€',
    setGoal: 'Establecer meta',
    addMoney: '💰 Agregar dinero',
    iSpent: '💸 Gasté',
    pinRequired: '🔐 PIN parental requerido',
    whereFrom: '¿De dónde? (ej: mesada)',
    addMoneyBtn: 'Agregar ✓',
    whatBought: '¿Qué compraste?',
    recordSpending: 'Registrar gasto 💸',
    history: '📋 Historial',
    entries: 'entradas',
    backToLessons: 'Volver a lecciones',
    takeQuiz: '¡Hacer quiz! 🧠',
    checkAnswer: 'Verificar ✓',
    tryAgain: 'Intentar de nuevo',
    next: 'Siguiente →',
    finish: '¡Terminar! 🎉',
    lessonComplete: '¡Lección completada!',
    keepPracticing: '¡Sigue practicando!',
    correct: '¡Correcto!',
    notQuite: '¡Casi!',
    hint: 'Pista:',
    enterPin: 'Entrar →',
    wrongPin: 'PIN incorrecto.',
    pinDefault: 'PIN (defecto: 1234)',
    progress: 'PROGRESO',
    bonusXP: 'BONUS XP',
    giveXP: '¡Dar!',
    resetProgress: '🗑️ Reiniciar progreso',
    addLesson: 'AGREGAR LECCIÓN',
    addChallenge: 'AGREGAR RETO',
    saved: 'GUARDADO',
    saveLesson: '💾 Guardar lección',
    saveChallenge: '💾 Guardar reto',
    childName: 'NOMBRE DEL NIÑO',
    changePin: 'CAMBIAR PIN',
    backup: 'RESPALDO',
    saveNow: '💾 Guardar ahora',
    exportJSON: '📤 Exportar JSON',
    save: '💾 Guardar',
    noTx: 'Sin transacciones aún 👀',
    goalReached: '✅ ¡Meta alcanzada! 🎉',
    installApp: 'Instalar como app',
    installSub: '¡Agregar a pantalla de inicio!',
    install: 'Instalar',
    streak: 'días seguidos',
    maxLevel: '🏆 ¡Nivel máximo!',
    xpTo: 'XP para',
    score: 'Puntos:',
    earnedXP: '¡XP ganados! ⭐',
  },
};
