import type { ReactElement } from "react"
import { truncate } from "~/utils/string"

export default function AddressDisplay({
  account,
}: {
  account: string
}): ReactElement {
  return (
    <aside className="flex items-center justify-center rounded-l-2xl border-t-2 border-b-2 border-l-2 border-gray-700 bg-white px-3 py-2 font-semibold uppercase md:px-6 md:py-3">
      <p>{truncate(account)}</p>
    </aside>
  )
}
