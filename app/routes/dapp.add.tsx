import { eip155_11155111 } from "@ethernauta/chain"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import {
  register_transaction,
  type Transaction,
  watch_transaction,
} from "@ethernauta/transaction"
import {
  addressSchema,
  create_signer,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"
import { parse } from "valibot"
import { useEffect, useRef, useState } from "react"
import {
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from "react-router"

import PrimaryButton from "~/components/primary-button"
import { mint } from "~/generated/animatronik/methods/mint"
import { getClassname } from "~/utils/classname"
import { compress } from "~/utils/compress"
import { getEnv } from "~/utils/env.server"
import { useStyle } from "~/utils/style"
import type { DappContext } from "./dapp"

import type { Route } from "./+types/dapp.add"

const SEPOLIA_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com"

const CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const signer = create_signer([{ chainId: CHAIN_ID }])

const writer = create_writer([
  { chainId: CHAIN_ID, transports: [http(SEPOLIA_RPC_URL)] },
])

const CSS_STRIPES = `.stripes {
  animation: 4s linear 0s infinite move-around;
}

@keyframes move-around {
  0% { transform: translate(0, 0) rotate(0); }
  10% { transform: translate(30px, 0) rotate(36deg); }
  20% { transform: translate(100px, 0) rotate(72deg); }
  30% { transform: translate(300px, 0) rotate(108deg); }
  40% { transform: translate(300px, 300px) rotate(144deg); }
  50% { transform: translate(-300px, 300px) rotate(180deg); }
  60% { transform: translate(-300px, 0) rotate(216deg); }
  70% { transform: translate(-100px, 0) rotate(252deg); }
  80% { transform: translate(100px, 0) rotate(288deg); }
  90% { transform: translate(0, 0) rotate(324deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
}`

const SVG_STRIPES = `<svg viewBox='0 0 2605 2460' xmlns='http://www.w3.org/2000/svg'>
  <path d='M1302.5 1230.6 1 1308.4l1.5-176.6 1300 97v1.8Z'></path>
  <path d='M1302.2 1230.5 30 960.3l53.7-169.1 1219.2 437.7-.6 1.6Z'></path>
  <path d='M1302 1230.4 160.8 634l101.8-148.1L1303 1229l-1 1.4Z'></path>
  <path d='M1301.8 1230.3 383.3 355.2 525 240l778.2 989.1-1.4 1.2Z'></path>
  <path d='m1301.6 1230-622-1083.4 170.1-73 453.6 1155.7-1.7.8Z'></path>
  <path d='M1301.6 1229.8 1025.8 25l185-25 92.6 1229.6-1.8.2Z'></path>
  <path d='M1301.6 1229.6 1394.2 0l185 25-275.8 1204.8-1.8-.2Z'></path>
  <path d='M1301.6 1229.3 1755.3 73.6l170.1 73-622 1083.5-1.8-.8Z'></path>
  <path d='M1301.8 1229.1 2080 240l141.7 115.2-918.5 875-1.4-1Z'></path>
  <path d='m1302 1229 1040.4-743.2 101.8 148L1303 1230.4l-1-1.5Z'></path>
  <path d='m1302.2 1228.9 1219.1-437.7 53.8 169.1-1272.3 270.3-.6-1.7Z'></path>
  <path d='m1302.5 1228.8 1300-97 1.5 176.6-1301.5-77.8v-1.8Z'></path>
</svg>`

export async function loader({ context }: Route.LoaderArgs) {
  const env = getEnv(context)
  return { contract_address: env.ANIMATRONIK_SEPOLIA_ADDRESS }
}

export async function action({ request }: Route.ActionArgs) {
  const form_data = await request.formData()

  switch (form_data.get("_action")) {
    case "example": {
      return { css: CSS_STRIPES, svg: SVG_STRIPES, animatronik: null }
    }
    case "preview": {
      const css = form_data.get("css")
      const svg = form_data.get("svg")
      if (typeof css !== "string" || !css) return { error: "CSS must be provided" }
      if (typeof svg !== "string" || !svg) return { error: "SVG must be provided" }
      return { css, svg, animatronik: { css, svg } }
    }
    case "clear": {
      return { css: "", svg: "", animatronik: null }
    }
    default: {
      throw new Error("Unknown action")
    }
  }
}

export default function Add({
  loaderData,
}: {
  loaderData: { contract_address: string }
}) {
  const { account } = useOutletContext<DappContext>()
  const action_data = useActionData<typeof action>()
  const navigation = useNavigation()
  const dialog_ref = useRef<HTMLDialogElement>(null)
  const [transaction, set_transaction] = useState<Transaction | null>(null)
  const [tx_error, set_tx_error] = useState<string | null>(null)

  const css = action_data && "css" in action_data ? action_data.css : ""
  const svg = action_data && "svg" in action_data ? action_data.svg : ""
  const animatronik = action_data && "animatronik" in action_data ? action_data.animatronik : null

  useStyle(animatronik ? [animatronik] : [])

  useEffect(() => {
    const dialog = dialog_ref.current
    if (!dialog) return
    if (transaction || tx_error) dialog.show()
    else dialog.close()
  }, [transaction, tx_error])

  async function handle_mint() {
    if (!account || !css || !svg) return
    set_tx_error(null)
    try {
      const compressed = await compress(JSON.stringify({ css, svg }))
      const to = parse(
        addressSchema,
        loaderData.contract_address,
      )
      const signed = await mint({ data: compressed })(
        signer({ chain_id: CHAIN_ID, to }),
      )
      const hash = await eth_sendRawTransaction([signed])(
        writer({ chain_id: CHAIN_ID }),
      )
      const tx = register_transaction(hash)
      set_transaction(tx)
      watch_transaction(hash, (updated) => {
        set_transaction(updated)
      })
    } catch (e) {
      set_tx_error(e instanceof Error ? e.message : "Unknown error")
    }
  }

  return (
    <>
      <Form
        method="post"
        className="relative flex w-full flex-col items-center justify-center space-y-10 px-4"
      >
        <p className="flex w-full flex-col">
          <label htmlFor="css" className="font-rubik text-shadow text-lg md:text-3xl">
            CSS
          </label>
          <textarea
            className="form-textarea h-72 rounded-4xl border-2 border-black py-4 px-2"
            id="css"
            name="css"
            wrap="off"
            defaultValue={css ?? ""}
          />
        </p>
        <p className="flex w-full flex-col">
          <label htmlFor="svg" className="font-rubik text-shadow text-lg md:text-3xl">
            SVG
          </label>
          <textarea
            className="form-textarea h-72 rounded-4xl border-2 border-black py-4 px-2"
            id="svg"
            name="svg"
            wrap="off"
            defaultValue={svg ?? ""}
          />
        </p>
        <section className="grid w-full grid-flow-row grid-cols-1 space-y-4 md:grid-cols-3 md:grid-rows-2 md:gap-x-2 md:gap-y-4 md:space-y-0">
          <PrimaryButton type="submit" name="_action" value="clear">
            Clear
          </PrimaryButton>
          <PrimaryButton type="submit" name="_action" value="example">
            Show me an example
          </PrimaryButton>
          <PrimaryButton type="submit" name="_action" value="preview" disabled={!css}>
            See preview
          </PrimaryButton>
          <PrimaryButton
            type="button"
            onClick={handle_mint}
            disabled={!account || !css || !svg}
          >
            Mint
          </PrimaryButton>
        </section>
        {animatronik ? (
          <section className="absolute top-1/4 right-10 flex flex-col space-y-4">
            <ul className="list-none">
              <li className="h-60 w-60 overflow-hidden rounded-4xl border-2 border-black bg-white [&>img]:h-full [&>img]:w-full">
                <img
                  src={`data:image/svg+xml;utf8,${animatronik.svg}`}
                  className={getClassname(animatronik.css)}
                />
              </li>
            </ul>
            <PrimaryButton type="submit" name="_action" value="clear">
              Clear
            </PrimaryButton>
          </section>
        ) : null}
      </Form>
      <dialog
        ref={dialog_ref}
        className="fixed bottom-4 right-4 rounded-md border-2 border-gray-900 bg-gray-50 p-3"
        style={{ margin: 0, top: "auto", left: "auto" }}
      >
        <div className="flex items-center gap-3">
          <div>
            {tx_error ? (
              <p className="text-sm text-red-600">{tx_error}</p>
            ) : transaction ? (
              <p className="text-sm">
                {transaction.status === "pending" && "Transaction pending…"}
                {transaction.status === "mined" && "Transaction mined!"}
                {transaction.status === "reverted" && "Transaction reverted"}
              </p>
            ) : null}
          </div>
          <button
            onClick={() => {
              set_transaction(null)
              set_tx_error(null)
              dialog_ref.current?.close()
            }}
            className="ml-2 text-gray-500 hover:text-gray-900"
          >
            ✕
          </button>
        </div>
      </dialog>
    </>
  )
}
