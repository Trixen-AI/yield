import type { ComponentProps } from 'react'
import { Link } from 'react-router'

/**
 * The content layer mixes three kinds of href: app routes (`/launch`), in-page
 * anchors (`#markets`) and external URLs. This picks client-side navigation for
 * the first and a plain anchor for the other two, so a marketing CTA moves into
 * the app without a full page reload.
 */
export function SmartLink({ href, ...props }: ComponentProps<'a'> & { href: string }) {
  if (href.startsWith('/') && !href.startsWith('//')) {
    return <Link to={href} {...props} />
  }
  return <a href={href} {...props} />
}
