import { useEffect, useRef, useState } from 'react'
import {
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartConfiguration,
} from 'chart.js'

// Register only what the two charts on this site use.
Chart.register(
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
)

export interface ChartPalette {
  foreground: string
  muted: string
  mutedForeground: string
  border: string
  gridLine: string
  brand: string
  brandSoft: string
  card: string
  chart1: string
  chart2: string
  chart3: string
}

function readPalette(): ChartPalette {
  const s = getComputedStyle(document.documentElement)
  const v = (name: string) => s.getPropertyValue(name).trim()
  return {
    foreground: v('--foreground'),
    muted: v('--muted'),
    mutedForeground: v('--muted-foreground'),
    border: v('--border'),
    gridLine: v('--grid-line'),
    brand: v('--brand'),
    brandSoft: v('--brand-soft'),
    card: v('--card'),
    chart1: v('--chart-1'),
    chart2: v('--chart-2'),
    chart3: v('--chart-3'),
  }
}

/**
 * Watches the `dark` class on <html> so charts repaint when the theme flips.
 * Charts read colours from CSS variables rather than hard-coded hexes.
 */
function useThemedPalette(): ChartPalette | null {
  const [palette, setPalette] = useState<ChartPalette | null>(null)

  useEffect(() => {
    setPalette(readPalette())
    const observer = new MutationObserver(() => setPalette(readPalette()))
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  return palette
}

/**
 * Mounts a Chart.js instance on a canvas and rebuilds it whenever the theme
 * changes. Animation is switched off under `prefers-reduced-motion`.
 */
export function useChart(build: (palette: ChartPalette) => ChartConfiguration) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const buildRef = useRef(build)
  buildRef.current = build
  const palette = useThemedPalette()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !palette) return

    const config = buildRef.current(palette)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      config.options = { ...config.options, animation: false }
    }

    const chart = new Chart(canvas, config)
    return () => chart.destroy()
  }, [palette])

  return canvasRef
}
