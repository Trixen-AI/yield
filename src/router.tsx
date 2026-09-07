import { createBrowserRouter } from 'react-router'

import { MarketingPage } from '@/routes/marketing-page'

/**
 * The landing page ships in the initial bundle; everything behind it is loaded
 * on demand, which keeps wagmi, AppKit and TanStack Query out of the first
 * paint for someone who only ever reads the marketing site.
 */
export const router = createBrowserRouter([
  { path: '/', element: <MarketingPage /> },
  {
    lazy: async () => ({ Component: (await import('@/routes/app-layout')).AppLayout }),
    children: [
      {
        path: 'markets',
        lazy: async () => ({ Component: (await import('@/routes/markets-page')).MarketsPage }),
      },
      {
        path: 'markets/:marketId',
        lazy: async () => ({
          Component: (await import('@/routes/market-detail-page')).MarketDetailPage,
        }),
      },
      {
        path: 'launch',
        lazy: async () => ({ Component: (await import('@/routes/launch-page')).LaunchPage }),
      },
      {
        path: 'manage',
        lazy: async () => ({ Component: (await import('@/routes/manage-page')).ManagePage }),
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/routes/not-found-page')).NotFoundPage }),
      },
    ],
  },
])
