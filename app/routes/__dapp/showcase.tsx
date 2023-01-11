import type { ThrownResponse } from "@remix-run/react";
import { Link } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { useCatch } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";
import { getAnimatroniks } from "~/models/animatronik.server";
import { hashClassname, hashKeyframe } from "~/utils/hashing";
import { getClassname } from "~/utils/classname";
import { useStyle } from "~/utils/style";
import PrimaryButton from "~/components/primary-button";

export async function loader() {
  const animatroniks = await getAnimatroniks();
  const nextAnimatroniks = animatroniks.map((animatronik) => ({
    ...animatronik,
    css: hashClassname(hashKeyframe(animatronik.css)),
  }));

  return json({ animatroniks: nextAnimatroniks });
}

export default function AnimatronikPage() {
  const loaderData = useLoaderData<typeof loader>();
  useStyle(loaderData.animatroniks);

  return (
    <>
      <section className="w-full">
        <ul className="grid grid-flow-row-dense grid-cols-1 place-items-center space-y-6 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3 xl:grid-cols-4">
          {loaderData?.animatroniks.map(({ css, svg }, index) => (
            <li
              key={svg.slice(0, 30) + `_${index}`}
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
