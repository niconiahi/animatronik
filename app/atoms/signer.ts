import { atom } from "jotai"

import { providerAtom } from "~/atoms/provider"

export const signerAtom = atom(
  get => get(providerAtom)?.getSigner() ?? undefined,
)
