import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Match on a package boundary. An earlier version tested for
          // `/react/` anywhere in the id, which swallowed @tanstack/react-query,
          // lucide-react and every AppKit react entry into the react chunk and
          // inflated it to 551 kB gzip.
          const path = id.split('\\').join('/')
          if (!path.includes('/node_modules/')) return
          const inPkg = (name: string) => path.includes(`/node_modules/${name}/`)

          if (inPkg('gsap')) return 'gsap'
          if (inPkg('chart.js')) return 'chart'
          if (inPkg('three')) return 'three'
          if (inPkg('lucide-react')) return 'icons'
          if (inPkg('radix-ui') || path.includes('/node_modules/@radix-ui/')) return 'radix'
          // The wallet stack is deliberately NOT grouped. Naming a chunk for it
          // made the entry import Vite's preload helper from that chunk, which
          // put a 460 kB modulepreload on the landing page for code only the
          // app routes use. Left alone, Rollup keeps it in the lazy graph and
          // AppKit keeps splitting its own modal views.
          if (inPkg('react') || inPkg('react-dom') || inPkg('scheduler')) return 'react'
        },
      },
    },
  },
  server: { port: 5173, open: false },
})
