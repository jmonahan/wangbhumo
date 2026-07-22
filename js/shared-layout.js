import { t, getLang } from './i18n.js';
// Universal Navigation Bar
class SiteNav extends HTMLElement {
  connectedCallback() {

	// Check if explicitly told to show via attribute OR if we are running locally
	const showDev = this.hasAttribute('show-dev') || 
	            window.location.hostname === 'localhost' || 
	            window.location.hostname === '127.0.0.1';  
				

	  
	// Inside class SiteNav extends HTMLElement { connectedCallback() { ...
	    this.innerHTML = `
			<nav class="site-nav">
			    <div class="nav-container">
			      <a href="index.html" class="nav-brand">${t('siteTitle')}</a>
			      <div class="nav-links">
			        <a href="index.html">${t('home')}</a>
			        <a href="syllables.html">${t('syllables')}</a>

	            ${showDev ? `
					<span class="dev-divider" style="border-left: 1px solid #ccc; margin: 0 4px;"></span>
					<span class="nav-dev" style="opacity: .5;">
						<a href="vowels.html">${t('vowels')}</a>
						<a href="headletters.html">${t('headLetters')}</a>
						<a href="grammar.html">${t('grammar')}</a>
					</span>
	            ` : ''}

	            <!-- Language Switcher Toggle -->
	            <div class="lang-switcher" style="margin-left: 15px; display: inline-flex; gap: 4px; align-items: center;">
	              <button type="button" id="langEn" style="background: none; border: 1px solid currentColor; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">EN</button>
	              <button type="button" id="langFr" style="background: none; border: 1px solid currentColor; padding: 2px 6px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">FR</button>
	            </div>
	          </div>
	        </div>
	      </nav>
	    `;

	    // Hook up event listeners for the buttons
	    setTimeout(() => {
	      document.getElementById('langEn')?.addEventListener('click', () => {
	        import('./i18n.js').then(module => module.setLanguage('en'));
	      });
	      document.getElementById('langFr')?.addEventListener('click', () => {
	        import('./i18n.js').then(module => module.setLanguage('fr'));
	      });
	    }, 0);

  }
}

// Universal Footer
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-container">
          <p>Voice audio recorded by Gen. Wangbhumo (Sarah College for Higher Tibetan Studies)</p>
          <p class="copyright">
            © 2026 jmonahan · Code under <a href="LICENSE">MIT License</a> · Audio under <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="noopener">CC BY-NC 4.0</a>
          </p>
        </div>
      </footer>
    `;
  }
}

/**
 * Creates a standardized Syllable Card DOM element.
 * 
 * @param {Object} config - Card configuration parameters
 * @param {string} config.id - Unique ID (e.g. "01_ka")
 * @param {string} config.script - Tibetan glyph to render (e.g. "ཀ" or "རྐ")
 * @param {string} [config.romanization] - Phonetic/English guide (e.g. "ka", "gaa")
 * @param {string} [config.tone] - Tone label/tip (e.g. "High tone", "Low → High")
 * @param {boolean} [config.hasSoundShift=false] - Whether sound shift star is active
 * @param {string} [config.shiftExplanation] - Tooltip explanation for the sound shift
 * @param {boolean} [config.isDisabled=false] - Grayed out / unselectable state
 * @returns {HTMLDivElement} Configured syllable card element
 */
export function createSyllableCard({
  id,
  script = '',
  romanization = null,
  tone = null,
  hasSoundShift = false,
  shiftExplanation = null,
  isDisabled = false
}) {
  const card = document.createElement('div');
  
  // Apply state classes
  card.className = `syllable-card ${hasSoundShift ? 'sound-shift' : ''} ${isDisabled ? 'disabled' : ''}`;
  card.dataset.id = id;

  /* 
   * CRITICAL FOR CSS :empty SELECTOR:
   * Do not insert whitespace/line breaks between tags for conditional content!
   */
	card.innerHTML = `
    <div class="card-body">
      <span class="tibetan-script">${script}</span>
    </div>
    
    <div class="card-footer">
      <div class="footer-text-group">
        <span class="romanization-text">${romanization || ''}</span>
        <span class="card-tone">${tone || ''}</span>
      </div>
		<svg class="shift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${shiftExplanation ? `title="${shiftExplanation}"` : ''}>
		  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"></path>
		</svg>
    </div>
  `;

  return card;
}

// Register the custom HTML tags
customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);