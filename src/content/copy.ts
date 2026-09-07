import { assets, brand, chain, contracts, economics, featuredSource, links } from './brand'

/**
 * All marketing copy for the site. Written fresh; every proper noun is pulled
 * from `brand.ts`, so this file stays readable while names stay swappable.
 */

export const nav = {
  items: [
    { label: 'Markets', href: '#markets' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'The vault', href: '#the-vault' },
    { label: 'Mechanics', href: '#mechanics' },
    { label: 'FAQ', href: '#faq' },
  ],
  primaryCta: { label: 'Launch a market', href: links.launch },
}

export const hero = {
  eyebrow: `Permissionless yield markets · ${chain.name}`,
  title: 'Ship a yield market in one transaction.',
  lead: `${brand.name} is a factory, not a fund. Describe where a return comes from, point the market at a strategy, and the factory deploys a standalone vault for it. From that block onward anyone can deposit, and nobody, including us, can close the door.`,
  ctas: {
    primary: { label: 'Launch a market', href: links.launch },
    secondary: { label: 'Browse live markets', href: links.markets },
  },
}

export const factoryPanel = {
  label: contracts.factoryName,
  status: 'live',
  terms: [
    { term: 'Factory address', value: contracts.factoryAddress, mono: true },
    { term: 'Launch fee', value: `${economics.launchFee} ${chain.gasSymbol}`, mono: true },
    { term: 'Performance fee', value: `creator's call, capped at ${economics.maxPerformanceFee}` },
    { term: 'Fee basis', value: 'realised yield only' },
    { term: 'Vault owner', value: 'none; no admin key exists' },
  ],
}

export const marketsMarquee = {
  heading: 'Deployed by the factory so far',
}

export const markets = {
  eyebrow: 'Every deployment, unfiltered',
  title: 'Deployed, not curated.',
  lead: `Everything the factory has ever produced, in the order it was created. Nothing on this list is ranked, screened or recommended. ${brand.shortName} has no opinion about which market deserves your capital.`,
  linkLabel: 'Open the full market list',
  columns: ['Market', 'Strategy', 'APY', 'TVL', 'Yield paid', 'Depositors', 'Custody', 'Age'],
  filters: [
    { value: 'all', label: 'All markets' },
    { value: 'Stablecoin lending', label: 'Lending' },
    { value: 'Tokenised assets', label: 'Tokenised' },
    { value: 'Liquidity provision', label: 'LP fees' },
    { value: 'Real-world credit', label: 'RWA' },
    { value: 'Liquidation backstop', label: 'Backstop' },
  ],
  columnHints: {
    APY: 'Annualised, measured from the vault’s own share price. A market with no deposits has none to report.',
    TVL: 'Idle balance plus whatever the vault has sent to its strategy, counted from what actually left the vault.',
    Custody:
      'How much of the market is sitting in the vault versus deployed to the strategy right now.',
  } as Record<string, string>,
  emptyNote:
    'Every rate here is measured from the vault’s own share price, never projected. A market that has taken no deposits shows "n/a" rather than a number it cannot support.',
}

export const howItWorks = {
  eyebrow: 'The core flow',
  title: 'Five steps, none of which route through us.',
  lead: `${brand.name} is a launchpad, not an aggregator. It does not source strategies, score them, or maintain a shortlist. It deploys the market and steps out of the way.`,
  steps: [
    {
      n: '01',
      icon: 'pen',
      title: 'Describe the yield',
      body: 'Give the market a name, a ticker for its shares, and one honest sentence about where the return actually comes from.',
    },
    {
      n: '02',
      icon: 'sliders',
      title: 'Set the terms',
      body: 'Wire it to a live yield source or name your own strategy address, then fix the custody ceiling and the performance fee you intend to charge.',
    },
    {
      n: '03',
      icon: 'rocket',
      title: 'Deploy the vault',
      body: `One call to the ${contracts.factoryName} mints a vault that belongs to this market alone. No shared pool, no shared blast radius.`,
    },
    {
      n: '04',
      icon: 'wallet',
      title: 'Take deposits',
      body: 'Depositors send the asset and receive ERC-20 shares in return. The market opens the moment it exists. There is no listing queue.',
    },
    {
      n: '05',
      icon: 'trending',
      title: 'Pass the return through',
      body: 'Every token that lands in the vault lifts the price of a share. Holders redeem at that price, on their own schedule.',
    },
  ],
}

export const marketTypes = {
  eyebrow: 'What qualifies',
  title: 'Any yield. One market shape.',
  lead: 'The vault is indifferent to where a return originates. It checks one thing: that more of the asset came back than went out. That covers most of what earns onchain today.',
  items: [
    {
      tag: 'lending',
      icon: 'lending',
      title: 'Stablecoin lending',
      body: 'Supply a stable asset into a lending venue and route the borrow rate through to depositors.',
    },
    {
      tag: 'tokenised',
      icon: 'tokenised',
      title: 'Tokenised assets',
      body: 'Return earned on tokenised equities, funds and other onchain exposure to offchain instruments.',
    },
    {
      tag: 'lp-fees',
      icon: 'lpFees',
      title: 'Liquidity provision',
      body: 'Post liquidity into a pool and send the trading fees it collects back into the vault.',
    },
    {
      tag: 'backstop',
      icon: 'backstop',
      title: 'Liquidation backstop',
      body: 'Capital held ready to absorb liquidations and capture the discount that comes with them.',
    },
    {
      tag: 'rwa',
      icon: 'rwa',
      title: 'Real-world credit',
      body: 'Offchain cashflow (bills, private credit, receivables) settled back onchain on a fixed cycle.',
    },
    {
      tag: 'custom',
      icon: 'custom',
      title: 'Bring your own',
      body: 'Anything else that returns more of the asset than it took. If it settles, it can be a market.',
    },
  ],
}

export const vault = {
  eyebrow: 'What the factory deploys',
  title: 'A vault that cannot overstate its own size.',
  lead: 'Every market is the same contract compiled with different constants. No owner, no pause switch, no upgrade path. The figures on a market page are read out of storage, not reported by us.',
  specTitle: 'The contract',
  spec: [
    { term: 'Contract', value: contracts.vaultName, mono: true },
    { term: 'Shares', value: "ERC-20, priced in the market's asset" },
    { term: 'Deposits', value: 'open to any address' },
    { term: 'Withdrawals', value: 'any time, against the idle balance' },
    { term: 'Deploy ceiling', value: 'fixed at launch, cannot be raised' },
    { term: 'Performance fee', value: `on yield only, capped at ${economics.maxPerformanceFee}` },
    { term: 'Protocol share of that fee', value: economics.protocolFeeShare },
  ],
  guaranteesTitle: 'Three properties it enforces',
  guarantees: [
    {
      title: 'TVL rises only when tokens arrive',
      body: 'Capital sitting at the strategy is counted from what actually left the vault. No function anywhere writes a larger number, so a creator can mark a position down but never up.',
    },
    {
      title: 'The fee touches yield, never principal',
      body: 'Fee shares mint only when the vault is worth more than the last time it checked, and they dilute holders by exactly the stated fee, not a basis point more.',
    },
    {
      title: 'Illiquidity is disclosed, not queued',
      body: 'A withdrawal larger than the idle balance reverts on the spot instead of joining a queue. Every market publishes how much of it is out at the strategy right now.',
    },
  ],
}

export const strategySource = {
  eyebrow: 'Where a market earns',
  title: 'Point it at something that already pays.',
  lead: `A market can be wired to a live ${featuredSource.standard} vault on ${chain.name}. ${brand.name} deploys a thin adapter that you own, the market supplies its capital into the source, and anyone can push principal and yield back the other way.`,
  featured: {
    badge: `live on ${chain.name}`,
    name: featuredSource.name,
    body: `A ${featuredSource.standard} vault holding roughly ${featuredSource.approximateSize}. Its share price sits above one and climbs as it accrues; the adapter supplies your market's capital into it and redeems on demand.`,
    spec: [
      {
        term: 'Standard',
        value: `${featuredSource.standard}, ${assets.primarySymbol} denominated`,
      },
      { term: 'Held in the source', value: featuredSource.approximateSize, mono: true },
      { term: 'Share price', value: 'read live at deposit time' },
      { term: 'Adapter', value: 'deployed by you, owned by you' },
    ],
  },
  footnote:
    'You are not limited to the sources listed here. Any address can be a strategy: a trading desk, a contract, a multisig. A market that names one says so plainly on its own page.',
}

export const roles = {
  eyebrow: 'Who does what',
  title: 'Three parties, and only one of them is code.',
  items: [
    {
      role: 'Creators',
      title: 'bring the strategy.',
      body: 'The person who knows where the yield is should not have to ship a protocol to sell access to it. They describe it, set the terms, and launch.',
    },
    {
      role: brand.name,
      title: 'creates the market.',
      body: 'The factory deploys the identical vault every time: shares, accounting, custody ceiling, fee. Nothing bespoke, nothing that needs reviewing.',
    },
    {
      role: 'Depositors',
      title: 'bring the capital.',
      body: 'Fund whichever market you believe in, inspect exactly what it holds and what it has paid out, and redeem your shares at their price.',
    },
  ],
}

export const finalCta = {
  title: 'Launch it. Fund it. Earn from it.',
  lead: `One transaction and ${economics.launchFee} ${chain.gasSymbol}, and the market exists. On the chain, not on a waitlist.`,
  ctas: {
    primary: { label: 'Launch a market', href: links.launch },
    secondary: { label: 'Browse markets', href: links.markets },
  },
}

export const mechanics = {
  eyebrow: 'The mechanics',
  title: 'How a share behaves, and where a unit of yield lands.',
  lead: 'Two diagrams, both derived from the contract rather than from live markets. The first is schematic, showing the shape of the mechanism rather than a real market. The second is arithmetic: it follows directly from the fee constants above.',
  sharePrice: {
    title: 'Share price as yield accrues',
    caption: 'Schematic. Deposits do not move the share price; only arriving yield does.',
    seriesLabels: { price: 'Share price', principal: 'Principal per share' },
    note: 'A deposit mints shares at the current price, so it lifts TVL without moving the line. Between deposits, every token that arrives from the strategy pushes it up.',
  },
  feeSplit: {
    title: 'Where 100 units of yield go',
    captionPrefix: 'At the maximum performance fee of',
    labels: { depositors: 'Depositors', creator: 'Creator', protocol: 'Protocol' },
    note: 'Principal is never touched. A creator charging less than the cap moves the split toward depositors; the protocol always takes its share of the fee, never of the yield directly.',
  },
}

export const faq = {
  eyebrow: 'Before you deposit',
  title: 'The questions worth asking first.',
  items: [
    {
      q: 'Who can stop a market once it is deployed?',
      a: `Nobody. The vault has no owner, no pause function and no upgrade path. ${brand.name} cannot freeze a market, delist it, or claw back a deposit, and neither can the creator.`,
    },
    {
      q: 'What stops a creator from taking the capital?',
      a: 'The vault only lets a creator move capital to the strategy address declared at launch, and only up to the custody ceiling fixed at launch. Neither can be changed afterwards. This bounds the exposure; it does not eliminate it. If the declared strategy loses money, that loss is real.',
    },
    {
      q: 'Can I always withdraw?',
      a: 'You can always withdraw against the idle balance sitting in the vault. If your withdrawal is larger than that, the transaction reverts rather than joining a queue. Every market page shows how much of it is currently deployed, so the constraint is visible before you deposit.',
    },
    {
      q: 'How is the performance fee actually charged?',
      a: `Fee shares mint only when the vault is worth more than at its last checkpoint, and only against that increase. The fee is capped at ${economics.maxPerformanceFee} of yield; ${economics.protocolFeeShare} of whatever the creator charges goes to the protocol. Principal is never charged.`,
    },
    {
      q: `Does ${brand.name} review the markets listed here?`,
      a: 'No. There is no review, no rating and no shortlist. Anything the factory deploys appears in the list, in deployment order. Read the strategy description and the custody terms yourself, and treat an unfamiliar strategy address as unvetted.',
    },
    {
      q: 'What does the launch fee pay for?',
      a: `The flat ${economics.launchFee} ${chain.gasSymbol} fee is charged once, at deployment, and exists to make spamming the factory costly. It is not a share of your market's yield.`,
    },
  ],
}

export interface FooterLink {
  label: string
  /** Omit to render the label as plain text instead of a link. */
  href?: string
  external?: boolean
}

export interface FooterGroup {
  title: string
  links: FooterLink[]
}

export const footer = {
  blurb: `A permissionless launchpad for yield markets on ${chain.name}. ${brand.name} never custodies a deposit, never routes capital, and never vouches for a strategy.`,
  groups: [
    {
      title: 'Product',
      links: [
        { label: 'All markets', href: links.markets },
        { label: 'Launch a market', href: links.launch },
        { label: 'Manage a market', href: links.manage },
      ],
    },
    {
      // No hrefs here: the explorer URLs are not confirmed yet, so these are
      // names rather than links. Add `href` back once the addresses are real.
      title: 'Chain',
      links: [
        { label: chain.explorerName },
        { label: contracts.factoryName },
        { label: contracts.lensName },
      ],
    },
    {
      title: 'Understand it',
      links: [
        { label: 'The core flow', href: '#how-it-works' },
        { label: 'What gets deployed', href: '#the-vault' },
        { label: 'Live markets', href: '#markets' },
        { label: links.socialLabel, href: links.social, external: true },
      ],
    },
  ] as FooterGroup[],
  disclaimers: [
    `${brand.name} is infrastructure. A market listed here has not been reviewed, endorsed or diligenced by anyone.`,
    'A yield market can lose money. Capital sent to a strategy carries that strategy’s risk and may not return. Read the custody terms on a market before you deposit.',
    'Every transaction is constructed in your browser and signed in your own wallet.',
  ],
}
