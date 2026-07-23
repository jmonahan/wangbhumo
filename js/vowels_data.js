// js/vowels_data.js
import { tibetanAlphabet } from './syllables_data.js';

export const vowelMarks = {
  i: "\u0F72", // ི Gigu
  u: "\u0F74", // ུ Zhabkyu
  e: "\u0F7A", // ེ Dengbu
  o: "\u0F7C"  // ོ Naro
};

export const vowelsList = ["i", "u", "e", "o"];

// Helper function ported directly from vowels.html
function getVowelRomanization(baseEng, vowel) {
  if (vowel === "none") return baseEng;
  
  if (baseEng === "aa") {
    const specialVowelMap = { i: "ai", u: "au", e: "ae", o: "ao" };
    return specialVowelMap[vowel] || baseEng;
  }

  const isDoubleRoot = baseEng.endsWith('aa');
  let root = baseEng;
  if (isDoubleRoot) {
    root = root.slice(0, -2);
  } else if (root.endsWith('a')) {
    root = root.slice(0, -1);
  }
  
  let vowelSuffixes = isDoubleRoot 
    ? { i: "ī", u: "ū", e: "é", o: "ō" }
    : { i: "i", u: "u", e: "e", o: "o" };

  return root + (vowelSuffixes[vowel] || "");
}

/**
 * Generates a complete flat array of all 150 combinations 
 * (30 base syllables × 5 states [none + 4 vowels]) for quizzing or grids.
 */
export function getAllVowelCombinations() {
  const combinations = [];

  tibetanAlphabet.forEach(item => {
    // 1. Add the base form ("none" vowel)
    combinations.push({
      id: item.id,
      vowel: "none",
      tib: item.tib,
      eng: item.eng,
      toneKey: item.toneKey,
      audioPath: `audio/syllables/${item.id}.mp3`
    });

    // 2. Add the 4 vowel modifications
    vowelsList.forEach(vowel => {
      const displayTibetan = item.tib + vowelMarks[vowel];
      const updatedRomanization = getVowelRomanization(item.eng, vowel);
      
      combinations.push({
        id: `${item.id}_${vowel}`,
        baseId: item.id,
        vowel: vowel,
        tib: displayTibetan,
        eng: updatedRomanization,
        toneKey: item.toneKey,
        audioPath: `audio/vowels/${item.id}_${vowel}.mp3`
      });
    });
  });

  return combinations;
}

// Dedicated standalone audio objects for the 4 vowel names
export const vowelAudio = {
  i: new Audio("audio/vowels/kigu.mp3"),
  u: new Audio("audio/vowels/shabkyoo.mp3"),
  e: new Audio("audio/vowels/dengpo.mp3"),
  o: new Audio("audio/vowels/naro.mp3")
};

// Ensure preloading for smooth playback
Object.values(vowelAudio).forEach(audio => {
  audio.preload = 'auto';
});