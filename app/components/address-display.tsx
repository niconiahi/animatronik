import type { ReactElement } from "react";
import { truncate } from "~/utils/string";

export default function AddressDisplay({
  account,
}: {
  account: string;
}): ReactElement {
  return (
    <aside className="flex items-center justify-center space-x-2 rounded-4xl border-2 border-gray-700 px-6 py-3 font-semibold uppercase md:px-8 md:py-4">
      <span className="h-2 w-2 rounded bg-green-400 outline outline-2 outline-gray-900" />
      <p>{truncate(account)}</p>
    </aside>
  );
}
