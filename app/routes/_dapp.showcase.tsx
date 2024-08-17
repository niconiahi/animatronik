import { Link, useLoaderData } from "@remix-run/react"
import { json } from "@remix-run/cloudflare"

// import { getAnimatroniks } from "~/models/animatronik.server";
// import { hashClassname, hashKeyframe } from "~/utils/hashing";
import { getClassname } from "~/utils/classname"
import { useStyle } from "~/utils/style"
import PrimaryButton from "~/components/primary-button"

export async function loader() {
  // const animatroniks = getAnimatroniks()
  const animatroniks = []

  return json({ animatroniks })
}

export default function AnimatronikPage() {
  const loaderData = useLoaderData<typeof loader>()
  useStyle(loaderData.animatroniks)

  return (
    <>
      <section className="w-full">
        <ul className="grid grid-flow-row-dense grid-cols-1 place-items-center space-y-6 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3 xl:grid-cols-4">
          {(loaderData?.animatroniks ?? []).map(({ css, svg }, index) => (
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
      <Link to="/add" className="fixed right-4 bottom-4 md:right-10">
        <PrimaryButton>Create one</PrimaryButton>
      </Link>
    </>
  )
}
