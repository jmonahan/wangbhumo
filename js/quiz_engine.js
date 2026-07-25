/**
 * DEBUGGING URL PARAMETER COMBINATIONS:
 * 
 * 1. Root Syllables only:
 *    ?c=s
 * 
 * 2. Vowels only:
 *    ?c=v
 * 
 * 3. Head Letters (all):
 *    ?c=hl
 * 
 * 4. Specific Head Letter:
 *    ?c=hl&s=[head_key]  (s=ra, la, sa)
 * 
 * 5. Attached Letters (all):
 *    ?c=al
 * 
 * 6. Specific Attached Letter:
 *    ?c=al&s=[subjoined_key]  (s=ya, ra, la, wa)
 */

// js/quiz_engine.js
import { tibetanAlphabet } from './syllables_data.js';
import { getAllVowelCombinations } from './vowels_data.js';
import { headLettersData } from './headletters_data.js';
import { attachedLettersData } from './attachedletters_data.js';

/**
 * Registry of available quiz categories. 
 */
export const quizCategories = {
  syllablesAndVowels: {
    id: 'syllablesAndVowels',
    name: 'Root Syllables & Vowels',
    gridSize: 6, // 6 options grid layout (2x3 format)
    getPool: () => {
      const rootItems = tibetanAlphabet.map(item => ({
        id: item.id,
        baseId: item.id,
        vowel: "none",
        tib: item.tib,
        eng: item.eng,
        audioPath: `audio/syllables/${item.id}.mp3`
      }));
      const vowelItems = getAllVowelCombinations();
      return [...rootItems, ...vowelItems];
    },
    generateOptions: (currentQuestion, masterPool) => {
      const options = [currentQuestion];
      const maxChoices = 6;
      
      const baseAlphabetIndex = tibetanAlphabet.findIndex(item => item.id === currentQuestion.baseId);
      const rowIdx = Math.floor(baseAlphabetIndex / 4);
      const colIdx = baseAlphabetIndex % 4;

      let refinedPoolBaseIds = [];
      let mustHaveBaseIds = []; 

      if (baseAlphabetIndex >= 20) {
        const finalSectionItems = tibetanAlphabet.slice(20).map(i => i.id);
        refinedPoolBaseIds.push(...finalSectionItems);

        let leftIdx1 = baseAlphabetIndex - 1;
        let leftIdx2 = baseAlphabetIndex - 2;
        let rightIdx1 = baseAlphabetIndex + 1;

        if (!tibetanAlphabet[rightIdx1]) {
          if (tibetanAlphabet[leftIdx1]) mustHaveBaseIds.push(tibetanAlphabet[leftIdx1].id);
          if (tibetanAlphabet[leftIdx2]) mustHaveBaseIds.push(tibetanAlphabet[leftIdx2].id);
        } else if (leftIdx1 < 20) {
          if (tibetanAlphabet[baseAlphabetIndex + 1]) mustHaveBaseIds.push(tibetanAlphabet[baseAlphabetIndex + 1].id);
          if (tibetanAlphabet[baseAlphabetIndex + 2]) mustHaveBaseIds.push(tibetanAlphabet[baseAlphabetIndex + 2].id);
        } else {
          if (tibetanAlphabet[leftIdx1]) mustHaveBaseIds.push(tibetanAlphabet[leftIdx1].id);
          if (tibetanAlphabet[rightIdx1]) mustHaveBaseIds.push(tibetanAlphabet[rightIdx1].id);
        }
      } 
      else if (colIdx === 3) {
        for (let i = 3; i < tibetanAlphabet.length; i += 4) {
          if (tibetanAlphabet[i]) refinedPoolBaseIds.push(tibetanAlphabet[i].id);
        }
      } 
      else {
        for (let r = 0; r <= 4; r++) {
          for (let c = 0; c <= 2; c++) {
            const idx = (r * 4) + c;
            if (tibetanAlphabet[idx]) refinedPoolBaseIds.push(tibetanAlphabet[idx].id);
          }
        }

        const rowStart = rowIdx * 4;
        for (let c = 0; c <= 2; c++) {
          let siblingIndex = rowStart + c;
          if (siblingIndex !== baseAlphabetIndex && tibetanAlphabet[siblingIndex]) {
            mustHaveBaseIds.push(tibetanAlphabet[siblingIndex].id);
          }
        }
      }

      if (mustHaveBaseIds.length > 0) {
        const priorityDistractors = masterPool.filter(item => 
          item.vowel === currentQuestion.vowel && 
          mustHaveBaseIds.includes(item.baseId)
        );
   
        for (const distractor of priorityDistractors) {
          if (options.length < maxChoices && !options.some(opt => opt.id === distractor.id)) {
            options.push(distractor);
          }
        }
      }

      const smartDistractors = masterPool.filter(item => 
        item.id !== currentQuestion.id && 
        item.vowel === currentQuestion.vowel && 
        refinedPoolBaseIds.includes(item.baseId)
      );

      smartDistractors.sort(() => Math.random() - 0.5);
      for (const distractor of smartDistractors) {
        if (options.length < maxChoices && !options.some(opt => opt.id === distractor.id)) {
          options.push(distractor);
        }
      }

      const restrictedFallbackPool = masterPool.filter(item => 
        item.vowel === currentQuestion.vowel && refinedPoolBaseIds.includes(item.baseId)
      );
      while (options.length < maxChoices && restrictedFallbackPool.length > options.length) {
        const randItem = restrictedFallbackPool[Math.floor(Math.random() * restrictedFallbackPool.length)];
        if (!options.some(opt => opt.id === randItem.id)) {
          options.push(randItem);
        }
      }

      const absoluteVowelPool = masterPool.filter(item => item.vowel === currentQuestion.vowel);
      while (options.length < maxChoices && absoluteVowelPool.length > options.length) {
        const randItem = absoluteVowelPool[Math.floor(Math.random() * absoluteVowelPool.length)];
        if (!options.some(opt => opt.id === randItem.id)) {
          options.push(randItem);
        }
      }

      options.sort(() => Math.random() - 0.5);
      return options;
    }
  },

  headLetters: {
        id: 'headLetters',
        name: 'Head Letters (Go-chen)',
        gridSize: 4, // 4 options grid layout (2x2 format)
        getPool: () => {
          const pool = [];
          for (const [headKey, combinations] of Object.entries(headLettersData)) {
            for (const [baseKey, item] of Object.entries(combinations)) {
              pool.push({
                id: item.id || `${headKey}_${baseKey}`,
                baseId: baseKey,
                head: headKey,
                tib: item.tib,
                eng: item.eng,
                audioPath: item.audioPath
              });
            }
          }
          return pool;
        },
        generateOptions: (currentQuestion, masterPool) => {
          const options = [currentQuestion];
          const maxChoices = 4;

          const column4BaseKeys = ["04_nga", "08_nya", "12_na", "16_ma"];
          const isColumn4 = column4BaseKeys.includes(currentQuestion.baseId);

          if (isColumn4) {
            const column4Siblings = masterPool.filter(item => 
              item.id !== currentQuestion.id && 
              item.head === currentQuestion.head && 
              column4BaseKeys.includes(item.baseId)
            );
            column4Siblings.sort(() => Math.random() - 0.5);

            for (const distractor of column4Siblings) {
              if (options.length < maxChoices && !options.some(opt => opt.id === distractor.id)) {
                options.push(distractor);
              }
            }
          }

          // Strict same-head pool filter: Never mix different head letters together
          const sameHeadPool = masterPool.filter(item => 
            item.id !== currentQuestion.id && item.head === currentQuestion.head
          );
          sameHeadPool.sort(() => Math.random() - 0.5);

          for (const distractor of sameHeadPool) {
            if (options.length < maxChoices && !options.some(opt => opt.id === distractor.id)) {
              options.push(distractor);
            }
          }

          options.sort(() => Math.random() - 0.5);
          return options;
        }
    },

  attachedLetters: {
        id: 'attachedLetters',
        name: 'Attached Letters (Dok-chen)',
        gridSize: 4, // 4 options grid layout (2x2 format)
        getPool: () => {
          const pool = [];
          for (const [subKey, combinations] of Object.entries(attachedLettersData)) {
            for (const [baseKey, item] of Object.entries(combinations)) {
              // Determine if this specific item triggers joke mode (Only La-ta except ཟླ)
              let isJoke = false;
              if (subKey === 'la' && baseKey !== '22_saa') {
                isJoke = true;
              }

              pool.push({
                id: item.id || `${subKey}_${baseKey}`,
                baseId: baseKey,
                subjoined: subKey,
                tib: item.tib,
                eng: item.eng,
                audioPath: item.audioPath,
                isJoke: isJoke,
                jokeMessage: "All the options were right! Most ལ attached letters sound like 'la'"
              });
            }
          }
          return pool;
        },
        generateOptions: (currentQuestion, masterPool) => {
          const options = [currentQuestion];
          const maxChoices = 4;

          // Rule 1: Universal La-ta (la) Joke Rounds
          if (currentQuestion.isJoke) {
            // Exclude 'ཟླ' (baseId === '22_saa') as a distractor when the correct answer is a standard 'la' sound
            const sameSubPool = masterPool.filter(item => 
              item.id !== currentQuestion.id && 
              item.subjoined === currentQuestion.subjoined && 
              item.baseId !== '22_saa'
            );
            sameSubPool.sort(() => Math.random() - 0.5);

            for (const distractor of sameSubPool) {
              if (options.length < maxChoices && !options.some(opt => opt.id === distractor.id)) {
                options.push(distractor);
              }
            }
          }
          // Rule 2: Ra-ta (ra) Homophonic Column Guardrails
          else if (currentQuestion.subjoined === 'ra') {
            // Define the groups of stops that sound identical under Ra-ta
            const group1 = ["01_ka", "09_ta", "13_pa"]; // sounds like 'ta' / 'ka' depending on style
            const group2 = ["02_kha", "10_tha", "14_pha"]; // aspirated stops
            const group3 = ["03_kaa", "11_taa", "15_paa"]; // low-tone stops

            let forbiddenBaseKeys = [];
            if (group1.includes(currentQuestion.baseId)) forbiddenBaseKeys = group1;
            else if (group2.includes(currentQuestion.baseId)) forbiddenBaseKeys = group2;
            else if (group3.includes(currentQuestion.baseId)) forbiddenBaseKeys = group3;

            // Pull distractors from the *other* columns or sonorants (avoiding identical homophones)
            const safeRaPool = masterPool.filter(item => 
              item.id !== currentQuestion.id && 
              item.subjoined === 'ra' && 
              !forbiddenBaseKeys.includes(item.baseId)
            );
            safeRaPool.sort(() => Math.random() - 0.5);

            for (const distractor of safeRaPool) {
              if (options.length < maxChoices && !options.some(opt => opt.id === distractor.id)) {
                options.push(distractor);
              }
            }
          }
          // Rule 3: Standard Wa-zur / Ya-ta / Unique items
          else {
            const sameSubPool = masterPool.filter(item => 
              item.id !== currentQuestion.id && item.subjoined === currentQuestion.subjoined
            );
            sameSubPool.sort(() => Math.random() - 0.5);

            for (const distractor of sameSubPool) {
              if (options.length < maxChoices && !options.some(opt => opt.id === distractor.id)) {
                options.push(distractor);
              }
            }
          }

          // General fallback if pool is too small to fill 4 choices
          const fallbackPool = masterPool.filter(item => item.id !== currentQuestion.id);
          fallbackPool.sort(() => Math.random() - 0.5);

          for (const distractor of fallbackPool) {
            if (options.length < maxChoices && !options.some(opt => opt.id === distractor.id)) {
              options.push(distractor);
            }
          }

          options.sort(() => Math.random() - 0.5);
          return options;
        }
    }
};

/**
 * Randomly picks a quiz category, picks a target question, and generates grid options.
 */
export function getNextQuizRound() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryCode = urlParams.get('c'); // 's', 'v', 'hl', 'al'
  const subSelection = urlParams.get('s'); // specific subjoined or head letter key

  let categoryKey;
  if (categoryCode === 's' || categoryCode === 'v') {
    categoryKey = 'syllablesAndVowels';
  } else if (categoryCode === 'hl') {
    categoryKey = 'headLetters';
  } else if (categoryCode === 'al') {
    categoryKey = 'attachedLetters';
  } else {
    // Default fallback: pick a random category if no 'c' param is provided
    const categoryKeys = Object.keys(quizCategories);
    categoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
  }

  let category = quizCategories[categoryKey];
  let pool = category.getPool();

  // Apply shorthand filters
  if (categoryCode === 'v') {
    pool = pool.filter(item => item.vowel !== 'none');
  } else if (categoryCode === 's') {
    pool = pool.filter(item => item.vowel === 'none');
  }

  if (subSelection) {
    if (categoryKey === 'headLetters') {
      pool = pool.filter(item => item.head === subSelection);
    } else if (categoryKey === 'attachedLetters') {
      pool = pool.filter(item => item.subjoined === subSelection);
    }
  }

  // Fallback if filter returns empty
  if (pool.length === 0) {
    pool = category.getPool();
  }

  const correctItem = pool[Math.floor(Math.random() * pool.length)];
  const options = category.generateOptions(correctItem, pool);

  return {
    category: category,
    question: correctItem,
    options: options
  };
}
