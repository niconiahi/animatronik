import { atom } from "jotai"

import type { ChainReference } from "~/ethereum/chain"

const baseAtom = atom<ChainReference | undefined>(undefined)
export const chainReferenceAtom = atom(get => get(baseAtom))
export const setChainReferenceAtom = atom(
  null,
  (_, set, nextChainReference: ChainReference | undefined) =>
    set(baseAtom, nextChainReference),
)
