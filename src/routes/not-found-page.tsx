import { Link } from 'react-router'

import { Container } from '@/components/section'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <Container>
      <div className="rounded-2xl p-12 text-center neu-pressed md:p-16">
        <p className="tnum text-sm text-muted-foreground">404</p>
        <h1 className="mt-4 text-title font-semibold tracking-tight">Nothing at this address</h1>
        <p className="mx-auto mt-4 max-w-[48ch] text-[0.9375rem] text-muted-foreground">
          The page you asked for does not exist. The markets list is probably what you wanted.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="brand">
            <Link to="/markets">Browse markets</Link>
          </Button>
          <Button asChild>
            <Link to="/">Back to the site</Link>
          </Button>
        </div>
      </div>
    </Container>
  )
}
