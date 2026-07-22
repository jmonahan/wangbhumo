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
    vowelsDesc: "Combine vowels with the root syllables and hear the sound changes",
    badgeInReview: "In Review",
    
    headLettersTitle: "Head Letters",
    headLettersDesc: "Add head letters to the root syllables, see which syllables have a sound change and which stay the same",
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
	tone_harder_sound: "Change: Harder Sound",
	tone_high_tune: "Change: High Tune",
	tone_high_asp_sharp: "High Aspiration, Sharp Vowel Ending",
    noVowel: "No Vowel",
	headLetters: "Head Letters",
	none: "None",
	// SiteControls Hints and Speed
	hintsLabel: "Hints:",
	phonetics: "Phonetics",
	tones: "Tones",
	speedLabel: "Audio Speed:",
  },
  fr: {
    siteTitle: "Compagnon d'étude tibétaine",
	homeSubtitle: "Guides d'étude interactifs et pratique de la prononciation audio<br>basés sur le manuel de 1ère année de tibétain de Gen. Wangbhumo.",
    // Cards
    rootSyllables: "Syllabes racines",
    rootSyllablesDesc: "Grille de syllabes interactive pour pratiquer votre prononciation",
    badgeReady: "Prêt",
    
    vowelsTitle: "Voyelles",
    vowelsDesc: "Combinez les voyelles avec les syllabes racines et écoutez les changements de sons.",
    badgeInReview: "En révision",
    
    headLettersTitle: "Lettres têtes",
    headLettersDesc: "Ajoutez des lettres de tête aux syllabes racines, voyez quelles syllabes subissent un changement de son et lesquelles restent inchangées.",
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
	tone_harder_sound: "Changement : Son plus dur",
	tone_high_tune: "Changement : Ton haut",
	tone_high_asp_sharp: "Forte aspiration, fin de voyelle pointue",
    noVowel: "Sans voyelle",
	headLetters: "Lettres têtes",
	none: "Aucun",
    // SiteControls Hints and Speed
	hintsLabel: "Indices :",
	phonetics: "Phonétique",
	tones: "Tons",
	speedLabel: "Audio Vitesse :",

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