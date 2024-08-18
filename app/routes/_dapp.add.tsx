import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react"
import { useAtom } from "jotai"

import { accountAtom } from "~/atoms/account"
import { chainReferenceAtom } from "~/atoms/chainReference"
import PrimaryButton from "~/components/primary-button"
import { ChainReference } from "~/ethereum/chain"
import { useTransaction } from "~/providers/transaction-provider"
import { useAnimatronikContract } from "~/utils/animatronik"
import { getClassname } from "~/utils/classname"
import { getEnv } from "~/utils/env.server"
import { useStyle } from "~/utils/style"

const CSS_STRIPES = `.stripes {
  animation: 4s linear 0s infinite move-around;
}

@keyframes move-around {
  0% {
    transform: translate(0, 0) rotate(0);
  }
  10% {
    transform: translate(30px, 0) rotate(36deg);
  }
  20% {
    transform: translate(100px, 0) rotate(72deg);
  }
  30% {
    transform: translate(300px, 0) rotate(108deg);
  }
  40% {
    transform: translate(300px, 300px) rotate(144deg);
  }
  50% {
    transform: translate(-300px, 300px) rotate(180deg);
  }
  60% {
    transform: translate(-300px, 0) rotate(216deg);
  }
  70% {
    transform: translate(-100px, 0) rotate(252deg);
  }
  80% {
    transform: translate(100px, 0) rotate(288deg);
  }
  90% {
    transform: translate(0, 0) rotate(324deg);
  }
  100% {
    transform: translate(0, 0) rotate(360deg);
  }
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
  <path d='m1302.5 1228.8 1300-97 1.5 176.6-1301.5-77.8v-1.8ZM1301.5 1228.8 0 1151l1.5 176.6 1300-97v-1.8Z'></path>
  <path d='M1301.2 1228.8 29 1499.1l53.7 169.1 1219.2-437.7-.6-1.7Z'></path>
  <path d='M1301 1229 159.8 1825.5l101.8 148.2L1302 1230.4l-1-1.4Z'></path>
  <path d='m1300.8 1229.1-918.5 875.1L524 2219.4l778.2-989.1-1.4-1.2Z'></path>
  <path d='m1300.6 1229.3-622 1083.5 170.1 73L1302.3 1230l-1.7-.8Z'></path>
  <path d='m1300.6 1229.6-275.8 1204.8 185 25 92.6-1229.6-1.8-.2Z'></path>
  <path d='m1300.6 1229.8 92.6 1229.6 185-25-275.8-1204.8-1.8.2Z'></path>
  <path d='m1300.6 1230 453.7 1155.8 170.1-73-622-1083.5-1.8.8Z'></path>
  <path d='m1300.8 1230.3 778.2 989.1 141.7-115.2-918.5-875-1.4 1Z'></path>
  <path d='m1301 1230.4 1040.4 743.3 101.8-148.1L1302 1229l-1 1.4Z'></path>
  <path d='m1301.2 1230.5 1219.1 437.7 53.8-169.1-1272.3-270.3-.6 1.7Z'></path>
  <path d='m1301.5 1230.6 1300 97 1.5-176.6-1301.5 77.8v1.8Z'></path>
</svg>`

export async function action({
  request,
  context,
}: ActionFunctionArgs) {
  const env = getEnv(context)
  const formData = await request.formData()

  switch (formData.get("_action")) {
    case "example": {
      return json({
        css: CSS_STRIPES,
        svg: SVG_STRIPES,
        cid: null,
        animatronik: null,
      })
    }
    case "preview": {
      const css = formData.get("css")
      const svg = formData.get("svg")

      if (typeof css !== "string" || !css) {
        throw json({ error: "CSS must be provided" }, { status: 404 })
      }

      if (typeof svg !== "string" || !svg) {
        throw json({ error: "SVG must be provided" }, { status: 404 })
      }

      return json({
        css,
        svg,
        cid: null,
        animatronik: {
          css,
          svg,
        },
      })
    }
    case "clear": {
      return json({
        css: "",
        svg: "",
        cid: null,
        animatronik: null,
      })
    }
    case "cid": {
      const css = formData.get("css")
      const svg = formData.get("svg")

      if (typeof css !== "string" || !css) {
        throw json({ error: "CSS must be provided" }, { status: 404 })
      }

      if (typeof svg !== "string" || !svg) {
        throw json({ error: "SVG must be provided" }, { status: 404 })
      }

      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${env.PINATA_JWT}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pinataContent: {
              css,
              svg,
            },
            pinataMetadata: {
              name: "File name",
            },
            pinataOptions: {
              cidVersion: 0,
            },
          }),
        },
      )
      const { IpfsHash } = (await res.json()) as { IpfsHash: string }

      return json({
        css,
        svg,
        cid: IpfsHash,
        animatronik: null,
      })
    }

    default: {
      throw new Error("Unknown action")
    }
  }
}

export function loader({ context }: LoaderFunctionArgs) {
  const env = getEnv(context)
  return { address: env.ANIMATRONIK_SEPOLIA_ADDRESS }
}

export default function AnimatronikPage() {
  const { address } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  useStyle(actionData?.animatronik ? [actionData.animatronik] : [])
  const navigation = useNavigation()
  const isGeneratingHash
    = navigation.formData
    && navigation.formData.get("_action") === "cid"
    && navigation.state === "submitting"

  return (
    <>
      <Form
        method="post"
        className="relative flex w-full flex-col items-center justify-center space-y-10 px-4"
      >
        <p className="flex w-full flex-col">
          <label
            htmlFor="css"
            className="font-rubik text-shadow text-lg md:text-3xl"
          >
            CSS
          </label>
          <textarea
            className="form-textarea h-72 rounded-4xl border-2 border-black py-4 px-2"
            id="css"
            name="css"
            wrap="off"
            defaultValue={actionData?.css}
          />
        </p>
        <p className="flex w-full flex-col">
          <label
            htmlFor="css"
            className="font-rubik text-shadow text-lg md:text-3xl"
          >
            SVG
          </label>
          <textarea
            className="form-textarea h-72 rounded-4xl border-2 border-black py-4 px-2"
            id="svg"
            name="svg"
            wrap="off"
            defaultValue={actionData?.svg}
          />
        </p>
        <section className="grid w-full grid-flow-row grid-cols-1 space-y-4 md:grid-cols-3 md:grid-rows-2 md:gap-x-2 md:gap-y-4 md:space-y-0">
          <PrimaryButton type="submit" name="_action" value="clear">
            Clear
          </PrimaryButton>
          <PrimaryButton type="submit" name="_action" value="example">
            Show me an example
          </PrimaryButton>
          <PrimaryButton
            type="submit"
            name="_action"
            value="preview"
            disabled={!actionData?.css}
          >
            See preview
          </PrimaryButton>
          <PrimaryButton
            type="submit"
            name="_action"
            value="cid"
            className={isGeneratingHash ? "cursor-wait" : undefined}
            disabled={Boolean(
              !actionData?.css || !actionData?.svg || isGeneratingHash,
            )}
          >
            Generate content hash
          </PrimaryButton>
          <MintButton address={address} />
        </section>
        {actionData?.animatronik
          ? (
            <section className="absolute top-1/4 right-10 flex flex-col space-y-4">
              <ul className="list-none">
                <li
                  key={actionData.animatronik.svg.slice(0, 30)}
                  className="h-60 w-60 overflow-hidden rounded-4xl border-2 border-black bg-white md:-right-10 [&>img]:h-full [&>img]:w-full"
                >
                  <img
                    src={`data:image/svg+xml;utf8,${actionData.animatronik.svg}`}
                    className={getClassname(actionData.animatronik.css)}
                  />
                </li>
              </ul>
              <PrimaryButton type="submit" name="_action" value="clear">
                Clear
              </PrimaryButton>
            </section>
            )
          : null}
      </Form>
      {isGeneratingHash
        ? (
          <span className="fixed right-4 bottom-4 animate-bounce rounded-2xl border-2 border-gray-500 bg-white p-2 font-semibold uppercase">
            Generating hash
          </span>
          )
        : null}
    </>
  )
}

function MintButton({ address }: { address: string }) {
  const [account] = useAtom(accountAtom)
  const [chainReference] = useAtom(chainReferenceAtom)
  const animatronikContract = useAnimatronikContract({ address })
  const actionData = useActionData<typeof action>()
  const { sendTransaction } = useTransaction()
  const isMintDisabled
    = !actionData?.css || !actionData?.svg || !actionData?.cid

  async function handleMintAnimatronik() {
    if (
      account === undefined
      || chainReference === undefined
      || animatronikContract === undefined
    ) {
      console.error("You need to connect Metamask")

      return
    }

    if (chainReference !== ChainReference.Sepolia) {
      console.error(
        "This section works on Optimism Goerli. Try changing to it from Metamask",
      )

      return
    }

    if (isMintDisabled) {
      return
    }

    const { cid } = actionData

    if (typeof cid !== "string") {
      return
    }
    // console.log("account", account)
    // console.log("cid", cid)

    sendTransaction(() => animatronikContract.safeMint(account, cid))
  }

  return (
    <PrimaryButton
      type="button"
      onClick={handleMintAnimatronik}
      disabled={isMintDisabled}
    >
      Mint
    </PrimaryButton>
  )
}
