import { addressSchema } from "@ethernauta/eth"
import { create_contract, http } from "@ethernauta/transport"
import { hex_to_number, number_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"
import { Link, useLoaderData } from "react-router"

import { get_data } from "~/generated/animatronik/methods/get_data"
import { tokenByIndex } from "~/generated/animatronik/methods/token-by-index"
import { totalSupply } from "~/generated/animatronik/methods/total-supply"
import PrimaryButton from "~/components/primary-button"
import { getClassname } from "~/utils/classname"
import { decompress } from "~/utils/compress"
import { getEnv } from "~/utils/env.server"
import { useStyle } from "~/utils/style"
import { CHAIN_ID } from "./dapp"

import type { Route } from "./+types/dapp.showcase"

const SEPOLIA_RPC_URL =
  "https://ethereum-sepolia-rpc.publicnode.com"

type Animatronik = { css: string; svg: string }

export async function loader({ context }: Route.LoaderArgs) {
  const env = getEnv(context)
  const to = parse(
    addressSchema,
    env.ANIMATRONIK_SEPOLIA_ADDRESS,
  )
  const contract = create_contract([
    {
      chainId: CHAIN_ID,
      transports: [http(SEPOLIA_RPC_URL)],
    },
  ])

  const supply_hex = await totalSupply()(
    contract({ chain_id: CHAIN_ID, to }),
  )
  const supply = hex_to_number(supply_hex)

  const animatroniks: Animatronik[] = []

  for (let i = 0; i < supply; i++) {
    const token_id = await tokenByIndex({
      index: number_to_hex(i),
    })(contract({ chain_id: CHAIN_ID, to }))
    const compressed = await get_data({ token_id })(
      contract({ chain_id: CHAIN_ID, to }),
    )
    const json = await decompress(compressed)
    const animatronik = JSON.parse(json) as Animatronik
    animatroniks.push(animatronik)
  }

  return { animatroniks }
}

export default function Showcase() {
  const { animatroniks } = useLoaderData<typeof loader>()
  useStyle(animatroniks)

  return (
    <>
      <section className="w-full">
        <ul className="grid grid-flow-row-dense grid-cols-1 place-items-center space-y-6 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3 xl:grid-cols-4">
          {animatroniks.map(({ css, svg }, index) => (
            <li
              key={`${svg.slice(0, 30)}_${index}`}
              className="h-60 w-60 overflow-hidden rounded-4xl border-2 border-black bg-white [&>img]:h-full [&>img]:w-full"
            >
              <img
                src={`data:image/svg+xml;utf8,${svg}`}
                className={getClassname(css)}
              />
            </li>
          ))}
        </ul>
      </section>
      <Link
        to="/add"
        className="fixed right-4 bottom-4 md:right-10"
      >
        <PrimaryButton>Create one</PrimaryButton>
      </Link>
    </>
  )
}
