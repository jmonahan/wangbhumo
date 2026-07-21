// Universal Navigation Bar
class SiteNav extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <nav class="site-nav">
        <div class="nav-container">
          <a href="index.html" class="nav-brand">Tibetan Study Companion</a>
          <div class="nav-links">
            <a href="index.html">Home</a>
            <a href="syllables.html">Syllables</a>
          </div>
        </div>
      </nav>
    `;
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

// Register the custom HTML tags
customElements.define('site-nav', SiteNav);
customElements.define('site-footer', SiteFooter);