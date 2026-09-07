# HarvestPad, marketing site

HarvestPad: a permissionless yield-market factory on Robinhood Chain. This repo
holds both the marketing site and the app that launches and funds markets.
React 19 + Vite 7 + TypeScript, Tailwind v4, shadcn/ui, GSAP, lucide, Chart.js.

Names, addresses and links all live in `src/content/brand.ts`. Several are
unconfirmed guesses, listed in [PLACEHOLDERS.md](PLACEHOLDERS.md).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build -> dist/
npm run preview    # serve the production build
npm run typecheck
npm run format     # prettier, with Tailwind class sorting
npm run contrast   # verify every colour pair against WCAG
```

Copy `.env.example` to `.env` and fill it in. Nothing throws while it is empty:
the app runs, the pages work, and a banner names the variables that are still
missing instead of pretending a transaction can be built.

```bash
cp .env.example .env
```

## Stack

| Package                         | Role                                               |
| ------------------------------- | -------------------------------------------------- |
| `react` / `react-dom`           | UI                                                 |
| `vite` + `@vitejs/plugin-react` | dev server and bundler                             |
| `tailwindcss` v4                | styling, configured entirely in `src/index.css`    |
| `radix-ui`                      | behaviour behind the shadcn primitives             |
| `gsap` + `ScrollTrigger`        | scroll reveals, hero intro, hero parallax          |
| `lucide-react`                  | icon set (tree-shaken, 12 icons cost ~3.4 kB gzip) |
| `chart.js`                      | the two diagrams in the Mechanics section          |
| `prettier` + tailwind plugin    | formatting and class ordering                      |

Tailwind v4 has no `tailwind.config.js`. Tokens, the dark theme and the custom
utilities all live in `src/index.css` under `@theme inline`.

## Design system

Direction was resolved against the `ui-ux-pro-max` database before any code was
written; the returned values became the tokens in `src/index.css`.

|                 |                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------- |
| Style           | `neumorphism`, soft UI, embossed and debossed surfaces, radius 14px, no hard lines, monochromatic |
| Palette         | One surface `#E8EBF0` light / `#262B33` dark. Depth is shadow, not colour. Brand accent `#1D4FD8` |
| Type            | Inter for text, Fira Code for every number, address and ticker                                    |
| Landing pattern | `trust-authority-conversion`, hero → proof → solution → CTA path                                  |
| Motion          | 150 ms press, 200 ms hover, GSAP reveals at 0.7–0.85 s, all off under `prefers-reduced-motion`    |

### The four depth levels

Neumorphism has no cards. There is one surface, pushed out or pressed in, so
`bg-card` and `border` are almost never used. Four utilities in `src/index.css`
carry the whole system:

| Utility          | Use                                                       |
| ---------------- | --------------------------------------------------------- |
| `neu-raised`     | panels, tiles, list items, the default object             |
| `neu-raised-sm`  | small controls, badges, secondary buttons                 |
| `neu-raised-lg`  | the hero panel, the featured source, the closing CTA      |
| `neu-pressed`    | wells: icon slots, chart plots, the tab track, the footer |
| `neu-pressed-sm` | pills and micro-labels                                    |
| `neu-pressable`  | press feedback, raised, then sunk on `:active`, 150 ms    |

The light source is fixed at the top-left. Never flip a shadow pair, or the
object will read as lit from a second, impossible direction.

### Accessibility, which this style is bad at

The database flags neumorphism `accessibility risk: high`, and the reason is
structural: depth is carried by low-contrast shadows, so boundaries can vanish
for anyone with reduced contrast sensitivity, on a dim panel, or in sunlight.
Three rules hold the line, and they should not be relaxed:

1. **Text never depends on the effect.** Every pair is verified, run
   `npm run contrast`. Body text is 13.8:1, muted text 4.86:1, brand text
   5.56:1. The lighter `#2563EB` from the previous design was dropped because it
   measured 4.36:1 on this surface and failed.
2. **Interactive controls keep a real border.** A shadow alone is not a
   dependable boundary, so `--border-strong` sits at 3.79:1 (light) and 3.48:1
   (dark) to satisfy WCAG 1.4.11. `--border` is decorative only and exempt.
3. **Focus is a solid 2px ring with a 3px offset, never a shadow.** A soft glow
   cannot carry a focus state on a soft surface.

`npm run contrast` parses the tokens straight out of `src/index.css` and exits
non-zero on a regression, so it can go in CI.

### Theming

Light and dark are both first-class. `index.html` applies the stored choice
before first paint, so there is no flash. The toggle lives in the header and is
backed by a module-level store (`src/hooks/use-theme.ts`) because it renders
twice, once for desktop, once for mobile, and two `useState` copies would
drift apart.

Dark neumorphism needs a far weaker highlight than light: `--neu-light` drops
from 90% white to 5.5%. At full strength the surfaces read as moulded plastic.

## Layout

```
src/
  index.css              tokens, dark theme, base layer, neumorphic utilities
  content/
    brand.ts             every placeholder name, symbol, address and URL
    copy.ts              all marketing copy, composed from brand.ts
    markets.ts           the six placeholder market rows + the row type
  hooks/
    use-motion.ts        GSAP reveals, scoped reveals, parallax
    use-chart.ts         Chart.js lifecycle + theme-aware palette
    use-theme.ts         light/dark/system store
  lib/utils.ts           cn()
  router.tsx             route table; every app page is lazy
  routes/                one file per page, plus the app shell
  store/                 zustand: launch draft, market view, wallet summary
  wallet/                config, lazy runtime, gate, useWallet
  lib/env.ts             runtime config and what is still missing
  components/
    ui/                  shadcn primitives (owned, restyled for soft UI)
    hero-scene.tsx       the three.js object, lazy-loaded
    icons.tsx            lucide map, LogoGlyph and BrandMark
    *.tsx                one component per page section
  App.tsx                section order
```

To change a name, edit `src/content/brand.ts`. To change wording, edit
`src/content/copy.ts`. Section components hold no strings.

## Motion contract

`src/hooks/use-motion.ts` drives everything off data attributes:

| Attribute             | Effect                                                          |
| --------------------- | --------------------------------------------------------------- |
| `data-reveal`         | fades and lifts in when scrolled into view                      |
| `data-reveal-stagger` | container whose `data-reveal` children share one trigger        |
| `data-hero-intro`     | container whose `data-reveal` children play on load, not scroll |

Elements are hidden only while `html.reveal-ready` is set, and that class is
added by JS and only when motion is allowed, so a JS failure or a
reduced-motion preference leaves every element visible rather than blank.

`useRevealScope` exists for subtrees that mount after the site-wide context was
built; the lazily loaded Mechanics section uses it.

## Routes

| Path           | What it is                                                     |
| -------------- | -------------------------------------------------------------- |
| `/`            | the marketing site                                             |
| `/markets`     | every deployed market, with search, filter, sort and two views |
| `/markets/:id` | one market: its figures, its terms, and a deposit panel        |
| `/launch`      | the three-step wizard that deploys a market                    |
| `/manage`      | the markets the connected address created                      |

`createBrowserRouter` with real paths, so the host needs an SPA fallback: every
unknown path must serve `index.html`, or a refresh on `/markets` returns a 404
from the server. That is already handled for Netlify in `netlify.toml` and
`public/_redirects`. On Vercel it is a rewrite, on nginx `try_files $uri
/index.html`.

## Deploying to Netlify

`netlify.toml` already carries the build command, the publish directory, the SPA
fallback and cache headers, so Netlify needs no build settings typed by hand.

1. In Netlify, **Add new site → Import an existing project → GitHub**, and pick
   `Trixen-AI/yield`.
2. Leave the build settings alone. Netlify reads `netlify.toml`: build command
   `npm run build`, publish directory `dist`, Node 22.
3. Open **Site configuration → Environment variables** and add the values below.
   `.env` is gitignored, so nothing reaches Netlify from the repo.
4. Deploy. Every push to `main` redeploys from then on.

### Environment variables to set in Netlify

| Variable                       | Value                                        | Needed for               |
| ------------------------------ | -------------------------------------------- | ------------------------ |
| `VITE_REOWN_PROJECT_ID`        | your id from cloud.reown.com                 | opening the wallet modal |
| `VITE_CHAIN_ID`                | `4663`                                       | naming the network       |
| `VITE_CHAIN_NAME`              | `Robinhood Chain`                            | labels                   |
| `VITE_CHAIN_RPC_URL`           | `https://rpc.mainnet.chain.robinhood.com`    | reads, switching network |
| `VITE_CHAIN_EXPLORER_URL`      | `https://robinhoodchain.blockscout.com`      | explorer links           |
| `VITE_CHAIN_CURRENCY_NAME`     | `Ether`                                      | wallet display           |
| `VITE_CHAIN_CURRENCY_SYMBOL`   | `ETH`                                        | wallet display           |
| `VITE_CHAIN_CURRENCY_DECIMALS` | `18`                                         | wallet display           |
| `VITE_FACTORY_ADDRESS`         | the deployed factory                         | building transactions    |
| `VITE_SITE_URL`                | your live URL, e.g. `https://harvestpad.xyz` | wallet metadata          |

Two notes that will bite otherwise:

- **Vite inlines `VITE_*` at build time, not at run time.** Changing a variable
  in Netlify does nothing until you trigger a redeploy.
- **Anything named `VITE_*` ships to the browser.** That is correct for all of
  the above, since a Reown project id and an RPC URL are public by design. Never
  put a private key or an API secret behind a `VITE_` name.

Add the deployed URL to your Reown project's allowed domains, or the modal will
refuse to open in production.

## State: why Zustand and not Redux

There are two kinds of state here and only one of them belongs in a store.

Anything the chain knows is server state: balances, share prices, which markets
exist. That lives in TanStack Query by way of wagmi, which already handles
caching, refetching and invalidation. Putting it in Redux would mean
reimplementing all of that by hand.

What is left is small and local: the launch form draft and how the market list
is being looked at. Zustand covers both in about 130 lines with no providers, no
action types and no boilerplate, which suits a stack that has deliberately
avoided ceremony everywhere else.

- `store/use-launch-draft.ts` persists the wizard, so a refresh never loses
  someone's unsubmitted work. Only the draft persists; the step and the touched
  map are session noise.
- `store/use-market-view.ts` persists the sort and the view mode, not the search
  text, which should start empty every visit.
- `store/use-wallet-store.ts` carries the summary of the wallet, so pages can
  read connection state without importing wagmi.

## Wallet

Reown AppKit over the wagmi adapter. The modal detects installed wallets and
falls back to WalletConnect for mobile.

**It is not loaded until someone clicks connect.** The wallet stack is around
450 kB gzipped, which is most of what this project ships, and a visitor reading
the landing page or browsing markets has no use for it. `wallet/wallet-gate.tsx`
mounts the runtime on the first connect click, or immediately for a browser that
has connected before, so returning users still reconnect on their own. The
runtime mounts as a sibling rather than a wrapper, so activating it never
remounts the page you are on.

Only `wallet/wallet-runtime.tsx` and `wallet/config.ts` import wagmi or AppKit.
Pages read `useWallet()`, which is backed by the store.

### Configuration states

The app is honest about what it cannot do yet:

| Missing                                           | What happens                                    |
| ------------------------------------------------- | ----------------------------------------------- |
| `VITE_REOWN_PROJECT_ID`, `VITE_CHAIN_ID`, RPC URL | connect is disabled and says why                |
| `VITE_FACTORY_ADDRESS`                            | forms validate but will not build a transaction |
| wallet on another chain                           | the button switches chains instead of acting    |

No screen ever shows a live figure it does not have.

## The 3D object

`src/components/hero-scene.tsx` renders a car travelling down a road, built
from three.js primitives and animated with GSAP. The car never moves along the
road: the lane markings slide toward the viewer and recycle to the far end
inside the fog, and the wheels spin at the matching speed, so the motion reads
as forward travel without the object leaving frame. GSAP drives the intro
timeline, the suspension bob and lean, and a ScrollTrigger that swings the view
round the car as the page scrolls.

Two details keep it part of the design rather than a bolted-on ornament:

- the three.js key light sits at the top-left, the same place the CSS
  neumorphic shadows are lit from, so the object shares the page's light source;
- every material colour is read from the CSS custom properties, so the scene
  repaints when the theme is toggled and stays monochrome apart from the single
  blue accent on the bodywork.

It is lazy-loaded, stops rendering when scrolled out of view, renders a single
static frame under `prefers-reduced-motion`, disposes every geometry, material
and the renderer on unmount, and degrades to nothing if WebGL is unavailable.

## Charts

Both diagrams are honest about what they show:

- **Share price as yield accrues** is schematic and captioned as such. It shows
  the shape of the mechanism, not a real market's history.
- **Where 100 units of yield go** is arithmetic, derived from the two fee
  constants in `content/brand.ts`, so the chart cannot drift from the copy.

There is no live protocol data on this site, and no chart pretends otherwise.

## Bundle

Chart.js is lazy-loaded because it sits well below the fold.

| Chunk       | gzip        | When                           |
| ----------- | ----------- | ------------------------------ |
| react       | 69.2 kB     | initial                        |
| gsap        | 45.2 kB     | initial                        |
| radix       | 23.9 kB     | initial                        |
| app         | 23.8 kB     | initial                        |
| css         | 9.4 kB      | initial                        |
| icons       | 3.4 kB      | initial                        |
| **initial** | **~175 kB** |                                |
| chart       | 56.9 kB     | on scroll to Mechanics         |
| three       | 128.6 kB    | after first paint, hero object |

## Responsive behaviour

Mobile-first: unprefixed classes target small screens, `md:`/`lg:` scale up.

| Breakpoint | What changes                                                    |
| ---------- | --------------------------------------------------------------- |
| `< 640px`  | single column; the markets table renders as stacked cards       |
| `640px`    | market-type cards go to 2 columns; footer to 3                  |
| `768px`    | markets switch to the scrollable table; stats strip to 4 across |
| `1024px`   | desktop nav replaces the sheet; hero, steps and charts split    |

The markets table sits in a focusable `overflow-x-auto` region so it can be
scrolled by keyboard, and never widens the page.

## Accessibility

- Skip link, one `<h1>`, every section labelled.
- Focus indicator is a 2px outline with a 3px offset (WCAG 2.2 focus appearance).
- Tap targets are 44px by default (`Button` size `default` is `h-11`).
- The filter tabs render a real `TabsContent` panel, so `aria-controls` always
  points at an element that exists.
- Both charts carry `role="img"` and a descriptive label.
- All motion collapses under `prefers-reduced-motion: reduce`.

## Scope

Marketing surface only, every CTA points at a placeholder URL. There is no
wallet connection, no chain client and no routing; the stats strip and market
rows read from static content modules built for that swap.
