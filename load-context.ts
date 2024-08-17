import type { PlatformProxy } from "wrangler"

// When using `wrangler.toml` to configure bindings,
// `wrangler types` will generate types for those bindings
// into the global `Env` interface.
// Need this empty interface so that typechecking passes
// even if no `wrangler.toml` exists.
interface Env {
  PINATA_JWT: string
  GATEWAY_URL: string
  ENVIRONMENT: string
  ANIMATRONIK_SEPOLIA_ADDRESS: string
}

type Cloudflare = Omit<PlatformProxy<Env>, "dispose">

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    cloudflare: Cloudflare
  }
}
