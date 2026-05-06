# EPCT Branding & Design Tokens

Captured brand identity and design-token contract for the EPCT catalogue. Exact hex values are extracted from the logo file on **Day 2 of local development** and locked into `tailwind.config.ts`; until then the values below are working approximations.

---

## 1. Logo

**Concept (per client brief):**

- "EPCT" in large blocky uppercase letters, dominant in dark green.
- Stylized mechanical arm (excavator/concrete pump boom) extending across the top.
- Gear/cogwheel icon partially behind the "E" on the left.
- Subtitle (French) below the wordmark: **"PIÈCES POUR CENTRALES & POMPES À BÉTON"**.
- Monochromatic green scheme with metallic gradients; black outlines + subtle white accents.

**Files (you provide → drop into `CAB/public/img/`):**

- `logo.svg` — primary, vector (preferred)
- `logo-mark.svg` — square version (gear + "E" only) for favicon, social avatars
- `logo-white.svg` — knock-out variant for dark backgrounds
- `favicon.ico`, `favicon-32.png`, `apple-touch-icon.png` — generated from `logo-mark` on Day 2

If only raster is available: PNG ≥ 1024 px on transparent background, plus a smaller `logo-mark.png` for favicons.

---

## 2. Color palette (working tokens — confirm Day 2)

| Token | Tailwind name | Approx hex | Usage |
|---|---|---|---|
| **Primary / dark green** | `epct.dark` | `#0F3D2E` | Wordmark, headings on light bg, primary buttons |
| **Mid green** | `epct.green` | `#1F7A4D` | Section accents, hover states, gradients |
| **Accent / lime** | `epct.lime` | `#A3E635` | Subtitle, CTAs, links, highlight chips |
| **Black outline** | `epct.ink` | `#0A0A0A` | Body text, icon strokes |
| **Concrete gray** | `epct.gray-50…900` | Tailwind neutral scale | Backgrounds, borders, mutes |
| **White** | `epct.white` | `#FFFFFF` | Backgrounds, knock-out logo, cards |

**Dark mode:**

- Background: `#0A0F0C` (near-black with green tint)
- Surface: `#10211B`
- Primary text: `#E5F4EC`
- Accent: `epct.lime` stays the same (still readable on dark)

**Token usage rules:**

- Components consume **tokens only** (`bg-epct-dark`, `text-epct-lime`) — never raw hex.
- Lime accent reserved for CTAs and links — overuse kills its punch.
- Dark green is the heaviest weight; never use lime for body text.

---

## 3. Typography

- **Display / headings:** condensed industrial sans (e.g. `Barlow Condensed`, `Oswald`, or extract from logo wordmark) — bold, uppercase, tight tracking.
- **Body:** clean neutral sans (`Inter` or `IBM Plex Sans`) — weight 400/500, generous line-height.
- **Mono (rare, for product references):** `JetBrains Mono` — tabular figures.

Self-host via `next/font/local` (preferred, no Google CDN dependency) → fonts in `CAB/public/fonts/`.

**Scale (Tailwind):**

- `display-xl` 4.5rem / `display-lg` 3.5rem / `h1` 2.5rem / `h2` 2rem / `h3` 1.5rem
- `body-lg` 1.125rem / `body` 1rem / `body-sm` 0.875rem
- Tight tracking (-0.02em) on display sizes, normal on body.

---

## 4. Visual language

- **Industrial grit, not flashy:** sharp 90° corners on cards/buttons (`rounded-none` or `rounded-sm` only); no soft pill shapes.
- **Photography:** real machinery, parts, workshop scenes — high contrast, slightly desaturated except for green accents.
- **Iconography:** Lucide line icons, 1.5 px stroke, ink color; gear/wrench/truck motifs reinforced where contextual.
- **Spacing:** generous (Tailwind `gap-8`/`gap-12` between sections); content max-width `1280px`.
- **Motion:** subtle — section fade/slide on scroll (Framer Motion), Lenis smooth-scroll md+ only, respect `prefers-reduced-motion`.

---

## 5. Inspiration references

User-provided images live in `CAB/inspiration/`. Day 2 ritual: review them together, distill 3 concrete decisions (e.g. "hero composition like image 4", "card style like image 7"), pin those notes here.

**To-fill on Day 2:**

- Hero composition reference: ____
- Product card reference: ____
- Catalogue grid layout reference: ____
- Typography pairing reference: ____

---

## 6. Tailwind config sketch (Day 2 deliverable)

```ts
// tailwind.config.ts (excerpt)
export default {
  theme: {
    extend: {
      colors: {
        epct: {
          dark: '#0F3D2E',
          green: '#1F7A4D',
          lime: '#A3E635',
          ink: '#0A0A0A',
          bg: '#FFFFFF',
          'dark-bg': '#0A0F0C',
          'dark-surface': '#10211B',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.125rem', // 2px — industrial, sharp
      },
    },
  },
};
```

---

## 7. Open items

1. Drop `logo.svg` (or PNG) into `CAB/public/img/` so I can extract exact greens.
2. Drop reference images into `CAB/inspiration/` before Day 2.
3. Confirm font choice (or let me pick from the shortlist on Day 2).
4. Decide: dark mode at launch, or v1.1 polish?
