import type { TailwindIndicator } from './dist/index.js';

type IndicatorAttributes = {
  breakpoints?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  hotkey?: string;
  'auto-hide'?: string | number;
  hidden?: boolean;
  class?: string;
  style?: string;
};

declare global {
  interface HTMLElementTagNameMap {
    'tailwind-indicator': TailwindIndicator;
  }

  namespace JSX {
    interface IntrinsicElements {
      'tailwind-indicator': IndicatorAttributes;
    }
  }
}
