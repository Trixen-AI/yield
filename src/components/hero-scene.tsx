import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * An interactive faceted gem. Drag it to turn it; let go and it carries the
 * spin, settling back into a slow idle rotation.
 *
 * It is a brilliant cut built from three solids sharing one flat-shaded
 * material: an eight-sided crown running down to the girdle, the girdle band
 * itself, and the pavilion tapering to a point. Flat shading is what makes it
 * read as cut stone rather than a smooth cone, and a generated room environment
 * gives the facets something to reflect, which is most of why it looks like a
 * gem at all rather than a blue cone.
 *
 * Colour comes from the CSS custom properties, so it follows the theme and
 * stays inside the project palette. The key light sits at the top-left, the
 * same place the CSS neumorphic shadows are lit from. Nothing sits behind it;
 * the canvas is transparent.
 */

const SEGMENTS = 8
const GIRDLE_RADIUS = 1
const TABLE_RADIUS = 0.52
const CROWN_HEIGHT = 0.42
const GIRDLE_HEIGHT = 0.1
const PAVILION_HEIGHT = 1.45

/** Radians per second while nobody is touching it. */
const IDLE_SPIN = 0.45
const DAMPING = 0.94

function readGemColor() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()
  return value || '#1d4fd8'
}

export default function HeroScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      // No WebGL. The hero simply has no 3D object; nothing else breaks.
      return
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    mount.appendChild(renderer.domElement)
    const canvas = renderer.domElement
    Object.assign(canvas.style, {
      width: '100%',
      height: '100%',
      display: 'block',
      cursor: 'grab',
      touchAction: 'none',
    })

    const scene = new THREE.Scene()

    // Facets need something to reflect. A generated room is far cheaper than
    // loading an HDR and is enough to give every face its own highlight.
    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = environment
    pmrem.dispose()

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    camera.position.set(0, 0.6, 7.2)
    camera.lookAt(0, 0, 0)

    // Outer group: intro, float and scroll tilt. Inner group: the spin the user
    // drives, so the two never fight over the same property.
    const root = new THREE.Group()
    const spin = new THREE.Group()
    root.add(spin)
    scene.add(root)

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(readGemColor()),
      roughness: 0.12,
      metalness: 0.3,
      envMapIntensity: 1.15,
      flatShading: true,
    })

    // The girdle sits at y = 0; the crown rises from it and the pavilion drops.
    const crownGeo = new THREE.CylinderGeometry(TABLE_RADIUS, GIRDLE_RADIUS, CROWN_HEIGHT, SEGMENTS)
    const girdleGeo = new THREE.CylinderGeometry(
      GIRDLE_RADIUS,
      GIRDLE_RADIUS,
      GIRDLE_HEIGHT,
      SEGMENTS,
    )
    const pavilionGeo = new THREE.CylinderGeometry(GIRDLE_RADIUS, 0, PAVILION_HEIGHT, SEGMENTS)

    const crown = new THREE.Mesh(crownGeo, material)
    crown.position.y = GIRDLE_HEIGHT / 2 + CROWN_HEIGHT / 2

    const girdle = new THREE.Mesh(girdleGeo, material)

    const pavilion = new THREE.Mesh(pavilionGeo, material)
    pavilion.position.y = -GIRDLE_HEIGHT / 2 - PAVILION_HEIGHT / 2

    const gem = new THREE.Group()
    gem.add(crown, girdle, pavilion)
    // Centre on the whole stone's height rather than on the girdle.
    const top = GIRDLE_HEIGHT / 2 + CROWN_HEIGHT
    const bottom = -GIRDLE_HEIGHT / 2 - PAVILION_HEIGHT
    gem.position.y = -(top + bottom) / 2
    gem.scale.setScalar(1.55)
    spin.add(gem)

    // Key light at the top-left, matching the CSS light source.
    const key = new THREE.DirectionalLight(0xffffff, 2.1)
    key.position.set(-4, 5, 4)
    scene.add(key)

    const rim = new THREE.DirectionalLight(0xffffff, 1.3)
    rim.position.set(3.5, -2, -3)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(mount)

    const render = () => renderer.render(scene, camera)

    const themeObserver = new MutationObserver(() => {
      material.color.set(readGemColor())
      render()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // --- Interaction ---------------------------------------------------------
    let dragging = false
    let lastX = 0
    let lastY = 0
    let velocityY = IDLE_SPIN
    let velocityX = 0
    let idleTimer = 0

    const onPointerDown = (event: PointerEvent) => {
      dragging = true
      lastX = event.clientX
      lastY = event.clientY
      idleTimer = 0
      canvas.setPointerCapture(event.pointerId)
      canvas.style.cursor = 'grabbing'
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      const dx = event.clientX - lastX
      const dy = event.clientY - lastY
      lastX = event.clientX
      lastY = event.clientY
      spin.rotation.y += dx * 0.008
      spin.rotation.x = THREE.MathUtils.clamp(spin.rotation.x + dy * 0.006, -0.8, 0.8)
      velocityY = dx * 0.35
      velocityX = dy * 0.25
    }

    const onPointerUp = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      canvas.releasePointerCapture(event.pointerId)
      canvas.style.cursor = 'grab'
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)
    canvas.addEventListener('pointercancel', onPointerUp)

    let frame = 0
    let visible = true
    const clock = new THREE.Clock()

    const loop = () => {
      frame = requestAnimationFrame(loop)
      if (!visible) return
      const dt = Math.min(clock.getDelta(), 0.05)

      if (!dragging) {
        // Carry the throw, then ease back to the idle drift.
        velocityY = velocityY * DAMPING + IDLE_SPIN * (1 - DAMPING)
        velocityX *= DAMPING
        spin.rotation.y += velocityY * dt
        spin.rotation.x = THREE.MathUtils.clamp(spin.rotation.x + velocityX * dt, -0.8, 0.8)

        // Settle the tilt back to level once the throw has died down.
        idleTimer += dt
        if (idleTimer > 1.2) spin.rotation.x += (0 - spin.rotation.x) * dt * 1.6
      }

      render()
    }

    // Stop the loop while the hero is off-screen; there is no reason to burn a
    // phone battery rendering something nobody is looking at.
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) clock.getDelta()
      },
      { threshold: 0 },
    )
    visibility.observe(mount)

    let ctx: gsap.Context | undefined

    if (reduced) {
      // No autonomous motion, but dragging still works: that is user-initiated.
      velocityY = 0
      spin.rotation.set(0.12, 0.4, 0)
      render()
      frame = requestAnimationFrame(loop)
    } else {
      root.scale.setScalar(0.72)
      frame = requestAnimationFrame(loop)

      ctx = gsap.context(() => {
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .to(root.scale, { x: 1, y: 1, z: 1, duration: 1.2 }, 0)
          .from(spin.rotation, { y: -1.8, duration: 1.6, ease: 'power2.out' }, 0)

        gsap.to(root.position, {
          y: 0.16,
          duration: 3.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })

        gsap.to(root.rotation, {
          x: 0.24,
          ease: 'none',
          scrollTrigger: { trigger: mount, start: 'top 70%', end: 'bottom top', scrub: 0.6 },
        })
      })
    }

    setReady(true)

    return () => {
      cancelAnimationFrame(frame)
      ctx?.revert()
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('pointercancel', onPointerUp)
      resizeObserver.disconnect()
      visibility.disconnect()
      themeObserver.disconnect()
      crownGeo.dispose()
      girdleGeo.dispose()
      pavilionGeo.dispose()
      material.dispose()
      environment.dispose()
      renderer.dispose()
      canvas.remove()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={className}
      role="img"
      aria-label="Interactive 3D gem. Drag to rotate."
      style={{ opacity: ready ? 1 : 0, transition: 'opacity 600ms ease' }}
    />
  )
}
