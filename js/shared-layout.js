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
                <option value="en">EN</option>
                <option value="fr">FR</option>
              </select>
            </div>
          </div>
        </nav>
      `;
    } else {
      // Render the full navigation bar for all other pages with native mobile popover support
this.innerHTML = `
        <nav class="site-nav">
          <div class="nav-container">
            <a href="index.html" class="nav-brand">${t('siteTitle')}</a>
            
            <!-- Native Mobile Hamburger Button -->
            <button type="button" class="nav-hamburger" popovertarget="navLinksContainer" aria-label="Toggle navigation menu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <!-- Navigation Links Container (Normal on desktop, popover drawer on mobile) -->
            <div class="nav-links" id="navLinksContainer">
              <a href="index.html">${t('home')}</a>
              <a href="syllables.html">${t('syllables')}</a>
              <a href="vowels.html">${t('vowels')}</a>
			  <a href="headletters.html">${t('headLetters')}</a>
              <a href="quiz.html">${t('quizTitle')}</a>
			
              ${showDev ? `
                <span class="dev-divider" style="border-left: 1px solid #ccc; margin: 0 4px;"></span>
                <span class="nav-dev" style="opacity: .5; display: inline-flex; gap: inherit; align-items: center;">

                    <a href="grammar.html">${t('grammar')}</a>
                </span>
              ` : ''}

              <!-- Language Dropdown Switcher -->
              <div class="lang-switcher" style="margin-left: 15px; display: inline-flex; align-items: center;">
                <select id="langSelect" aria-label="Language Selector">
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
                </select>
              </div>

            </div>
          </div>
        </nav>
      `;
  	  // Automatically apply popover capability on mobile viewport execution
      const linksContainer = this.querySelector('#navLinksContainer');
      if (linksContainer) {
        if (window.innerWidth <= 768) {
          linksContainer.setAttribute('popover', '');
        }

        linksContainer.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            if (linksContainer.hasAttribute('popover') && linksContainer.matches(':popover-open')) {
              linksContainer.hidePopover();
            }
          });
        });
      }
    }

    // Auto-close native popover when a link inside it is tapped on mobile
    const linksContainer = this.querySelector('#navLinksContainer');
    if (linksContainer) {
      linksContainer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          if (linksContainer.matches(':popover-open')) {
            linksContainer.hidePopover();
          }
        });
      });
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
  if (hasSoundShift) {
    card.title = t('syllableSoundChanges');
  }

  card.innerHTML = `
    <div class="card-body">
      <span class="tibetan-script">${script}</span>
    </div>
    
    <div class="card-footer">
      <div class="footer-text-group">
        <span class="romanization-text">${romanization || ''}</span>
        <span class="card-tone">${tone || ''}</span>
      </div>
		<svg class="shift-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		  <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"></path>
		</svg>
    </div>
  `;

  return card;
}

// Universal Controls Bar Component with 2-Row Layout & Global Speed Management
// Universal Controls Bar Component with 2-Row Layout & Global Speed Management
class SiteControls extends HTMLElement {
  connectedCallback() {
    const slottedContent = this.innerHTML.trim();
    const hasSlottedContent = slottedContent.length > 0;

    // Always start with both hints hidden by default
    document.body.classList.add('hide-romanization');
    document.body.classList.add('hide-tones');

    if (hasSlottedContent) {
		this.innerHTML = `
        <div class="controls-container">
          <!-- This wrapper creates the single outer white box for everything -->
          <div class="sticky-toggle-bar" style="">
            
            <!-- Page-specific selectors (Vowels, etc.) -->
            <div class="page-controls-row" style="">
              ${slottedContent}
            </div>
            
            <!-- Study Options Button (Lives INSIDE the white box, floats right on desktop, drops to row 2 on mobile) -->
            <button type="button" id="studyOptionsBtn" class="study-options-trigger" style="">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>${t('studyOptionsTitle')}</span>
            </button>

          </div>
        </div>

	  <!-- Native Dialog Settings Popup -->
	  <dialog id="controlsSettingsDialog" style="position: fixed; inset: 0; margin: auto; border: none; border-radius: 12px; padding: 25px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); background: var(--card-bg, #ffffff); color: var(--text-color, #333); max-width: 320px; width: 90%;">
	    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid var(--border-color, #eee); padding-bottom: 10px;">
	      <h3 style="margin: 0; font-size: 1.1rem;">${t('studyOptionsTitle')}</h3>
	      <button type="button" id="closeSettingsModal" style="background: none; border: none; font-size: 1.2rem; cursor: pointer; color: inherit;">&times;</button>
	    </div>
	    <div style="display: flex; flex-direction: column; gap: 15px;">
	      <div style="display: flex; flex-direction: column; gap: 8px;">
	        <label style="font-weight: bold; font-size: 0.9rem;">${t('showHintLabel')}</label>
	        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
	          <input type="checkbox" id="globalToggleEng"> ${t('phonetics')}
	        </label>
	        <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
	          <input type="checkbox" id="globalToggleTips"> ${t('tones')}
	        </label>
	      </div>
	      <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color, #eee); padding-top: 12px;">
	        <label for="globalSpeedSelect" style="font-weight: bold; font-size: 0.9rem;">${t('audioSpeedLabel')}</label>
	        <select id="globalSpeedSelect" style="padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--bg-color, #fff); color: inherit;">
	          <option value="1.0" selected>1.0x</option>
	          <option value="1.25">1.25x</option>
	          <option value="1.5">1.5x</option>
	          <option value="1.9">2x</option>
	        </select>
	      </div>
	    </div>
	  </dialog>
      `;
    } else {
      // SCENARIO B: Config-only page (like syllables.html) -> Render the full inline bar with i18n support
      this.innerHTML = `
        <div class="controls-container">
          <div class="sticky-toggle-bar" style="display: flex; align-items: center; justify-content: space-between; gap: 15px; flex-wrap: wrap; border: 1px solid var(--border-color, #e0e0e0); border-radius: 12px; background: var(--card-bg, #ffffff); padding: 12px 20px;">
            <div class="global-controls-row" style="display: flex; align-items: center; justify-content: space-between; width: 100%; flex-wrap: wrap; gap: 15px;">
              <span class="global-toggles" style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" id="globalToggleEng"> ${t('phonetics')}
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                  <input type="checkbox" id="globalToggleTips"> ${t('tones')}
                </label>
              </span>
              <span class="global-speed" style="display: flex; align-items: center; gap: 8px;">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.7;">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <select id="globalSpeedSelect" style="padding: 4px 8px; border-radius: 6px; border: 1px solid var(--border-color, #ccc); background: var(--bg-color, #fff); color: inherit;">
                  <option value="1.0" selected>1.0x</option>
                  <option value="1.25">1.25x</option>
                  <option value="1.5">1.5x</option>
                  <option value="1.9">2x</option>
                </select>
              </span>
            </div>
          </div>
        </div>
      `;
    }

    // Wire up Modal behavior
    const studyOptionsBtn = this.querySelector('#studyOptionsBtn');
    const settingsDialog = this.querySelector('#controlsSettingsDialog');
    const closeDialogBtn = this.querySelector('#closeSettingsModal');

    if (studyOptionsBtn && settingsDialog) {
      studyOptionsBtn.addEventListener('click', () => settingsDialog.showModal());
      closeDialogBtn?.addEventListener('click', () => settingsDialog.close());
      settingsDialog.addEventListener('click', (e) => {
        const rect = settingsDialog.getBoundingClientRect();
        if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
          settingsDialog.close();
        }
      });
    }

    // Wire up global toggles & speed sync
    this.querySelectorAll('#globalToggleEng').forEach(el => {
      el.addEventListener('change', (e) => document.body.classList.toggle('hide-romanization', !e.target.checked));
    });
    this.querySelectorAll('#globalToggleTips').forEach(el => {
      el.addEventListener('change', (e) => document.body.classList.toggle('hide-tones', !e.target.checked));
    });
    this.querySelectorAll('#globalSpeedSelect').forEach(el => {
      el.addEventListener('change', (e) => {
        window.globalPlaybackRate = parseFloat(e.target.value);
        window.dispatchEvent(new CustomEvent('playbackRateChanged', { detail: { speed: window.globalPlaybackRate } }));
      });
    });
  }
}

// Automatically catch ?lang= parameters on load, apply them, and clear the URL
window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');

  if (langParam && (langParam === 'en' || langParam === 'fr')) {
    const currentStoredLang = localStorage.getItem('siteLang');
    
    // If the requested language differs from storage, update storage and reload
    if (langParam !== currentStoredLang) {
      localStorage.setItem('siteLang', langParam);
      window.location.reload();
    } else {
      // If it's already set correctly, strip the query param from the URL 
      // so manual dropdown changes won't conflict with it on subsequent reloads
      urlParams.delete('lang');
      const newQuery = urlParams.toString();
      const newPath = window.location.pathname + (newQuery ? '?' + newQuery : '') + window.location.hash;
      window.history.replaceState({}, '', newPath);
    }
  }
});



// Initialize default global playback rate tracker
window.globalPlaybackRate = 1.0;

// Register the custom HTML tags
customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);
customElements.define('site-controls', SiteControls);