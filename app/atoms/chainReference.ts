import { big } from "~/utils/big-number";
import { atom } from "jotai";
import type { ChainReference } from "~/atoms/provider";
import { providerAtom } from "~/atoms/provider";

const baseAtom = atom<ChainReference | undefined>(undefined);
export const chainReferenceAtom = atom((get) => get(baseAtom));
export const setChainReferenceAtom = atom(
  null,
  async (_, set, nextChainReference: ChainReference | undefined) =>
    set(baseAtom, nextChainReference)
);
