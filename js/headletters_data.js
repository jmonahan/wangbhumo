// js/attachedletters_data.js
import { tibetanAlphabet } from './syllables_data.js';

/* Head Letter Mappings with explicit Romanization, Tones, and Phonetic Collision Groups */
export const headLetterData = {
  ra: {
    "01_ka":  { tib: "རྐ", soundShift: false, collisionGroup: "group_ka" },
    "03_kaa": { tib: "རྒ", soundShift: true, toneKey: "tone_harder_sound", eng: "gaa", collisionGroup: "group_gaa" },
    "04_nga": { tib: "རྔ", soundShift: true, toneKey: "tone_high_tune", collisionGroup: "group_nga" },
    "07_chaa":{ tib: "རྗ", soundShift: true, toneKey: "tone_harder_sound", eng: "jaa", collisionGroup: "group_chaa" },
    "08_nya": { tib: "རྙ", soundShift: true, toneKey: "tone_high_tune", collisionGroup: "group_nya" },
    "09_ta":  { tib: "རྟ", soundShift: false, collisionGroup: "group_ta" },
    "11_taa": { tib: "རྡ", soundShift: true, toneKey: "tone_harder_sound", eng: "daa", collisionGroup: "group_taa" },
    "12_na":  { tib: "རྣ", soundShift: true, toneKey: "tone_high_tune", collisionGroup: "group_na" },
    "15_paa": { tib: "རྦ", soundShift: true, toneKey: "tone_harder_sound", eng: "baa", collisionGroup: "group_paa" },
    "16_ma":  { tib: "རྨ", soundShift: true, toneKey: "tone_high_tune", collisionGroup: "group_ma" },
    "17_tsa": { tib: "རྩ", soundShift: false, collisionGroup: "group_tsa" },
    "19_tsaa":{ tib: "རྫ", soundShift: true, toneKey: "tone_harder_sound", eng: "dzaa", collisionGroup: "group_tsaa" }
  },
  la: {
    "01_ka":  { tib: "ལྐ", soundShift: false, collisionGroup: "group_ka" },
    "03_kaa": { tib: "ལྒ", soundShift: true, toneKey: "tone_harder_sound", eng: "gaa", collisionGroup: "group_gaa" },
    "04_nga": { tib: "ལྔ", soundShift: true, toneKey: "tone_high_tune", collisionGroup: "group_nga" },
    "05_cha": { tib: "ལྕ", soundShift: false, collisionGroup: "group_cha" },
    "07_chaa":{ tib: "ལྗ", soundShift: true, toneKey: "tone_harder_sound", eng: "ljaa", collisionGroup: "group_chaa" },
    "09_ta":  { tib: "ལྟ", soundShift: false, collisionGroup: "group_ta" },
    "11_taa": { tib: "ལྡ", soundShift: true, toneKey: "tone_harder_sound", eng: "ldaa", collisionGroup: "group_taa" },
    "13_pa":  { tib: "ལྤ", soundShift: false, collisionGroup: "group_pa" },
    "15_paa": { tib: "ལྦ", soundShift: true, toneKey: "tone_harder_sound", eng: "lbaa", collisionGroup: "group_paa" },
    "29_ha":  { tib: "ལྷ", soundShift: true, toneKey: "tone_high_asp_sharp", eng: "lha", collisionGroup: "group_ha" }
  },
  sa: {
    "01_ka":  { tib: "སྐ", soundShift: false, collisionGroup: "group_ka" },
    "03_kaa": { tib: "སྒ", soundShift: true, toneKey: "tone_harder_sound", eng: "gaa", collisionGroup: "group_gaa" },
    "04_nga": { tib: "སྔ", soundShift: true, toneKey: "tone_high_tune", collisionGroup: "group_nga" },
    "08_nya": { tib: "སྙ", soundShift: true, toneKey: "tone_high_tune", collisionGroup: "group_nya" },
    "09_ta":  { tib: "སྟ", soundShift: false, collisionGroup: "group_ta" },
    "11_taa": { tib: "སྡ", soundShift: true, toneKey: "tone_harder_sound", eng: "sdaa", collisionGroup: "group_taa" },
    "12_na":  { tib: "སྣ", soundShift: true, toneKey: "tone_high_tune", collisionGroup: "group_na" },
    "13_pa":  { tib: "སྤ", soundShift: false, collisionGroup: "group_pa" },
    "15_paa": { tib: "སྦ", soundShift: true, toneKey: "tone_harder_sound", eng: "sbaa", collisionGroup: "group_paa" },
    "16_ma":  { tib: "སྨ", soundShift: true, toneKey: "tone_high_tune", collisionGroup: "group_ma" },
    "17_tsa": { tib: "སྩ", soundShift: false, collisionGroup: "group_tsa" }
  }
};

/**
 * Generates an array of all active head letter combinations for the quiz pool
 */
export function getAllHeadLetterCombinations() {
  const combinations = [];
  
  Object.keys(headLetterData).forEach(headKey => {
    const map = headLetterData[headKey];
    Object.keys(map).forEach(baseId => {
      const combo = map[baseId];
      combinations.push({
        id: `${baseId}_${headKey}`,
        baseId: baseId,
        headLetter: headKey,
        tib: combo.tib,
        eng: combo.eng || baseId,
        toneKey: combo.toneKey,
        collisionGroup: combo.collisionGroup || baseId,
        audioPath: combo.soundShift 
          ? `audio/headletters/${baseId}_${headKey}.mp3` 
          : `audio/syllables/${baseId}.mp3`
      });
    });
  });

  return combinations;
}