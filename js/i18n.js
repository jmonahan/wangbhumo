// js/i18n.js

export const translations = {
  en: {
    siteTitle: "Tibetan Study Companion",
    homeSubtitle: "Interactive study guides and audio pronunciation practice<br>based off of Gen. Wangbhumo's Year 1 Tibetan Language textbook.",
    rootSyllables: "Root Syllables",
    rootSyllablesDesc: "Interactive syllable grid for practicing your pronunciation",
    badgeReady: "Ready",
    vowelsTitle: "Vowels",
    vowelsDesc: "Combine vowels with the root syllables and hear the sound changes",
    badgeInReview: "In Review",
    headLettersTitle: "Head Letters",
    headLettersDesc: "Add head letters to the root syllables, see which syllables have a sound change and which stay the same",
    badgeComingSoon: "Coming Soon",
    voiceAudioCredit: "Voice audio recorded by Gen. Wangbhumo (Sarah College for Higher Tibetan Studies)",
    codeUnder: "Code under",
    audioUnder: "Audio under",
    home: "Home",
    syllables: "Syllables",
    vowels: "Vowels",
    headLetters: "Head Letters",
    grammar: "Grammar",
    syllablesSubtitle: "30 Syllables",
    showPronunciation: "Show Pronunciation Tip (ENG)",
    showTone: "Show Tone & Aspiration",
    highTone: "High tone",
    lowTone: "Low tone",
    aspirated: "High + Aspirated",
    nasal: "Low + Nasal",
    tone_harder_sound: "Change: Harder Sound",
    tone_high_tune: "Change: High Tune",
    tone_high_asp_sharp: "High Aspiration, Sharp Vowel Ending",
    noVowel: "No Vowel",
    none: "None",
    hintsLabel: "Show:",
    phonetics: "Phonetics",
    tones: "Tones",
    speedLabel: "Audio Speed:",
	quizTitle: "Quiz",
	badgeNew: "New!",
	quizDesc: "Audio based quiz. Listen to the sound and pick the right answer.",
	quizPageTitle: "Tibetan Study Companion - Quiz",
	quizHeaderTitle: "Practice Quiz",
	quizHeaderSubtitle: "Listen to the audio and choose the correct syllable or combination.",
	quizCardHeading: "Listen & Select",
	quizSkipBtn: "Skip",
	quizNextBtn: "Next Question",
	quizCorrectMsg: "Correct! Great job.",
	quizIncorrectMsg: "Not quite, try again!",
	quizTitle: "Quiz",
	badgeNew: "New!",
	quizDesc: "Audio based quiz. Listen to the sound and pick the right answer.",
  },
  fr: {
    siteTitle: "Compagnon d'étude tibétaine",
    homeSubtitle: "Guides d'étude interactifs et pratique de la prononciation audio<br>basés sur le manuel de 1ère année de tibétain de Gen. Wangbhumo.",
    rootSyllables: "Syllabes racines",
    rootSyllablesDesc: "Grille de syllabes interactive pour pratiquer votre prononciation",
    badgeReady: "Prêt",
    vowelsTitle: "Voyelles",
    vowelsDesc: "Combinez les voyelles avec les syllabes racines et écoutez les changements de sons.",
    badgeInReview: "En révision",
    headLettersTitle: "Lettres têtes",
    headLettersDesc: "Ajoutez des lettres de tête aux syllabes racines, voyez quelles syllabes subissent un changement de son et lesquelles restent inchangées.",
    badgeComingSoon: "Bientôt disponible",
    voiceAudioCredit: "Audio vocal enregistré par Gen. Wangbhumo (Sarah College for Higher Tibetan Studies)",
    codeUnder: "Code sous",
    audioUnder: "Audio sous",
    home: "Accueil",
    syllables: "Syllabes",
    vowels: "Voyelles",
    headLetters: "Lettres têtes",
    grammar: "Grammar",
    syllablesSubtitle: "30 Syllabes",
    showPronunciation: "Afficher l'indice de prononciation (ENG)",
    showTone: "Afficher le ton et l'aspiration",
    highTone: "Ton haut",
    lowTone: "Ton bas",
    aspirated: "Haut + Aspiré",
    nasal: "Bas + Nasal",
    tone_harder_sound: "Changement : Son plus dur",
    tone_high_tune: "Changement : Ton haut",
    tone_high_asp_sharp: "Forte aspiration, fin de voyelle pointue",
    noVowel: "Sans voyelle",
    none: "Aucun",
    hintsLabel: "Afficher :",
    phonetics: "Phonétique",
    tones: "Tons",
    speedLabel: "Audio Vitesse :",
	quizTitle: "Quiz",
	badgeNew: "Nouveau !",
	quizDesc: "Quiz basé sur l'audio. Écoutez le son et choisissez la bonne réponse.",
	quizPageTitle: "Compagnon d'étude du tibétain - Quiz",
	quizHeaderTitle: "Quiz d'entraînement",
	quizHeaderSubtitle: "Écoutez l'audio et choisissez la syllabe ou la combinaison correcte.",
	quizCardHeading: "Écouter et Sélectionner",
	quizSkipBtn: "Passer",
	quizNextBtn: "Question suivante",
	quizCorrectMsg: "Correct ! Bon travail.",
	quizIncorrectMsg: "Pas tout à fait, réessayez !",
	quizTitle: "Quiz",
	badgeNew: "Nouveau !",
	quizDesc: "Quiz basé sur l'audio. Écoutez le son et choisissez la bonne réponse.",
  }
};

export function getLang() {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');

  if (langParam && translations[langParam]) {
    localStorage.setItem('siteLang', langParam);
    return langParam;
  }

  return localStorage.getItem('siteLang') || 'en';
}

// Active language evaluation on load
let currentLang = getLang();

export function setLanguage(lang) {
  if (translations[lang]) {
    currentLang = lang;
    localStorage.setItem('siteLang', lang);
  }
}

export function t(key) {
  return translations[currentLang]?.[key] || translations['en'][key] || key;
}