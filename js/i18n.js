// js/i18n.js

export const translations = {
  en: {
    siteTitle: "Tibetan Study Companion",
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
    noVowel: "No Vowel"
  },
  fr: {
    siteTitle: "Compagnon d'étude tibétaine",
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
    noVowel: "Sans voyelle"
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