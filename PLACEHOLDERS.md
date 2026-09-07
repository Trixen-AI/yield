# Names, addresses and links

Every name, symbol, address and URL on the site lives in
`src/content/brand.ts`. Change a value there and the whole site follows. No
component hard-codes a brand name.

Three files hold everything:

| File                     | Holds                                                       |
| ------------------------ | ----------------------------------------------------------- |
| `src/content/brand.ts`   | product, chain, contracts, economics, links, headline stats |
| `src/content/markets.ts` | the six illustrative market rows                            |
| `index.html`             | `<title>`, meta description, Open Graph tags                |

The logo is drawn twice and the two must stay in sync: `LogoGlyph` in
`src/components/icons.tsx` and `public/favicon.svg`.

## Confirm these before launch

These values were filled in from the project name and from the original copy.
The Status column says how far each one has been verified.

| Value             | Currently                               | Status                           |
| ----------------- | --------------------------------------- | -------------------------------- |
| Product name      | HarvestPad                              | confirmed                        |
| Chain             | Robinhood Chain, id 4663                | confirmed, see src/lib/env.ts    |
| Gas symbol        | ETH, 18 decimals                        | confirmed, Arbitrum Orbit rollup |
| Launch fee        | 0.001 ETH                               | from the original copy           |
| Settlement asset  | USDG                                    | from the original copy           |
| Factory address   | `0x61C9…9359`                           | from the original copy           |
| Vault contract    | HarvestVault                            | renamed from YieldVault          |
| Factory contract  | HarvestPad factory                      | renamed                          |
| Lens contract     | HarvestPad lens                         | renamed                          |
| Featured source   | Steakhouse USDG, ERC-4626, 430 M USDG   | from the original copy           |
| Explorer name     | Blockscout                              | confirmed                        |
| Explorer URLs     | `https://robinhoodchain.blockscout.com` | domain confirmed, addresses not  |
| Source code       | `https://github.com/Trixen-AI/yield`    | confirmed                        |
| Social            | `https://x.com/HarvestPad`              | set by you, handle unverified    |
| Site URL (OG tag) | `https://harvestpad.org`                | confirmed                        |
| App routes        | `/launch`, `/markets`, `/manage`        | live, see src/router.tsx         |

The explorer URLs also carry invented contract addresses. Replace the whole
`links` object once the real deployment exists.

## Fee constants

The two fee percentages are numbers, not strings, because the fee-split chart
derives its segments from them:

```ts
const MAX_PERFORMANCE_FEE_PCT = 20
const PROTOCOL_FEE_SHARE_PCT = 20
```

Change these and the copy, the spec table and the chart all move together.

## Market rows

The six rows in `src/content/markets.ts` are illustrative names on genuinely
empty markets. Every figure is zero and `apy` is `null`, which renders as
"n/a" rather than inventing a return. Replace the module with a lens-contract
read once a chain client is wired in.
