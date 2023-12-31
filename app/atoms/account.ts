import { atom } from "jotai"

const baseAtom = atom<string | undefined>(undefined)
export const accountAtom = atom(get => get(baseAtom))
export const setAccountAtom = atom(
  null,
  async (_, set, nextAccount: string | undefined) => set(baseAtom, nextAccount),
)
