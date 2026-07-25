// js/quiz_engine.js
import { tibetanAlphabet } from './syllables_data.js';
import { getAllVowelCombinations } from './vowels_data.js';

/**
 * Registry of available quiz categories. 
 * Each category defines its source pool, grid configuration (grid columns/max options), 
 * and custom distractor generation logic.
 */
export const quizCategories = {
  syllablesAndVowels: {
    id: 'syllablesAndVowels',
    name: 'Root Syllables & Vowels',
    gridSize: 6, // 6 options grid layout
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

        // Explicitly ensure row siblings (e.g., ཀ and ག for ཁ) are forced into must-haves
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
  }
  // Future categories (e.g., headLetters) will plug in here cleanly!
};

/**
 * Randomly picks a quiz category, picks a target question, and generates grid options.
 */
export function getNextQuizRound() {
  const categoryKeys = Object.keys(quizCategories);
  const selectedKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
  const category = quizCategories[selectedKey];

  const pool = category.getPool();
  const correctItem = pool[Math.floor(Math.random() * pool.length)];
  const options = category.generateOptions(correctItem, pool);

  return {
    category: category,
    question: correctItem,
    options: options
  };
}