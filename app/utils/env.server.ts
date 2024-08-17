import type { AppLoadContext } from "@remix-run/cloudflare"

interface Env {
  PINATA_JWT: string
  GATEWAY_URL: string
  ENVIRONMENT: string
  ANIMATRONIK_SEPOLIA_ADDRESS: string
}

export function getEnv(context: AppLoadContext): Env {
  return context.cloudflare.env
}
