import { Web3Provider } from "@ethersproject/providers";
import { atomWithListeners } from "~/utils/atom-with-listener";

export enum ChainReference {
  Mainnet = 1,
  Localhost = 539,
  OptimismGoerli = 420,
}

export const [providerAtom, useProviderListener] = atomWithListeners(
  typeof window !== "undefined" &&
    typeof (window as any).ethereum !== "undefined"
    ? new Web3Provider((window as any).ethereum)
    : undefined
);
