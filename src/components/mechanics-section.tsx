import { useRef, type ReactNode } from 'react'

import { Container, Section, SectionHead } from '@/components/section'
import { economics } from '@/content/brand'
import { mechanics } from '@/content/copy'
import { useChart } from '@/hooks/use-chart'
import { useRevealScope } from '@/hooks/use-motion'

/**
 * Schematic share-price curve. Deliberately unitless: it shows the *shape* of
 * the mechanism, not any market's real history, and the caption says so.
 */
const PERIODS = ['', '', '', '', '', '', '', '', '', '', '', '']
const SHARE_PRICE = [1, 1.004, 1.009, 1.011, 1.018, 1.024, 1.027, 1.035, 1.043, 1.048, 1.057, 1.066]
const PRINCIPAL = PERIODS.map(() => 1)

function SharePriceChart() {
  const canvasRef = useChart((p) => ({
    type: 'line',
    data: {
      labels: PERIODS,
      datasets: [
        {
          label: mechanics.sharePrice.seriesLabels.price,
          data: SHARE_PRICE,
          borderColor: p.brand,
          backgroundColor: p.brandSoft,
          borderWidth: 2,
          fill: true,
          tension: 0.35,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: p.brand,
          pointHoverBorderColor: p.card,
          pointHoverBorderWidth: 2,
        },
        {
          label: mechanics.sharePrice.seriesLabels.principal,
          data: PRINCIPAL,
          borderColor: p.chart3,
          borderWidth: 1,
          borderDash: [4, 4],
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: p.foreground,
          titleColor: p.card,
          bodyColor: p.card,
          borderWidth: 0,
          cornerRadius: 10,
          padding: 10,
          displayColors: false,
          callbacks: {
            title: () => '',
            label: (ctx) => `${ctx.dataset.label}: ${Number(ctx.parsed.y).toFixed(3)}`,
          },
        },
      },
      scales: {
        x: { grid: { display: false }, border: { color: p.border }, ticks: { display: false } },
        y: {
          grid: { color: p.gridLine },
          border: { display: false },
          ticks: {
            color: p.mutedForeground,
            font: { family: 'Fira Code, monospace', size: 10 },
            maxTicksLimit: 5,
            callback: (value) => Number(value).toFixed(2),
          },
        },
      },
    },
  }))

  return <canvas ref={canvasRef} role="img" aria-label={mechanics.sharePrice.caption} />
}

/**
 * Fee split at the cap. Every number here is derived from the two protocol
 * constants in `content/brand.ts`, so the chart cannot drift from the copy.
 */
const FEE_PCT = economics.maxPerformanceFeePct
const PROTOCOL_CUT = (FEE_PCT * economics.protocolFeeSharePct) / 100
const CREATOR_CUT = FEE_PCT - PROTOCOL_CUT
const DEPOSITOR_CUT = 100 - FEE_PCT

function FeeSplitChart() {
  const depositors = DEPOSITOR_CUT
  const creator = CREATOR_CUT
  const protocol = PROTOCOL_CUT

  const canvasRef = useChart((p) => ({
    type: 'bar',
    data: {
      labels: ['100 units of yield'],
      datasets: [
        {
          label: mechanics.feeSplit.labels.depositors,
          data: [depositors],
          backgroundColor: p.chart1,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: mechanics.feeSplit.labels.creator,
          data: [creator],
          backgroundColor: p.brand,
          borderRadius: 8,
          borderSkipped: false,
        },
        {
          label: mechanics.feeSplit.labels.protocol,
          data: [protocol],
          backgroundColor: p.chart3,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: p.foreground,
          titleColor: p.card,
          bodyColor: p.card,
          borderWidth: 0,
          cornerRadius: 10,
          padding: 10,
          displayColors: false,
          callbacks: {
            title: () => '',
            label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.x} units`,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          max: 100,
          grid: { color: p.gridLine },
          border: { display: false },
          ticks: {
            color: p.mutedForeground,
            font: { family: 'Fira Code, monospace', size: 10 },
            callback: (value) => `${value}`,
          },
        },
        y: {
          stacked: true,
          grid: { display: false },
          border: { display: false },
          ticks: { display: false },
        },
      },
    },
  }))

  return <canvas ref={canvasRef} role="img" aria-label={mechanics.feeSplit.title} />
}

function FeeSplitLegend() {
  const legend = [
    { label: mechanics.feeSplit.labels.depositors, value: DEPOSITOR_CUT, swatch: 'bg-chart-1' },
    { label: mechanics.feeSplit.labels.creator, value: CREATOR_CUT, swatch: 'bg-brand' },
    { label: mechanics.feeSplit.labels.protocol, value: PROTOCOL_CUT, swatch: 'bg-chart-3' },
  ]

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {legend.map((entry) => (
        <li key={entry.label} className="flex items-center gap-2 text-[0.8125rem]">
          <span className={`size-2.5 shrink-0 rounded-full ${entry.swatch}`} aria-hidden="true" />
          <span className="text-muted-foreground">{entry.label}</span>
          <span className="tnum font-medium">{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}

function ChartPanel({
  title,
  caption,
  note,
  legend,
  children,
}: {
  title: string
  caption: string
  note: string
  legend?: ReactNode
  children: ReactNode
}) {
  return (
    <figure className="min-w-0 rounded-2xl p-6 neu-raised" data-reveal>
      <figcaption>
        <h3 className="text-[1.0625rem] font-semibold tracking-tight">{title}</h3>
        <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">{caption}</p>
      </figcaption>
      {/* `relative` gives Chart.js a box to measure and `min-w-0` lets that box
          shrink. Without the latter the canvas keeps its intrinsic 300px, the
          grid item refuses to go narrower, and the panel runs off small
          screens. */}
      <div className="relative mt-6 h-56 min-w-0 rounded-xl p-3 neu-pressed">{children}</div>
      {legend ? <div className="mt-5">{legend}</div> : null}
      <p className="mt-6 text-[0.8125rem] leading-relaxed text-pretty text-muted-foreground">
        {note}
      </p>
    </figure>
  )
}

export default function MechanicsSection() {
  // This section is lazy-loaded, so it mounts after the site-wide motion
  // context was built and has to register its own reveals.
  const ref = useRef<HTMLDivElement>(null)
  useRevealScope(ref)

  return (
    <Section id="mechanics">
      <Container>
        <div ref={ref}>
          <SectionHead eyebrow={mechanics.eyebrow} title={mechanics.title} lead={mechanics.lead} />

          <div className="mt-14 grid gap-6 lg:grid-cols-2 [&>*]:min-w-0" data-reveal-stagger>
            <ChartPanel
              title={mechanics.sharePrice.title}
              caption={mechanics.sharePrice.caption}
              note={mechanics.sharePrice.note}
            >
              <SharePriceChart />
            </ChartPanel>

            <ChartPanel
              title={mechanics.feeSplit.title}
              caption={`${mechanics.feeSplit.captionPrefix} ${economics.maxPerformanceFee}.`}
              note={mechanics.feeSplit.note}
              legend={<FeeSplitLegend />}
            >
              <FeeSplitChart />
            </ChartPanel>
          </div>
        </div>
      </Container>
    </Section>
  )
}
