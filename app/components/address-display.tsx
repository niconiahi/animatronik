import type { ReactElement } from "react";
import { truncate } from "~/utils/string";

export default function AddressDisplay({
  account,
}: {
  account: string;
}): ReactElement {
  return (
    <aside className="flex h-10 items-center justify-center space-x-2 rounded-md border-2 border-gray-900 bg-white p-2">
      <span className="h-2 w-2 rounded bg-green-400 outline outline-1 outline-gray-900" />
      <p>{truncate(account)}</p>
    </aside>
  );
}
