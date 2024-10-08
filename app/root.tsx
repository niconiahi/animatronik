import type { LinksFunction } from "@remix-run/cloudflare"
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"

import a11yStyles from "~/styles/a11y.css?url"
import animationsStyles from "~/styles/animations.css?url"
import globalStyles from "~/styles/global.css?url"
import tailwindStyles from "~/styles/tailwind.css?url"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: a11yStyles },
  { rel: "stylesheet", href: globalStyles },
  { rel: "stylesheet", href: tailwindStyles },
  { rel: "stylesheet", href: animationsStyles },
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
