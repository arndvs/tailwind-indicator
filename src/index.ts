const DEFAULT_BREAKPOINTS: Record<string, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

const STYLES = `
  :host {
    position: fixed;
    bottom: 4px;
    left: 4px;
    z-index: 2147483647;
    display: flex;
    align-items: center;
    height: 24px;
    padding: 0 10px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    line-height: 1;
    color: #f1f5f9;
    background: #1e293b;
    border-radius: 9999px;
    opacity: 0.9;
    pointer-events: none;
    user-select: none;
    transition: opacity 0.15s;
  }
  :host(:hover) {
    opacity: 1;
    pointer-events: auto;
  }
  :host([hidden]) {
    display: none;
  }
  .sep {
    margin: 0 6px;
    opacity: 0.35;
  }
  .bp {
    color: #38bdf8;
    font-weight: 600;
  }
`;

class TailwindIndicator extends HTMLElement {
  private _shadow: ShadowRoot;
  private _content: HTMLSpanElement;
  private _resizeHandler: () => void;
  private _keyHandler: (e: KeyboardEvent) => void;
  private _breakpoints: Record<string, number> = DEFAULT_BREAKPOINTS;

  static get observedAttributes() {
    return ['breakpoints', 'position', 'hotkey'];
  }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = STYLES;
    this._shadow.appendChild(style);

    this._content = document.createElement('span');
    this._shadow.appendChild(this._content);

    this._resizeHandler = () => this._update();
    this._keyHandler = (e: KeyboardEvent) => this._handleKey(e);
  }

  connectedCallback() {
    this._parseBreakpoints();
    this._applyPosition();
    this._update();
    window.addEventListener('resize', this._resizeHandler);
    window.addEventListener('keydown', this._keyHandler);
  }

  disconnectedCallback() {
    window.removeEventListener('resize', this._resizeHandler);
    window.removeEventListener('keydown', this._keyHandler);
  }

  attributeChangedCallback(name: string) {
    if (name === 'breakpoints') this._parseBreakpoints();
    if (name === 'position') this._applyPosition();
    this._update();
  }

  private _parseBreakpoints() {
    const attr = this.getAttribute('breakpoints');
    if (!attr) {
      this._breakpoints = DEFAULT_BREAKPOINTS;
      return;
    }
    try {
      this._breakpoints = JSON.parse(attr);
    } catch {
      this._breakpoints = DEFAULT_BREAKPOINTS;
    }
  }

  private _applyPosition() {
    const pos = this.getAttribute('position') ?? 'bottom-left';
    const host = this._shadow.host as HTMLElement;
    // Reset
    host.style.removeProperty('top');
    host.style.removeProperty('bottom');
    host.style.removeProperty('left');
    host.style.removeProperty('right');

    switch (pos) {
      case 'top-left':
        host.style.top = '4px';
        host.style.left = '4px';
        break;
      case 'top-right':
        host.style.top = '4px';
        host.style.right = '4px';
        break;
      case 'bottom-right':
        host.style.bottom = '4px';
        host.style.right = '4px';
        break;
      default: // bottom-left
        host.style.bottom = '4px';
        host.style.left = '4px';
    }
  }

  private _handleKey(e: KeyboardEvent) {
    const hotkey = this.getAttribute('hotkey') ?? 'ctrl+shift+t';
    const parts = hotkey.toLowerCase().split('+');
    const key = parts.pop();
    const needCtrl = parts.includes('ctrl');
    const needShift = parts.includes('shift');
    const needAlt = parts.includes('alt');

    if (
      e.key.toLowerCase() === key &&
      e.ctrlKey === needCtrl &&
      e.shiftKey === needShift &&
      e.altKey === needAlt
    ) {
      e.preventDefault();
      this.hidden = !this.hidden;
    }
  }

  private _currentBreakpoint(width: number): string {
    const sorted = Object.entries(this._breakpoints).sort(
      ([, a], [, b]) => b - a
    );
    return sorted.find(([, value]) => width >= value)?.[0] ?? 'xs';
  }

  private _update() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const bp = this._currentBreakpoint(w);
    const dpr = window.devicePixelRatio;
    const orient = screen.orientation?.type
      .replace('portrait-primary', '↕')
      .replace('portrait-secondary', '↕')
      .replace('landscape-primary', '↔')
      .replace('landscape-secondary', '↔') ?? '';

    const sep = '<span class="sep">·</span>';
    this._content.innerHTML =
      `<span class="bp">${bp}</span>${sep}${w}×${h}${sep}${orient}${sep}${dpr}x`;
  }
}

export function register(tagName = 'tailwind-indicator') {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, TailwindIndicator);
  }
}

// Auto-register with default tag name
register();

export { TailwindIndicator, DEFAULT_BREAKPOINTS };
