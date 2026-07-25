// js/prefixes_data.js

const universalPrefixExclusions = [
  "20_wa",  // ཝ
  "23_aa",  // འ
  "25_ra",  // ར
  "26_la",  // ལ
  "29_ha",  // ཧ
  "30_a"    // ཨ
];

const prefixLetterMap = {
  kaa: 'ག',
  taa: 'ད',
  paa: 'བ',
  ma:  'མ',
  aa:  'འ'
};

// 1. General rules that apply to specific root syllables across ALL prefixes
export const prefixGeneralRules = {
  "03_kaa":  { soundShift: true, eng: "gaa", toneKey: "lowTone" },
  "07_chaa": { soundShift: true, eng: "jaa", toneKey: "lowTone" },
  "11_taa":  { soundShift: true, eng: "daa", toneKey: "lowTone" },
  "15_paa":  { soundShift: true, eng: "baa", toneKey: "lowTone" },
  "04_nga":  { soundShift: true, eng: "na",  toneKey: "highTone" }
};

// 2. Specific, rare exceptions that override everything else (like དབ)
export const prefixExceptions = {
  "taa_14_pha": {
    id: "taa_14_pha",
    tib: "དབ",
    eng: "waa",
    audioPath: "audio/prefixes/da_14_pha.mp3",
    soundShift: true,
    toneKey: "lowTone"
  }
};

export function isHomorganicClash(prefixKey, rootId) {
  if (universalPrefixExclusions.includes(rootId)) {
    return true;
  }

  const exclusions = {
    kaa: ["01_ka", "02_kha", "03_kaa", "04_nga"],
    taa: ["05_tsa", "06_tsha", "07_tshaa", "08_nya", "09_ta", "10_tha", "11_taa", "12_na"],
    paa: ["13_pa", "14_pha", "15_paa", "16_ma"],
    ma:  ["13_pa", "14_pha", "15_paa", "16_ma"],
    aa:  [] 
  };

  const restrictedList = exclusions[prefixKey] || [];
  return restrictedList.includes(rootId);
}

export function getPrefixCombination(prefixKey, rootItem) {
  const comboId = `${prefixKey}_${rootItem.id}`;
  const prefixChar = prefixLetterMap[prefixKey] || '';
  const combinedTibetan = prefixChar + rootItem.tib;

  // Priority 1: Check for explicit custom exceptions first (like དབ)
  if (prefixExceptions[comboId]) {
    const exception = prefixExceptions[comboId];
    return {
      id: exception.id,
      tib: combinedTibetan,
      eng: exception.eng,
      audioPath: exception.audioPath,
      soundShift: exception.soundShift,
      toneKey: exception.toneKey
    };
  }

  // Priority 2: Check if this root falls under the general universal sound-shift rules
  if (prefixGeneralRules[rootItem.id]) {
    const rule = prefixGeneralRules[rootItem.id];
    return {
      id: comboId,
      tib: combinedTibetan,
      eng: rule.eng,
      soundShift: rule.soundShift,
      toneKey: rule.toneKey,
      audioPath: `audio/prefixes/${comboId}.mp3`
    };
  }

  // Priority 3: Default fallback for standard combinations (silent prefix, inherits root)
  return {
    id: comboId,
    tib: combinedTibetan,
    eng: rootItem.eng,
    audioPath: `audio/syllables/${rootItem.id}.mp3`,
    soundShift: false,
    toneKey: rootItem.toneKey || null
  };
}