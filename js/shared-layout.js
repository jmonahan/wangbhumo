import { t, getLang } from './i18n.js';

// Universal Navigation Bar
class SiteNav extends HTMLElement {
  connectedCallback() {
    // Check if the <site-nav> tag has the "homepage" attribute
    const isHomepage = this.hasAttribute('homepage');
	
    // Check if explicitly told to show via attribute OR if we are running locally

	 const hostname = window.location.hostname;

	 // Check if it's localhost or a standard local network IP
	 const showDev = hostname === 'localhost' || 
	               hostname === '127.0.0.1' || 
	               hostname.startsWith('10.') || 
	               hostname.startsWith('192.168.') ||
	               hostname.startsWith('172.'); // Covers all standard local IP ranges

    if (isHomepage) {
      // Render ONLY the language dropdown for the homepage
      this.innerHTML = `
        <nav class="site-nav" style="background: transparent; border-bottom: none; box-shadow: none;">
          <div class="nav-container" style="justify-content: flex-end;">
            <div class="lang-switcher" style="display: inline-flex; align-items: center; padding: 15px;">
              <select id="langSelect" aria-label="Language Selector" style="background: transparent; border: 1px solid currentColor; color: inherit; padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </nav>
      `;
    } else {
      // Render the full navigation bar for all other pages (syllables, vowels, etc.)
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

              <!-- Language Dropdown Switcher -->
              <div class="lang-switcher" style="margin-left: 15px; display: inline-flex; align-items: center;">
                <select id="langSelect" aria-label="Language Selector" style="background: transparent; border: 1px solid currentColor; color: inherit; padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>

            </div>
          </div>
        </nav>
      `;
    }

    // Set the dropdown to match the active language helper function getLang()
    const currentLang = typeof getLang === 'function' ? getLang() : (localStorage.getItem('lang') || 'en');
    const selectElem = this.querySelector('#langSelect');
    if (selectElem) {
      selectElem.value = currentLang;
    }

    // Attach event listener for the language dropdown
    this.querySelector('#langSelect')?.addEventListener('change', (e) => {
      const selectedLang = e.target.value;
      import('./i18n.js').then(module => {
        module.setLanguage(selectedLang);
        window.location.reload();
      });
    });
	
  }
}

// Universal Footer
class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="site-footer">
        <div class="footer-container">
          <p>${t('voiceAudioCredit')}</p>
          <p class="copyright">
            <p>&copy; 2026 jmonahan &bull; ${t('codeUnder')} <a href="https://opensource.org/licenses/MIT" target="_blank">MIT License</a> &bull; ${t('audioUnder')} <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a></p>
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

// Universal Controls Bar Component with 2-Row Layout & Global Speed Management
class SiteControls extends HTMLElement {
  connectedCallback() {
    const slottedContent = this.innerHTML.trim();
    const hasSlottedContent = slottedContent.length > 0;

    // Always start with both hints (phonetics and tones) hidden/unchecked on every page load
    document.body.classList.add('hide-romanization');
    document.body.classList.add('hide-tones');

	this.innerHTML = `
	  <div class="controls-container">
	    <div class="sticky-toggle-bar">
	      <!-- Row 1: Global Settings & Speed -->
	      <div class="global-controls-row">
	        <span class="global-toggles">
	          <label class="hints-label">${t('hintsLabel') || 'Hints:'}</label>
	          <label class="toggle-label">
	            <input type="checkbox" id="globalToggleEng"> ${t('phonetics') || 'Phonetics'}
	          </label>
	          <label class="toggle-label">
	            <input type="checkbox" id="globalToggleTips"> ${t('tones') || 'Tones'}
	          </label>
	        </span>
	        <span class="global-speed">
	          <label for="globalSpeedSelect" class="speed-label">${t('speedLabel') || 'Speed:'}</label>
	          <select id="globalSpeedSelect" class="speed-select">
	            <option value="1.0" selected>1.0x</option>
	            <option value="1.25">1.25x</option>
	            <option value="1.5">1.5x</option>
	            <option value="1.9">2x</option>
	          </select>
	        </span>
	      </div>
	      <!-- Row 2: Rendered ONLY if page-specific content exists -->
	      ${hasSlottedContent ? `
	        <div class="page-controls-row page-controls-row2">
	          ${slottedContent}
	        </div>
	      ` : ''}
	    </div>
	  </div>
	`;

    // Wire up global Romanization toggle (uncheck/hidden by default)
    const engToggle = this.querySelector('#globalToggleEng');
    engToggle?.addEventListener('change', (e) => {
      document.body.classList.toggle('hide-romanization', !e.target.checked);
    });

    // Wire up global Tones/Tips toggle (uncheck/hidden by default)
    const tipsToggle = this.querySelector('#globalToggleTips');
    tipsToggle?.addEventListener('change', (e) => {
      document.body.classList.toggle('hide-tones', !e.target.checked);
    });

    // Centralize Global Speed State
    const speedSelect = this.querySelector('#globalSpeedSelect');
    speedSelect?.addEventListener('change', (e) => {
      const newSpeed = parseFloat(e.target.value);
      window.globalPlaybackRate = newSpeed;
      window.dispatchEvent(new CustomEvent('playbackRateChanged', { detail: { speed: newSpeed } }));
    });
  }
}




// Initialize default global playback rate tracker
window.globalPlaybackRate = 1.0;

// Register the custom HTML tags
customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);
customElements.define('site-controls', SiteControls);