// js/i18n.js

export const translations = {
  en: {
	siteTitle: "Tibetan Study Companion",
    homeSubtitle: "Interactive study guides and audio pronunciation practice<br>based off of Gen. Wangbhumo's Year 1 Tibetan Language textbook.",
    // Cards
    rootSyllables: "Root Syllables",
    rootSyllablesDesc: "Interactive syllable grid for practicing your pronunciation",
    badgeReady: "Ready",
    
    vowelsTitle: "Vowels",
    vowelsDesc: "Missing audio for two vowel + syllable combos - needs Gen la's approval",
    badgeInReview: "In Review",
    
    headLettersTitle: "Head Letters",
    headLettersDesc: "Add and remove head letters, see which syllables they attach to, and which have a sound change.",
    badgeComingSoon: "Coming Soon",
    
    // Footer credits
    voiceAudioCredit: "Voice audio recorded by Gen. Wangbhumo (Sarah College for Higher Tibetan Studies)",
	codeUnder: "Code under",
    audioUnder: "Audio under",
    home: "Home",
    syllables: "Syllables",
    vowels: "Vowels",
    headLetters: "Head Letters",
    grammar: "Grammar",
    // Page specific & buttons
    syllablesSubtitle: "30 Syllables",
    showPronunciation: "Show Pronunciation Tip (ENG)",
    showTone: "Show Tone & Aspiration",
    // Tones
    highTone: "High tone",
    lowTone: "Low tone",
    aspirated: "High + Aspirated",
    nasal: "Low + Nasal",
    noVowel: "No Vowel",
	headLetters: "Head Letters",
    baseOnly: "Base Only",
  },
  fr: {
    siteTitle: "Compagnon d'étude tibétaine",
	homeSubtitle: "Guides d'étude interactifs et pratique de la prononciation audio<br>basés sur le manuel de 1ère année de tibétain de Gen. Wangbhumo.",
    // Cards
    rootSyllables: "Syllabes racines",
    rootSyllablesDesc: "Grille de syllabes interactive pour pratiquer votre prononciation",
    badgeReady: "Prêt",
    
    vowelsTitle: "Voyelles",
    vowelsDesc: "Audio manquant pour deux combinaisons voyelle + syllabe - nécessite l'approbation de Gen la",
    badgeInReview: "En révision",
    
    headLettersTitle: "Lettres têtes",
    headLettersDesc: "Ajoutez et supprimez des lettres têtes, voyez à quelles syllabes elles se rattachent et lesquelles modifient le son.",
    badgeComingSoon: "Bientôt disponible",
    
    // Footer credits
    voiceAudioCredit: "Audio vocal enregistré par Gen. Wangbhumo (Sarah College for Higher Tibetan Studies)",
	codeUnder: "Code sous",
    audioUnder: "Audio sous",
    home: "Accueil",
    syllables: "Syllabes",
    vowels: "Voyelles",
    headLetters: "Lettres têtes",
    grammar: "Grammaire",
    // Page specific & buttons
    syllablesSubtitle: "30 Syllabes",
    showPronunciation: "Afficher l'indice de prononciation (ENG)",
    showTone: "Afficher le ton et l'aspiration",
    // Tones
    highTone: "Ton haut",
    lowTone: "Ton bas",
    aspirated: "Haut + Aspiré",
    nasal: "Bas + Nasal",
    noVowel: "Sans voyelle",
	headLetters: "Lettres têtes",
    baseOnly: "Base seule",
  }
};

// Retrieve saved language from localStorage or default to English
let currentLang = localStorage.getItem('siteLang') || 'en';

export function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('siteLang', lang);
  // Reload the page so all components and grids update cleanly with the new language
  window.location.reload();
}

export function getLang() {
  return currentLang;
}

export function t(key) {
  return translations[currentLang][key] || translations['en'][key] || key;
}