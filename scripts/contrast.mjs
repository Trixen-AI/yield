/**
 * Reads the colour tokens straight out of src/index.css and checks every pair
 * the design actually relies on, in both themes.
 *
 *   node scripts/contrast.mjs      (or: npm run contrast)
 *
 * Neumorphism is flagged high-risk for accessibility precisely because its
 * surfaces sit so close together in luminance. This keeps that honest.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(join(root, 'src/index.css'), 'utf8')

function parseBlock(selector) {
  const start = css.indexOf(selector)
  if (start === -1) throw new Error(`Block not found: ${selector}`)
  const open = css.indexOf('{', start)
  const end = css.indexOf('\n}', open)
  const body = css.slice(open, end)
  const tokens = {}
  for (const [, name, value] of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    tokens[name] = value
  }
  return tokens
}

function srgbToLinear(channel) {
  const c = channel / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function luminance(hex) {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16))
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b)
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** [label, foreground token, background token, required ratio] */
const PAIRS = [
  ['body text on surface', 'foreground', 'background', 4.5],
  ['muted text on surface', 'muted-foreground', 'background', 4.5],
  ['muted text on sunken surface', 'muted-foreground', 'muted', 4.5],
  ['brand text on surface', 'brand', 'background', 4.5],
  ['brand text on brand-soft', 'brand', 'brand-soft', 4.5],
  ['label on solid brand', 'brand-foreground', 'brand', 4.5],
  ['label on solid primary', 'primary-foreground', 'primary', 4.5],
  ['text on popover', 'popover-foreground', 'popover', 4.5],
  ['destructive on surface', 'destructive', 'background', 4.5],
  // Non-text (WCAG 1.4.11): a boundary needed to identify a control needs 3:1.
  // `--border` is decorative, dividers inside an already-identifiable panel
  // so it is reported for information but not required to pass.
  ['strong border vs surface', 'border-strong', 'background', 3],
  ['focus ring vs surface', 'ring', 'background', 3],
]

/** Reported, never enforced: decorative separators are exempt from 1.4.11. */
const INFORMATIONAL = [['decorative divider vs surface', 'border', 'background']]

let failures = 0

for (const [themeName, selector] of [
  ['light', ':root {'],
  ['dark', '.dark {'],
]) {
  const tokens = parseBlock(selector)
  console.log(`\n  ${themeName.toUpperCase()}`)
  for (const [label, fg, bg, required] of PAIRS) {
    if (!tokens[fg] || !tokens[bg]) {
      console.log(`  ?  ${label.padEnd(30)} missing token`)
      continue
    }
    const ratio = contrast(tokens[fg], tokens[bg])
    const ok = ratio >= required
    if (!ok) failures++
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(30)} ${ratio.toFixed(2)}:1  (needs ${required})`,
    )
  }
  for (const [label, fg, bg] of INFORMATIONAL) {
    const ratio = contrast(tokens[fg], tokens[bg])
    console.log(`  --    ${label.padEnd(30)} ${ratio.toFixed(2)}:1  (decorative)`)
  }
}

console.log(
  failures === 0 ? '\n  All pairs meet their target.\n' : `\n  ${failures} pair(s) below target.\n`,
)
process.exit(failures === 0 ? 0 : 1)
