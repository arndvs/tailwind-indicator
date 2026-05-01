# tailwind-indicator

Tiny screen-size indicator for Tailwind CSS. Shows current breakpoint, viewport dimensions, orientation, and pixel ratio in a fixed-position pill.

Zero dependencies. Framework-agnostic. Built as a vanilla [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components).

![3 KB](https://img.shields.io/badge/size-3%20KB-brightgreen)

## Install

```bash
npm install tailwind-indicator
```

## Usage

### ESM / bundler (React, Next.js, Svelte, etc.)

```ts
import 'tailwind-indicator';
```

Then drop the element anywhere in your layout:

```html
<tailwind-indicator></tailwind-indicator>
```

**Next.js App Router** — import in your root layout:

```tsx
// app/layout.tsx
import 'tailwind-indicator';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === 'development' && (
          // @ts-expect-error — custom element
          <tailwind-indicator />
        )}
      </body>
    </html>
  );
}
```

### Script tag (no build step)

```html
<script type="module" src="https://esm.sh/tailwind-indicator"></script>
<tailwind-indicator></tailwind-indicator>
```

## Attributes

| Attribute     | Default            | Description                                       |
| ------------- | ------------------ | ------------------------------------------------- |
| `breakpoints` | Tailwind v3 defaults | JSON object mapping breakpoint names to pixel values |
| `position`    | `bottom-left`      | `bottom-left`, `bottom-right`, `top-left`, `top-right` |
| `hotkey`      | `ctrl+shift+t`     | Keyboard shortcut to toggle visibility             |

### Custom breakpoints

```html
<tailwind-indicator
  breakpoints='{"sm":480,"md":768,"lg":1024,"xl":1440}'
></tailwind-indicator>
```

### Position

```html
<tailwind-indicator position="top-right"></tailwind-indicator>
```

### Custom hotkey

```html
<tailwind-indicator hotkey="ctrl+shift+d"></tailwind-indicator>
```

## API

```ts
import { register, TailwindIndicator, DEFAULT_BREAKPOINTS } from 'tailwind-indicator';

// Auto-registers as <tailwind-indicator> on import.
// Use register() with a custom tag name:
register('my-indicator');
```

## Default breakpoints

Matches [Tailwind CSS v3 defaults](https://tailwindcss.com/docs/responsive-design):

| Name | Min-width |
| ---- | --------- |
| xs   | 0px       |
| sm   | 640px     |
| md   | 768px     |
| lg   | 1024px    |
| xl   | 1280px    |
| 2xl  | 1536px    |

## License

MIT
