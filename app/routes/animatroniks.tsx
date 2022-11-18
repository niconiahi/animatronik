import type { ThrownResponse } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { Form, useActionData, useCatch } from "@remix-run/react";
import type { ActionArgs } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { useEffect } from "react";
import { getAnimatroniks } from "~/models/animatronik.server";
import { useTransaction } from "~/providers/transaction-provider";
import { ChainReference, useXyz } from "~/providers/xyz-provider";
import invariant from "tiny-invariant";
import { useAnimatronikContract } from "~/utils/contracts";
import { useConnectMetamask } from "~/utils/metamask";
import AddressDisplay from "~/components/address-display";

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();

  switch (formData.get("_action")) {
    case "example": {
      return json({
        css: CSS_STRIPES,
        svg: SVG_STRIPES,
        animatroniks: [],
      });
    }
    case "clear": {
      return json({
        css: "",
        svg: "",
        animatroniks: [],
      });
    }
    default: {
      throw new Error("Unknown action");
    }
  }
}

export async function loader() {
  const animatroniks = await getAnimatroniks();

  return json({ animatroniks });
}

export default function AnimatronikPage() {
  const connectMetamask = useConnectMetamask();
  const { account } = useXyz();
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  async function handleConnectMetamaskClick(): Promise<void> {
    connectMetamask();
  }

  useEffect(() => {
    if (!document || actionData?.animatroniks === undefined) return;

    const prevStyles = document.querySelector("#animatronik-styles");

    if (prevStyles) {
      prevStyles.remove();
    }

    const style = document.createElement("style");
    const css = actionData.animatroniks
      .map(({ css }) => hashClassname(hashKeyframe(css)))
      .join("\n\n");
    style.textContent = css;
    style.id = "animatronik-styles";
    document.head.appendChild(style);
  }, [actionData]);

  return (
    <>
      <header className="flex justify-end border-b-2 border-black p-4">
        {account ? (
          <AddressDisplay account={account} />
        ) : (
          <button className="btn-primary" onClick={handleConnectMetamaskClick}>
            Connect
          </button>
        )}
      </header>
      <main className="min-h-screen flex-col bg-white py-20 sm:flex sm:items-center sm:justify-center">
        <Form
          method="post"
          className="flex w-full flex-col items-center justify-center space-y-20 px-4 md:w-3/4"
        >
          <ul className="grid grid-cols-1 place-items-center space-y-6 md:grid-cols-2 md:gap-6 md:space-y-0">
            {loaderData.animatroniks.map(({ css, svg }, index) => (
              <li
                key={svg.slice(0, 30) + `_${index}`}
                className="h-60 w-60 overflow-hidden border-2 border-black [&>img]:h-full [&>img]:w-full"
              >
                <img
                  src={`data:image/svg+xml;utf8,${svg}`}
                  className={getClassname(css)}
                />
              </li>
            ))}
          </ul>
          <div className="flex w-full flex-col space-x-0 space-y-20 lg:flex-row lg:space-x-20 lg:space-y-0">
            <p className="flex w-full flex-col">
              <label htmlFor="css">CSS</label>
              <textarea
                className="form-textarea h-72 border-2 border-black"
                id="css"
                name="css"
                value={actionData?.css}
              />
            </p>
            <p className="flex w-full flex-col">
              <label htmlFor="svg">SVG</label>
              <textarea
                className="form-textarea h-72 border-2 border-black"
                id="svg"
                name="svg"
                value={actionData?.svg}
              />
            </p>
          </div>
          <section className="flex space-x-4">
            <button
              className="btn-primary"
              type="submit"
              name="_action"
              value="example"
            >
              Show me an example
            </button>
            <button
              className="btn-primary"
              type="submit"
              name="_action"
              value="clear"
            >
              Clear
            </button>
          </section>
        </Form>
        <MintButton />
      </main>
    </>
  );
}

function MintButton() {
  const { chainReference, account } = useXyz();
  const animatronikContract = useAnimatronikContract();
  const actionData = useActionData<typeof action>();
  const { sendTransaction } = useTransaction();
  const isMintDisabled = !actionData?.css || !actionData?.svg;

  async function handleMintAnimatronik() {
    if (
      account === undefined ||
      chainReference === undefined ||
      animatronikContract === undefined
    ) {
      console.log("You need to connect Metamask");

      return;
    }

    if (chainReference !== ChainReference.OptimismGoerli) {
      console.log(
        "This section works on Optimism Goerli. Try changing to it from Metamask"
      );

      return;
    }

    if (isMintDisabled) return;

    const { css, svg } = actionData;
    sendTransaction(() => animatronikContract.safeMint(account, css, svg));
  }

  return (
    <>
      <button
        className="btn-primary"
        onClick={handleMintAnimatronik}
        disabled={isMintDisabled}
      >
        Mint
      </button>
    </>
  );
}

export function CatchBoundary() {
  const caught = useCatch<ThrownResponse<404, { error: string }>>();

  return (
    <main>
      <h1>{caught.data.error}</h1>
      <p>Status {caught.status}</p>
    </main>
  );
}

function getRandomString() {
  return (Math.random() + 1).toString(36).substring(7);
}

function hashKeyframe(css: string) {
  const KEYFRAME_REGEX = /(?<=\@keyframes)(.*?)(?=\{)/;
  const keyframeMatch = css.match(KEYFRAME_REGEX);
  const keyframe = keyframeMatch?.[0].trim();
  const keyframeHash = keyframe ? `${keyframe}-${getRandomString()}` : null;
  const EVERY_KEYFRAME_REGEX = new RegExp(`${keyframe}`, "gm");

  return keyframe && keyframeHash
    ? css.replace(EVERY_KEYFRAME_REGEX, keyframeHash)
    : css;
}

function hashClassname(css: string) {
  const CLASS_NAME_REGEX = /(?<=\.)(.*?)(?=\s)/;
  const classNameMatch = css.match(CLASS_NAME_REGEX);

  if (classNameMatch) {
    const classNameHash = `${classNameMatch[0].trim()}-${getRandomString()}`;

    return css.replace(CLASS_NAME_REGEX, `${classNameHash} `);
  } else {
    throw json({ error: "No class name found", status: 404 });
  }
}

function getClassname(css: string) {
  const CLASS_NAME_REGEX = /(?<=\.)(.*?)(?=\s)/;
  const classNameMatch = css.match(CLASS_NAME_REGEX);

  invariant(classNameMatch, "An animatronik should contain a CSS class");

  return classNameMatch[0].trim();
}

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
}`;

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
</svg>`;
