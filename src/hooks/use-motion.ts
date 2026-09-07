import { useLayoutEffect, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const EASE = 'power2.out'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Builds the reveal animations for one subtree.
 *
 * Markup contract:
 *   [data-hero-intro]      container whose [data-reveal] children play on load
 *   [data-reveal]          fades and lifts into place when scrolled into view
 *   [data-reveal-stagger]  container whose [data-reveal] children share one
 *                          trigger and animate in sequence
 */
function buildReveals(scope: HTMLElement | Document) {
  // Children of a stagger container animate together; skip them below.
  const claimed = new Set<Element>()

  const groups =
    scope instanceof Document
      ? Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal-stagger]'))
      : [
          ...(scope.matches('[data-reveal-stagger]') ? [scope] : []),
          ...Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal-stagger]')),
        ]

  groups.forEach((group) => {
    const items = Array.from(group.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (items.length === 0) return
    items.forEach((item) => claimed.add(item))

    gsap.set(items, { y: 24 })
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: EASE,
      stagger: 0.07,
      scrollTrigger: { trigger: group, start: 'top 82%', once: true },
    })
  })

  const intro = scope.querySelector<HTMLElement>('[data-hero-intro]')
  if (intro) {
    const introItems = Array.from(intro.querySelectorAll<HTMLElement>('[data-reveal]'))
    introItems.forEach((item) => claimed.add(item))
    if (introItems.length > 0) {
      gsap.set(introItems, { y: 28 })
      gsap.to(introItems, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        ease: EASE,
        stagger: 0.09,
        delay: 0.05,
      })
    }
  }

  Array.from(scope.querySelectorAll<HTMLElement>('[data-reveal]'))
    .filter((el) => !claimed.has(el))
    .forEach((el) => {
      gsap.set(el, { y: 24 })
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      })
    })
}

/**
 * Site-wide motion. Everything is opt-in through `html.reveal-ready`, which
 * this hook adds only when motion is allowed. If JS never runs, or the
 * visitor asked for reduced motion, no element is ever left hidden.
 */
export function useMotion() {
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const root = document.documentElement
    root.classList.add('reveal-ready')

    const ctx = gsap.context(() => {
      buildReveals(document)
      // Fonts land after first paint and shift every trigger position.
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
    })

    return () => {
      ctx.revert()
      root.classList.remove('reveal-ready')
    }
  }, [])
}

/**
 * Reveals for a subtree that mounts after `useMotion` has already run, such as a
 * lazily loaded section. Without this its `[data-reveal]`
 * elements would stay hidden, since the site-wide context never saw them.
 */
export function useRevealScope(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => buildReveals(el), el)
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ref])
}

/** Subtle parallax drift, used on the hero backdrop only. */
export function useParallax(ref: RefObject<HTMLElement | null>, distance = 60) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: distance,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [ref, distance])
}
